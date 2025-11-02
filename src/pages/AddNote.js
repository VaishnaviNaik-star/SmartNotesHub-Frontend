import React, { useState } from "react";
import API from "../api";
import "./AddNote.css";

function AddNote() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const UPLOADCARE_PUBLIC_KEY = "053b6a5e176a5da0e6ea";
const uploadToUploadcare = async (file) => {
  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
  formData.append("UPLOADCARE_STORE", "1");
  formData.append("file", file);

  const res = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  const data = await res.json();
  console.log("Uploadcare response:", data);

  if (!data.file) throw new Error("File upload failed");

  // ✅ Confirm permanent storage via backend
 await API.post("/uploadcare/store", {
  uuid: data.file,
  filename: file.name,
});
  // ✅ Return correct CDN URL
 const encodedFilename = encodeURIComponent(file.name);
return `https://20bnei1lnu.ucarecd.net/${data.file}/${encodedFilename}`;
};

  // ✅ Submit note to backend (save metadata)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first");

    try {
      setUploading(true);
      const fileUrl = await uploadToUploadcare(file);

      await API.post("/notes", {
        title,
        subject,
        fileUrl,
        uploadedBy: user?._id,
        uploadedByName: user?.name,
        role: user?.role || "Student",
      });

      alert("✅ Note uploaded successfully!");
      setTitle("");
      setSubject("");
      setFile(null);
      window.location.href = "/notes";
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Note</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Note"}
        </button>
      </form>
    </div>
  );
}

export default AddNote;
