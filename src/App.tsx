/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicPage } from "./pages/PublicPage";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { SchoolInfoEditor } from "./pages/admin/SchoolInfoEditor";
import { HomepageEditor } from "./pages/admin/HomepageEditor";
import { ManagementEditor } from "./pages/admin/ManagementEditor";
import { TeachersEditor } from "./pages/admin/TeachersEditor";
import { AcademicsEditor } from "./pages/admin/AcademicsEditor";
import { FacilitiesEditor } from "./pages/admin/FacilitiesEditor";
import { AchievementsEditor } from "./pages/admin/AchievementsEditor";
import { EventsEditor } from "./pages/admin/EventsEditor";
import { NoticesEditor } from "./pages/admin/NoticesEditor";
import { GalleryEditor } from "./pages/admin/GalleryEditor";
import { VideosEditor } from "./pages/admin/VideosEditor";
import { AdmissionsEditor } from "./pages/admin/AdmissionsEditor";
import { EnquiriesViewer } from "./pages/admin/EnquiriesViewer";
import { SettingsEditor } from "./pages/admin/SettingsEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="school-info" element={<SchoolInfoEditor />} />
          <Route path="homepage" element={<HomepageEditor />} />
          <Route path="management" element={<ManagementEditor />} />
          <Route path="teachers" element={<TeachersEditor />} />
          <Route path="academics" element={<AcademicsEditor />} />
          <Route path="facilities" element={<FacilitiesEditor />} />
          <Route path="achievements" element={<AchievementsEditor />} />
          <Route path="events" element={<EventsEditor />} />
          <Route path="notices" element={<NoticesEditor />} />
          <Route path="gallery" element={<GalleryEditor />} />
          <Route path="videos" element={<VideosEditor />} />
          <Route path="admissions" element={<AdmissionsEditor />} />
          <Route path="enquiries" element={<EnquiriesViewer />} />
          <Route path="settings" element={<SettingsEditor />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
