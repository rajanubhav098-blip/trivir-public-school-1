import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function VideosEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/videos"
      title="Videos"
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "videoUrl", label: "Video", type: "video" },
        { name: "thumbnailUrl", label: "Thumbnail URL (Optional)", type: "image" },
        { name: "isPublished", label: "Published", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "videoUrl", label: "URL" },
        { key: "isPublished", label: "Published", type: "boolean" },
      ]}
    />
  );
}
