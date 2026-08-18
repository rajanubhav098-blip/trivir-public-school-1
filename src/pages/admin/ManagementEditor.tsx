import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function ManagementEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/management"
      title="Management"
      fields={[
        { name: "role", label: "Role (e.g., Principal)", type: "text" },
        { name: "name", label: "Name", type: "text" },
        { name: "designation", label: "Designation", type: "text" },
        { name: "displayOrder", label: "Display Order", type: "number" },
        { name: "photoUrl", label: "Photo", type: "image" },
        { name: "message", label: "Message", type: "textarea" },
      ]}
      columns={[
        { key: "photoUrl", label: "Photo", type: "image" },
        { key: "role", label: "Role" },
        { key: "name", label: "Name" },
        { key: "displayOrder", label: "Order" },
      ]}
    />
  );
}
