import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

export const adminProfiles = sqliteTable("admin_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  requiresPasswordChange: integer("requires_password_change", { mode: "boolean" }).notNull().default(true),
});

export const schoolInformation = sqliteTable("school_information", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().default("Trivir Public School"),
  logoUrl: text("logo_url"),
  introduction: text("introduction"),
  mission: text("mission"),
  vision: text("vision"),
  coreValues: text("core_values"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  timings: text("timings"),
  mapLocation: text("map_location"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),
  principalMessage: text("principal_message"),
  principalName: text("principal_name"),
  principalPhotoUrl: text("principal_photo_url"),
  affiliationInfo: text("affiliation_info"),
});

export const homepageContent = sqliteTable("homepage_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  heroTitle: text("hero_title").notNull().default("Trivir Public School"),
  heroSubtitle: text("hero_subtitle"),
  heroImageUrl: text("hero_image_url"),
  aboutText: text("about_text"),
});

export const management = sqliteTable("management", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull().unique(), // e.g. "Principal", "Director", "Manager"
  name: text("name").notNull(),
  designation: text("designation"),
  message: text("message"),
  photoUrl: text("photo_url"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const teachers = sqliteTable("teachers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  designation: text("designation"),
  subject: text("subject"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  displayOrder: integer("display_order").notNull().default(0),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
});

export const academics = sqliteTable("academics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  approach: text("approach"),
  classes: text("classes"),
  methodology: text("methodology"),
  curriculum: text("curriculum"),
  examination: text("examination"),
});

export const facilities = sqliteTable("facilities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  iconOrImageUrl: text("icon_or_image_url"),
  displayOrder: integer("display_order").notNull().default(0),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
});

export const achievements = sqliteTable("achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  dateOrYear: text("date_or_year"),
  imageUrl: text("image_url"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: text("event_date"),
  imageUrl: text("image_url"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
});

export const notices = sqliteTable("notices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content"),
  publishDate: text("publish_date"),
  isImportant: integer("is_important", { mode: "boolean" }).notNull().default(false),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
});

export const galleryAlbums = sqliteTable("gallery_albums", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
});

export const galleryImages = sqliteTable("gallery_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  albumId: integer("album_id").references(() => galleryAlbums.id),
  imageUrl: text("image_url").notNull(),
  isVideo: integer("is_video", { mode: "boolean" }).notNull().default(false),
  caption: text("caption"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const videos = sqliteTable("videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
});

export const admissionInformation = sqliteTable("admission_information", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  process: text("process"),
  documentsRequired: text("documents_required"),
  instructions: text("instructions"),
});

export const admissionEnquiries = sqliteTable("admission_enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentName: text("student_name").notNull(),
  parentName: text("parent_name").notNull(),
  applyingClass: text("applying_class").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  message: text("message"),
  createdAt: text("created_at").notNull(), // ISO date string
});
