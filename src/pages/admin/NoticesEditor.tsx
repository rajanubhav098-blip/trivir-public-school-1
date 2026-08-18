import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function NoticesEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/notices"
      title="Notices"
      fields={[
        { name: "title", label: "Notice Title", type: "text" },
        { name: "publishDate", label: "Publish Date", type: "text" },
        { name: "isImportant", label: "Important", type: "checkbox" },
        { name: "isPublished", label: "Published", type: "checkbox" },
        { name: "content", label: "Content", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "publishDate", label: "Date" },
        { key: "isImportant", label: "Important", type: "boolean" },
        { key: "isPublished", label: "Published", type: "boolean" },
      ]}
    />
  );
}
