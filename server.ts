import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { apiRouter } from "./src/server/api.ts";
import { seedDatabase } from "./src/db/seed.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Seed DB
  try {
    await seedDatabase();
  } catch (e) {
    console.error("Error seeding DB", e);
  }

  app.use(cors());
  app.use(express.json({ limit: "150mb" })); // Increased limit for base64 image uploads if any
  app.use(express.urlencoded({ extended: true, limit: "150mb" }));

  // Serve uploads statically
  app.use("/uploads", express.static(uploadsDir));

  // Mount API router
  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express 5+ wildcard route matching requires *all
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
