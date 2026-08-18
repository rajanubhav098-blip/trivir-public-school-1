import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function FacilitiesEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/facilities"
      title="Facilities"
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "displayOrder", label: "Display Order", type: "number" },
        { name: "iconOrImageUrl", label: "Image/Icon", type: "image" },
        { name: "isPublished", label: "Published", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "iconOrImageUrl", label: "Image", type: "image" },
        { key: "title", label: "Title" },
        { key: "displayOrder", label: "Order" },
        { key: "isPublished", label: "Published", type: "boolean" },
      ]}
    />
  );
}
