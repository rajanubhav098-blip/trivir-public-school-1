import { GenericCollectionEditor } from "../../components/admin/GenericCollectionEditor";

export function EventsEditor() {
  return (
    <GenericCollectionEditor
      endpoint="/admin/events"
      title="Events"
      fields={[
        { name: "title", label: "Event Title", type: "text" },
        { name: "eventDate", label: "Event Date", type: "text" },
        { name: "imageUrl", label: "Image", type: "image" },
        { name: "isPublished", label: "Published", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "imageUrl", label: "Image", type: "image" },
        { key: "title", label: "Title" },
        { key: "eventDate", label: "Date" },
        { key: "isPublished", label: "Published", type: "boolean" },
      ]}
    />
  );
}
