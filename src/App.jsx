import "./App.css";
import { useContext, useState } from "react";
import NotesContext from "./NotesContext";

function App() {
  const {
    notes,
    createNote,
    loading,
    error,
    message,
    updateNote,
    deleteNote,
    toggleArchive,
    searchNotes
  } = useContext(NotesContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  async function handleAdd() {
    await createNote({
      title: title,
      content: content,
      color: "yellow",
      tags: [],
      archived: false,
      stock: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setTitle("");
    setContent("");
  }

  async function handleDelete(id) {
    await deleteNote(id);
  }

  function handleEdit(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  }

  async function handleUpdate() {
    await updateNote(editingId, {
      title: title,
      content: content,
      updatedAt: new Date().toISOString()
    });

    setEditingId(null);
    setTitle("");
    setContent("");
  }

  async function handleArchive(note) {
    await toggleArchive(note.id, !note.archived);
  }

  const displayedNotes = searchNotes(search);

  return (
    <div className="app">

      <h1>Notes App</h1>

      {message && <p className="message">{message}</p>}

      {error && <p className="error">{error}</p>}

      {loading && <div className="spinner"></div>}

      <input
        className="search-box"
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="note-form">

        <input
          className="note-input"
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="note-textarea"
          placeholder="Enter note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {editingId === null ? (
          <button className="add-button" onClick={handleAdd}>
            Add Note
          </button>
        ) : (
          <button className="add-button" onClick={handleUpdate}>
            Update Note
          </button>
        )}

      </div>

      <div className="notes-container">

        {displayedNotes.map((note) => (
          <div className="note-card" key={note.id}>

            <h2>{note.title}</h2>

            <h3>{note.content}</h3>

            <div className="note-buttons">

              <button
                className="edit-button"
                onClick={() => handleEdit(note)}
              >
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </button>

              <button
                className="archive-button"
                onClick={() => handleArchive(note)}
              >
                {note.archived ? "Unarchive" : "Archive"}
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default App;