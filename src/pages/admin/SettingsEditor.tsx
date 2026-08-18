import React, { useState, useEffect } from "react";
import { fetchApi } from "../../lib/api";
import { useSearchParams } from "react-router-dom";

export function SettingsEditor() {
  const [searchParams] = useSearchParams();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("forceChange") === "true") {
      setMessage({ text: "Please change your default password.", type: "warning" });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }
    if (newPassword.length < 5) {
      setMessage({ text: "Password must be at least 5 characters.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await fetchApi("/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setMessage({ text: "Password changed successfully.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6">Change Password</h2>
      
      {message.text && (
        <div className={`p-3 rounded-md mb-6 text-sm ${
          message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' :
          message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' :
          'bg-yellow-50 text-yellow-600 border border-yellow-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 disabled:opacity-70"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
