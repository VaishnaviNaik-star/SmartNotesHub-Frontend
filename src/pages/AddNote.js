import React, { useState } from "react";
import axios from "axios";
import { Widget } from "@uploadcare/react-widget";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (fileInfo) => {
    setUploading(true);
    try {
      const uuid = fileInfo.uuid;

      // Ask backend to store permanently
      const response = await axios.post(
        "https://smartnoteshub-backend.onrender.com/api/uploadcare/store",
        { uuid }
      );

      const storedFileUrl = response.data.fileUrl;
      setFileUrl(storedFileUrl);
      alert("✅ File uploaded and stored permanently!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload note.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) return alert("Please upload a file first!");

    const noteData = { title, subject, fileUrl };

    try {
      await axios.post("https://smartnoteshub-backend.onrender.com/api/notes", noteData);
      alert("✅ Note added successfully!");
      setTitle("");
      setSubject("");
      setFileUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to save note.");
    }
  };

  return (
    <div className="add-note">
      <h2>Add Note</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
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

        <Widget
          publicKey="YOUR_PUBLIC_KEY"
          onChange={handleUpload}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Note"}
        </button>
      </form>
    </div>
  );
};

export default AddNote;
