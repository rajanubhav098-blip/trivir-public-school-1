import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function GalleryEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/gallery"
      title="Gallery Items"
      fields={[
        { name: "imageUrl", label: "Media (Photo)", type: "image" },
        { name: "isVideo", label: "Is this a Video?", type: "checkbox" },
        { name: "caption", label: "Caption", type: "text" },
        { name: "displayOrder", label: "Display Order", type: "number" },
      ]}
      columns={[
        { key: "imageUrl", label: "Media", type: "image" },
        { key: "caption", label: "Caption" },
        { key: "isVideo", label: "Video", type: "boolean" },
        { key: "displayOrder", label: "Order" },
      ]}
    />
  );
}
