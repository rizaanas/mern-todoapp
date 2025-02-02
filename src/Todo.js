import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError("");
    // Check inputs
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            // Add item to list
            setTodos([...todos, { title, description, _id: Date.now() }]); // Simulate `_id`
            setTitle("");
            setDescription("");
            setSuccess("Item added successfully");
            setTimeout(() => {
              setSuccess("");
            }, 3000);
          } else {
            // Set error
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    } else {
      setError("Title and description cannot be empty");
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handleUpdate = (_id) => {
    setError("");
    // Check inputs
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            // Update item in list
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setEditTitle("")
            setEditDescription("")
            setSuccess("Item updated successfully");
            setTimeout(() => {
              setSuccess("");
            }, 3000);
            setEditId(-1);
          } else {
            // Set error
            setError("Unable to update Todo item");
          }
        })
        .catch(() => {
          setError("Unable to update Todo item");
        });
    } else {
      setError("Title and description cannot be empty");
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(apiUrl + "/todos/" + _id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== _id);
        setTodos(updatedTodos);
      });
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>TODO project with MERN stack</h1>
      </div>

      <div>
        <h3>Add Item</h3>
        {success && <p className="text-success">{success}</p>}
      </div>
      <div className="form-group d-flex gap-2">
        <input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="form-control"
          type="text"
        />
        <input
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="form-control"
          type="text"
        />
        <button className="btn btn-dark" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {error && <p className="text-danger">{error}</p>}

      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column me-2">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <div className="form-group d-flex gap-2">
                    <input
                      placeholder="Title"
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      className="form-control"
                      type="text"
                    />
                    <input
                      placeholder="Description"
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      className="form-control"
                      type="text"
                    />
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                {editId === -1 || editId !== item._id ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleUpdate}>
                    Update
                  </button>
                )}
                {editId === -1 || editId !== item._id ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button className="btn btn-danger" onClick={handleEditCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}


