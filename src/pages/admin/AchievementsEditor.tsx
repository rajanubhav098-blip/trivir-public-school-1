import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function AchievementsEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/achievements"
      title="Achievements"
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "dateOrYear", label: "Date / Year", type: "text" },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "isPublished", label: "Published", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "imageUrl", label: "Image", type: "image" },
        { key: "title", label: "Title" },
        { key: "dateOrYear", label: "Date/Year" },
        { key: "isPublished", label: "Published", type: "boolean" },
      ]}
    />
  );
}
