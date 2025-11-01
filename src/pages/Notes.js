import React, { useEffect, useState } from "react";
import API from "../api";
import "./Notes.css";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.classList.toggle("light-mode", savedTheme === "light");

    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          alert("Unauthorized. Please login again.");
          window.location.href = "/login";
        }
      }
    };
    fetchNotes();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.toggle("light-mode", newTheme === "light");
    localStorage.setItem("theme", newTheme);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="notes-container">
      {/* Header Section */}
      <div className="notes-header">
        <h1>📘 Notes Library</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="controls">
          {/* Sort */}
          <select
            onChange={(e) => {
              const sortOrder = e.target.value;
              const sorted = [...notes].sort((a, b) =>
                sortOrder === "newest"
                  ? new Date(b.uploadDate) - new Date(a.uploadDate)
                  : new Date(a.uploadDate) - new Date(b.uploadDate)
              );
              setNotes(sorted);
            }}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* View Toggle */}
          <button
            onClick={() =>
              setViewMode(viewMode === "list" ? "grid" : "list")
            }
            className="view-toggle"
          >
            {viewMode === "list" ? "🔳 Grid View" : "📋 List View"}
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* Notes Display */}
      {filteredNotes.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No notes found.</p>
      ) : (
        <div
          className="notes-grid"
          style={{
            gridTemplateColumns:
              viewMode === "grid"
                ? "repeat(auto-fill, minmax(250px, 1fr))"
                : "1fr",
          }}
        >
          {filteredNotes.map((note) => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>

              {note.subject && (
                <p>
                  <strong>Subject:</strong> {note.subject}
                </p>
              )}

              {/* ✅ Fixed Uploaded By */}
              <p>
                <strong>Uploaded by:</strong>{" "}
                {note.uploadedByName || note.uploadedBy?.name || "Admin"}
              </p>

              {/* Optional: show role if exists */}
              {note.role && (
                <p>
                  <strong>Role:</strong> {note.role}
                </p>
              )}

              <p>
                <strong>Date:</strong> {formatDate(note.uploadDate)}
              </p>

              {/* ✅ Fixed File URL Display */}
              <div style={{ marginTop: "10px" }}>
                {note.fileUrl && typeof note.fileUrl === "string" ? (
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    📥 Download
                  </a>
                ) : (
                  <span className="no-file">⚠️ File not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
