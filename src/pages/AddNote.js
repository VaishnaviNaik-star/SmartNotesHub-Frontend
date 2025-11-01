import React, { useState } from "react";
import API from "../api";
import "./AddNote.css";

function AddNote() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const UPLOADCARE_PUBLIC_KEY = "053b6a5e176a5da0e6ea";

  // ✅ Upload file to Uploadcare (permanent)
  const uploadToUploadcare = async (file) => {
    const formData = new FormData();
    formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
    formData.append("UPLOADCARE_STORE", "1"); // permanent storage
    formData.append("file", file);

    const res = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.file) throw new Error("Uploadcare upload failed");
    return `https://ucarecdn.com/${data.file}/`; // ✅ permanent public URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file first!");

    try {
      setUploading(true);

      // Step 1: Upload file to Uploadcare
      const fileUrl = await uploadToUploadcare(file);

      // Step 2: Save note data in your backend
      await API.post(
        "/notes",
        {
          title,
          subject,
          fileUrl,
          uploadedBy: user?._id,
          role: user?.role || "Student",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Note uploaded successfully!");
      setTitle("");
      setSubject("");
      setFile(null);
      window.location.href = "/notes";
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Failed to upload note: " + err.message);
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
          style={{
            backgroundColor: "#374151",
            padding: "10px",
            borderRadius: "6px",
            color: "#fff",
          }}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Note"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "10px", color: "#aaa" }}>
        Logged in as: <strong>{user?.role}</strong> — {user?.name}
      </p>
    </div>
  );
}

export default AddNote;
