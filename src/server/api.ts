import twilio from "twilio";
import express from "express";
import { db } from "../db/index.ts";
import * as schema from "../db/schema.ts";
import { eq, desc, asc, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

export const apiRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "trivir-super-secret-key-change-in-prod";

// Middleware to verify admin
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Ensure uploads dir exists for multer
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ 
  storage,
  limits: {
    fileSize: 150 * 1024 * 1024 // 150MB limit
  }
});

// --- AUTH ---

apiRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const users = await db.select().from(schema.adminProfiles).where(eq(schema.adminProfiles.email, email));
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, requiresPasswordChange: user.requiresPasswordChange });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user.id;

  try {
    const users = await db.select().from(schema.adminProfiles).where(eq(schema.adminProfiles.id, userId));
    const user = users[0];
    
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) return res.status(400).json({ error: "Incorrect current password" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.update(schema.adminProfiles)
      .set({ passwordHash: newHash, requiresPasswordChange: false })
      .where(eq(schema.adminProfiles.id, userId));
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- FILE UPLOAD ---
apiRouter.post("/upload", requireAuth, (req: any, res: any, next: any) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "File upload error" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });
});

// --- PUBLIC DATA (READ) ---
apiRouter.get("/public-data", async (req, res) => {
  try {
    const schoolInfo = await db.select().from(schema.schoolInformation);
    const homepage = await absolute(schema.homepageContent);
    const mgmt = await db.select().from(schema.management).orderBy(asc(schema.management.displayOrder));
    const teachersList = await db.select().from(schema.teachers).where(eq(schema.teachers.isPublished, true)).orderBy(asc(schema.teachers.displayOrder));
    const academicsInfo = await db.select().from(schema.academics);
    const facilitiesList = await db.select().from(schema.facilities).where(eq(schema.facilities.isPublished, true)).orderBy(asc(schema.facilities.displayOrder));
    const achievementsList = await db.select().from(schema.achievements).where(eq(schema.achievements.isPublished, true));
    const eventsList = await db.select().from(schema.events).where(eq(schema.events.isPublished, true));
    const noticesList = await db.select().from(schema.notices).where(eq(schema.notices.isPublished, true));
    const galleryList = await db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.displayOrder));
    const videosList = await db.select().from(schema.videos).where(eq(schema.videos.isPublished, true));
    const admissionInfo = await db.select().from(schema.admissionInformation);

    res.json({
      schoolInformation: schoolInfo[0] || {},
      homepageContent: homepage[0] || {},
      management: mgmt,
      teachers: teachersList,
      academics: academicsInfo[0] || {},
      facilities: facilitiesList,
      achievements: achievementsList,
      events: eventsList,
      notices: noticesList,
      gallery: galleryList,
      videos: videosList,
      admissionInformation: admissionInfo[0] || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

async function absolute(table: any) {
  return db.select().from(table);
}

// --- ADMISSION ENQUIRY ---
apiRouter.post("/enquiries", async (req, res) => {
  const { studentName, parentName, applyingClass, phone, email, message } = req.body;
  if (!studentName || !parentName || !applyingClass || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
  }
  try {
    await db.insert(schema.admissionEnquiries).values({
      studentName,
      parentName,
      applyingClass,
      phone,
      email: email || null,
      message: message || null,
      createdAt: new Date().toISOString()
    });

    // Send auto-notification via Twilio if configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const autoMessage = `Hi ${parentName}, we have successfully received your admission request for ${studentName} (Class: ${applyingClass}). We will contact you shortly! - Trivir Public School`;
        
        let formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

        if (process.env.TWILIO_PHONE_NUMBER) {
          await client.messages.create({
            body: autoMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone
          });
        }
        if (process.env.TWILIO_WHATSAPP_NUMBER) {
          await client.messages.create({
            body: autoMessage,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${formattedPhone}`
          });
        }
      } catch (twilioErr) {
        console.error("Twilio Error: ", twilioErr);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// --- ADMIN API (PROTECTED) ---

// Generic get all
function createAdminGet(path: string, table: any, orderByFn?: any) {
  apiRouter.get(path, requireAuth, async (req, res) => {
    try {
      let query: any = db.select().from(table);
      if (orderByFn) {
        query = query.orderBy(orderByFn);
      }
      const data = await query;
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
}

// Generic get single item for singletons (e.g. schoolInfo)
function createAdminGetSingle(path: string, table: any) {
  apiRouter.get(path, requireAuth, async (req, res) => {
    try {
      const data = await db.select().from(table);
      res.json(data[0] || {});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
}

// Generic update for singletons
function createAdminUpdateSingle(path: string, table: any) {
  apiRouter.put(path, requireAuth, async (req, res) => {
    try {
      const data = await db.select().from(table);
      if (data.length === 0) {
        await db.insert(table).values(req.body);
      } else {
        await db.update(table).set(req.body).where(eq(table.id, data[0].id));
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
}

// CRUD for collections
function createCrudAPI(basePath: string, table: any, orderByFn?: any) {
  createAdminGet(basePath, table, orderByFn);

  apiRouter.post(basePath, requireAuth, async (req, res) => {
    try {
      const inserted = await db.insert(table).values(req.body).returning();
      res.json(inserted[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  apiRouter.put(`${basePath}/:id`, requireAuth, async (req, res) => {
    try {
      const updated = await db.update(table).set(req.body).where(eq(table.id, Number(req.params.id))).returning();
      res.json(updated[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  apiRouter.delete(`${basePath}/:id`, requireAuth, async (req, res) => {
    try {
      await db.delete(table).where(eq(table.id, Number(req.params.id)));
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
}

// Singletons
createAdminGetSingle("/admin/school-info", schema.schoolInformation);
createAdminUpdateSingle("/admin/school-info", schema.schoolInformation);

createAdminGetSingle("/admin/homepage", schema.homepageContent);
createAdminUpdateSingle("/admin/homepage", schema.homepageContent);

createAdminGetSingle("/admin/academics", schema.academics);
createAdminUpdateSingle("/admin/academics", schema.academics);

createAdminGetSingle("/admin/admission-info", schema.admissionInformation);
createAdminUpdateSingle("/admin/admission-info", schema.admissionInformation);

// Collections
createCrudAPI("/admin/management", schema.management, asc(schema.management.displayOrder));
createCrudAPI("/admin/teachers", schema.teachers, asc(schema.teachers.displayOrder));
createCrudAPI("/admin/facilities", schema.facilities, asc(schema.facilities.displayOrder));
createCrudAPI("/admin/achievements", schema.achievements, desc(schema.achievements.id));
createCrudAPI("/admin/events", schema.events, desc(schema.events.id));
createCrudAPI("/admin/notices", schema.notices, desc(schema.notices.id));
createCrudAPI("/admin/gallery", schema.galleryImages, asc(schema.galleryImages.displayOrder));
createCrudAPI("/admin/videos", schema.videos, desc(schema.videos.id));

// Enquiries (Read/Delete only)
apiRouter.get("/admin/enquiries", requireAuth, async (req, res) => {
  try {
    const data = await db.select().from(schema.admissionEnquiries).orderBy(desc(schema.admissionEnquiries.id));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
apiRouter.delete("/admin/enquiries/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(schema.admissionEnquiries).where(eq(schema.admissionEnquiries.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

apiRouter.get("/admin/dashboard-stats", requireAuth, async (req, res) => {
  try {
    const tCountObj = await db.select({ count: count() }).from(schema.teachers);
    const gCountObj = await db.select({ count: count() }).from(schema.galleryImages);
    const eCountObj = await db.select({ count: count() }).from(schema.events);
    const nCountObj = await db.select({ count: count() }).from(schema.notices);
    const vCountObj = await db.select({ count: count() }).from(schema.videos);
    const aCountObj = await db.select({ count: count() }).from(schema.admissionEnquiries);

    const recentNotices = await db.select().from(schema.notices).orderBy(desc(schema.notices.id)).limit(5);
    const recentEvents = await db.select().from(schema.events).orderBy(desc(schema.events.id)).limit(5);
    const recentEnquiries = await db.select().from(schema.admissionEnquiries).orderBy(desc(schema.admissionEnquiries.id)).limit(5);

    res.json({
      stats: {
        teachers: tCountObj[0].count,
        galleryImages: gCountObj[0].count,
        events: eCountObj[0].count,
        notices: nCountObj[0].count,
        videos: vCountObj[0].count,
        admissionEnquiries: aCountObj[0].count,
      },
      recentNotices,
      recentEvents,
      recentEnquiries
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
