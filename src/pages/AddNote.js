import React, { useState } from "react";
import API from "../api";
import "./AddNote.css"; // optional (use App.css if you prefer)

function AddNote() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("file", file);
      formData.append("uploadedBy", user?.name || "Unknown");
      formData.append("role", user?.role || "Student");

      await API.post("/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Note uploaded successfully!");
      setTitle("");
      setSubject("");
      setFile(null);
      window.location.href = "/notes";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
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

        <button type="submit">Upload Note</button>
      </form>

      {/* Display current user info */}
      <p style={{ textAlign: "center", marginTop: "10px", color: "#aaa" }}>
        Logged in as: <strong>{user?.role}</strong> — {user?.name}
      </p>
    </div>
  );
}

export default AddNote;
