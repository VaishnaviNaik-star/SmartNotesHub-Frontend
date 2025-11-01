import React, { useState } from "react";
import axios from "axios";
import "./AddNote.css";

function AddNote() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const UPLOADCARE_PUBLIC_KEY = "053b6a5e176a5da0e6ea";

  // Upload to Uploadcare and store permanently
  const uploadToUploadcare = async (file) => {
    const formData = new FormData();
    formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
    formData.append("UPLOADCARE_STORE", "1");
    formData.append("file", file);

    const res = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.file) throw new Error("File upload failed");

    // Return permanent CDN URL
    return `https://ucarecdn.com/${data.file}/`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first");

    try {
      setUploading(true);
      const fileUrl = await uploadToUploadcare(file);

      await axios.post("https://smartnoteshub-backend.onrender.com/api/notes", {
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
      console.error(err);
      alert("❌ Upload failed");
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
