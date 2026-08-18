import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function TeachersEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/teachers"
      title="Teachers"
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "designation", label: "Designation", type: "text" },
        { name: "subject", label: "Subject", type: "text" },
        { name: "displayOrder", label: "Display Order", type: "number" },
        { name: "photoUrl", label: "Photo", type: "image" },
        { name: "isPublished", label: "Published", type: "checkbox" },
        { name: "bio", label: "Bio", type: "textarea" },
      ]}
      columns={[
        { key: "photoUrl", label: "Photo", type: "image" },
        { key: "name", label: "Name" },
        { key: "subject", label: "Subject" },
        { key: "displayOrder", label: "Order" },
        { key: "isPublished", label: "Published", type: "boolean" },
      ]}
    />
  );
}
