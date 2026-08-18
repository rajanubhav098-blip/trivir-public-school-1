import { db } from "./index.ts";
import * as schema from "./schema.ts";
import bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";

export async function seedDatabase() {
  console.log("Checking database seed...");

  // Seed Admin
  const adminCount = await db.select({ count: count() }).from(schema.adminProfiles);
  if (adminCount[0].count === 0) {
    const passwordHash = await bcrypt.hash("admin", 10);
    await db.insert(schema.adminProfiles).values({
      email: "admin@trivirpublicschool.com",
      passwordHash,
      requiresPasswordChange: true,
    });
    console.log("Seeded initial admin user.");
  }

  // Seed School Information
  const infoCount = await db.select({ count: count() }).from(schema.schoolInformation);
  if (infoCount[0].count === 0) {
    await db.insert(schema.schoolInformation).values({
      name: "Trivir Public School",
      introduction: "Welcome to Trivir Public School, a place of learning and growth.",
      mission: "To provide quality education.",
      vision: "To become a leading educational institution.",
      coreValues: "Integrity, Excellence, Respect",
      address: "123 School Road, Education City",
      phone: "+91 1234567890",
      email: "contact@trivirpublicschool.com",
      timings: "8:00 AM - 2:00 PM",
    });
    console.log("Seeded school information.");
  }

  // Seed Homepage Content
  const homeCount = await db.select({ count: count() }).from(schema.homepageContent);
  if (homeCount[0].count === 0) {
    await db.insert(schema.homepageContent).values({
      heroTitle: "Trivir Public School",
      heroSubtitle: "Empowering Minds, Shaping Futures",
      aboutText: "Discover a world of opportunities at our institution.",
    });
  }

  // Seed Management
  const mgmtCount = await db.select({ count: count() }).from(schema.management);
  if (mgmtCount[0].count === 0) {
    await db.insert(schema.management).values([
      {
        role: "Principal",
        name: "Ravindra Mundyal",
        designation: "Principal",
        message: "Welcome to our school. We strive for excellence.",
        displayOrder: 1,
      },
      {
        role: "Director",
        name: "Harihar Chaube",
        designation: "Director",
        message: "Guiding the institution towards a brighter future.",
        displayOrder: 2,
      },
      {
        role: "Manager",
        name: "Anurag Srivastav",
        designation: "Manager",
        message: "Ensuring smooth operations and a great environment.",
        displayOrder: 3,
      },
    ]);
    console.log("Seeded management.");
  }

  // Seed Academics
  const academicsCount = await db.select({ count: count() }).from(schema.academics);
  if (academicsCount[0].count === 0) {
    await db.insert(schema.academics).values({
      approach: "Holistic learning with a focus on individual growth.",
      classes: "Nursery to Class XII",
      methodology: "Interactive and practical learning methods.",
      curriculum: "CBSE aligned curriculum.",
      examination: "Continuous Comprehensive Evaluation (CCE)",
    });
  }

  // Seed Admission Information
  const admissionInfoCount = await db.select({ count: count() }).from(schema.admissionInformation);
  if (admissionInfoCount[0].count === 0) {
    await db.insert(schema.admissionInformation).values({
      process: "Fill out the online enquiry form and visit the school for an interview.",
      documentsRequired: "Birth Certificate, Previous School Marksheet, Transfer Certificate, Photos",
      instructions: "Admissions are subject to seat availability.",
    });
  }

  console.log("Database seed complete.");
}
