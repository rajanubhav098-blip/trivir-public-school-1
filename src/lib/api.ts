export const API_BASE = "/api";

export function getAuthToken() {
  return localStorage.getItem("adminToken");
}

export function setAuthToken(token: string) {
  localStorage.setItem("adminToken", token);
}

export function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login";
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    logout();
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.error || `HTTP error ${res.status}`);
  }

  return data;
}

export function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Cloudinary Endpoint
    const cloudName = "lnrcf7gq";
    const uploadPreset = "tyfrgrqp";
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          let finalUrl = data.secure_url;
          if (file.type.startsWith("video/")) {
            finalUrl = finalUrl.replace(/\.[^/.]+$/, ".mp4");
          } else {
            finalUrl = finalUrl.replace("/upload/v", "/upload/f_auto,q_auto/v");
          }
          resolve(finalUrl);
        } catch (err) {
          reject(new Error("Invalid JSON response from Cloudinary."));
        }
      } else {
        // Try to parse Cloudinary's specific error message
        try {
          const errData = JSON.parse(xhr.responseText);
          if (errData && errData.error && errData.error.message) {
            reject(new Error(`Cloudinary Error: ${errData.error.message}`));
            return;
          }
        } catch (e) {
          // ignore parsing error
        }
        
        if (xhr.status === 413) {
           reject(new Error("File is too large for Cloudinary's free tier. Please upload a video under 100MB."));
        } else {
           reject(new Error(`Upload Failed (${xhr.status}): ${xhr.statusText}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network Error. Check your internet connection."));
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    
    xhr.send(formData);
  });
}
