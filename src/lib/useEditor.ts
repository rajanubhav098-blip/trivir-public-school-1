import { useState, useEffect } from "react";
import { fetchApi } from "./api";

export function useSingletonEditor(endpoint: string, initialData: any = {}) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApi(endpoint)
      .then(res => {
        if (res && Object.keys(res).length > 0) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [endpoint]);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await fetchApi(endpoint, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      setMessage("Saved successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return { data, setData, loading, saving, save, message };
}

export function useCollectionEditor(endpoint: string) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    fetchApi(endpoint)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const create = async (payload: any) => {
    await fetchApi(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    fetchItems();
  };

  const update = async (id: number, payload: any) => {
    await fetchApi(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    fetchItems();
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetchApi(`${endpoint}/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return { items, loading, create, update, remove };
}
