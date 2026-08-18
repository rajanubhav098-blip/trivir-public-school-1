import React, { useState } from "react";
import { useCollectionEditor } from "../../lib/useEditor";
import { uploadFile } from "../../lib/api";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url, className }: any) => {
  if (!url) return null;
  const isDirectVideo = url.includes("cloudinary.com") || url.match(/\.(mp4|webm|ogg|mov)$/i);
  if (isDirectVideo) {
    return (
      <video 
        src={url} 
        controls 
        className={`w-full h-full ${className || ""}`}
        style={{ backgroundColor: "black" }}
      />
    );
  }
  return (
    <VideoPlayer 
      url={url} 
      width="100%" 
      height="100%" 
      controls 
      className={className} 
    />
  );
};

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "checkbox" | "textarea" | "image" | "date" | "video";
}

interface Props {
  endpoint: string;
  title: string;
  fields: Field[];
  columns: { key: string; label: string; type?: "image" | "boolean" | "date" }[];
}

export function GenericCollectionEditor({ endpoint, title, fields, columns }: Props) {
  const { items, loading, create, update, remove } = useCollectionEditor(endpoint);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const uploading = uploadProgress !== null;

  if (loading) return <div>Loading...</div>;

  const startEdit = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(-1);
      const initial: any = {};
      fields.forEach(f => {
        if (f.type === "checkbox") initial[f.name] = true;
        else if (f.type === "number") initial[f.name] = 0;
        else initial[f.name] = "";
      });
      setFormData(initial);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveEdit = async () => {
    if (uploading) {
      alert("Please wait for the file upload to finish before saving.");
      return;
    }
    if (editingId === -1) {
      await create(formData);
    } else if (editingId) {
      await update(editingId, formData);
    }
    cancelEdit();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setUploadProgress(0);
      try {
        const url = await uploadFile(e.target.files[0], (progress) => {
          setUploadProgress(progress);
        });
        setFormData({ ...formData, [fieldName]: url });
      } catch (err: any) {
        alert(err.message || "Upload failed");
      } finally {
        setUploadProgress(null);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {editingId === null && (
          <button onClick={() => startEdit()} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 font-medium">
            Add New
          </button>
        )}
      </div>

      {editingId !== null ? (
        <div className="border p-4 rounded-md mb-6 bg-gray-50">
          <h2 className="font-bold mb-4">{editingId === -1 ? "Create" : "Edit"} {title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => {
              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="md:col-span-2">
                    <label className="block text-sm mb-1">{field.label}</label>
                    <textarea rows={3} value={formData[field.name] || ""} onChange={e => setFormData({...formData, [field.name]: e.target.value})} className="w-full border p-2 rounded" />
                  </div>
                );
              }
              if (field.type === "checkbox") {
                return (
                  <div key={field.name} className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData[field.name]} onChange={e => setFormData({...formData, [field.name]: e.target.checked})} className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{field.label}</span>
                    </label>
                  </div>
                );
              }
              if (field.type === "image") {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                    <div className="flex flex-col gap-2">
                      {formData[field.name] && <img src={formData[field.name] || undefined} className="w-16 h-16 object-cover rounded" alt="preview" />}
                      <input 
                        type="text" 
                        value={formData[field.name] || ""} 
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} 
                        className="w-full border p-2 rounded text-sm" 
                        placeholder="Paste image URL here..."
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">OR Upload File:</span>
                        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, field.name)} className="text-sm" />
                        {uploadProgress !== null && <span className="text-sm text-blue-600 font-bold ml-2">Uploading {uploadProgress}%...</span>}
                      </div>
                    </div>
                  </div>
                );
              }
              if (field.type === "video") {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold mb-1">{field.label}</label>
                    <div className="flex flex-col gap-2">
                      {formData[field.name] && (
                        <div className="h-32 bg-black rounded overflow-hidden relative">
                          <VideoPlayer 
                            url={formData[field.name] || ""}
                            width="100%"
                            height="100%"
                            controls
                            className="absolute top-0 left-0"
                          />
                        </div>
                      )}
                      <input 
                        type="text" 
                        value={formData[field.name] || ""} 
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} 
                        className="w-full border p-2 rounded text-sm" 
                        placeholder="Paste YouTube, Vimeo, or Video URL here..."
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">OR Upload File:</span>
                        <input type="file" accept="video/*" onChange={(e) => handleUpload(e, field.name)} className="text-sm" />
                        {uploadProgress !== null && <span className="text-sm text-blue-600 font-bold ml-2">Uploading {uploadProgress}%...</span>}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={field.name}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input type={field.type} value={formData[field.name] || (field.type==='number'?0:"")} onChange={e => setFormData({...formData, [field.name]: field.type==='number'?parseInt(e.target.value)||0:e.target.value})} className="w-full border p-2 rounded" />
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={saveEdit} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Save</button>
            <button onClick={cancelEdit} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                {columns.map(col => <th key={col.key} className="p-3 font-semibold text-sm text-gray-600">{col.label}</th>)}
                <th className="p-3 font-semibold text-sm text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.key} className="p-3">
                      {col.type === "image" ? (
                        item[col.key] ? <img src={item[col.key] || undefined} className="w-10 h-10 object-cover rounded" alt="" /> : <div className="w-10 h-10 bg-gray-200 rounded" />
                      ) : col.type === "boolean" ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${item[col.key] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                          {item[col.key] ? "Yes" : "No"}
                        </span>
                      ) : (
                        item[col.key]
                      )}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => remove(item.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
