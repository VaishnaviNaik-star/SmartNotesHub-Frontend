import React, { useEffect, useState } from "react";
import API from "../api";
import "./Dashboard.css";

function Dashboard() {
  const [myNotes, setMyNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMyNotes = async () => {
      try {
        const res = await API.get("/notes/my");
        setMyNotes(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyNotes();
  }, []);

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await API.delete(`/notes/${noteId}`);
        setMyNotes((prev) => prev.filter((note) => note._id !== noteId));
      } catch (err) {
        console.error(err);
        alert("Failed to delete note");
      }
    }
  };

  if (loading) return <p>Loading your notes...</p>;

  return (
    <div className="dashboard-container">
      <h1>📂 Welcome, {user?.name || "User"}</h1>
      <h3>Your Uploaded Notes</h3>

      {myNotes.length === 0 ? (
        <p style={{ marginTop: "20px", color: "gray" }}>
          You haven’t uploaded any notes yet.
        </p>
      ) : (
        <div className="notes-grid">
          {myNotes.map((note) => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p><strong>Description:</strong> {note.description}</p>
              <p>
                <strong>Date:</strong>{" "}
                {note.uploadDate
                  ? new Date(note.uploadDate).toLocaleDateString()
                  : "—"}
              </p>

              <div className="note-actions">
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                >
                  📥 Download
                </a>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(note._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
