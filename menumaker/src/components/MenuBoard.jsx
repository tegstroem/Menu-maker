/*MENUBOARD*/

import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./MenuBoard.module.css";

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function MenuBoard({ recipes, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const handleEdit = (recipe) => {
    setEditingId(recipe.id);
    setEditData({ ...recipe });
  };

  const handleSave = (id) => {
    onEdit(id, editData);
    setEditingId(null);
    setEditData({});
  };

  // REVIEW: BUG — truncateText crashes if `text` is undefined or null (calling
  // .length on undefined throws a TypeError). User-created recipes can have empty
  // description/ingredients fields. Add a guard: if (!text) return "";
  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className={styles.container}>
      {days.map((day) => (
        <Droppable key={day} droppableId={day}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.dayColumn}
            >
              <h2>{day}</h2>

              {recipes
                .filter((r) => r.day === day)
                .map((recipe, index) => (
                  <Draggable
                    key={recipe.id}
                    draggableId={recipe.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.recipeItem}
                      >
                        {/* REVIEW: Edit inputs have no <label> elements — screen readers
                            can't identify what each field is for. Add labels or aria-label
                            attributes for accessibility. */}
                        {editingId === recipe.id ? (
                          <>
                            <input
                              value={editData.title || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Title"
                            />
                            <input
                              value={editData.description || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Description"
                            />
                            <input
                              value={editData.ingredients || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  ingredients: e.target.value,
                                })
                              }
                              placeholder="Ingredients"
                            />
                            <button onClick={() => handleSave(recipe.id)}>
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {recipe.image && (
                              <img
                                src={recipe.image}
                                alt={recipe.title}
                                className={styles.recipeImage}
                              />
                            )}
                            <h3>{recipe.title}</h3>
                            <p className={styles.shortDescription}>
                              {expandedId === recipe.id
                                ? recipe.description
                                : truncateText(recipe.description, 50)}
                            </p>
                            {/* REVIEW: recipe.description?.length — same null safety issue.
                            If description is undefined this crashes. Use optional chaining. */}
                            {recipe.description.length > 50 && (
                              <button
                                className={styles.expandBtn}
                                onClick={() =>
                                  setExpandedId(
                                    expandedId === recipe.id ? null : recipe.id,
                                  )
                                }
                              >
                                {expandedId === recipe.id
                                  ? "Show less"
                                  : "Show more"}
                              </button>
                            )}
                            <p className={styles.ingredients}>
                              {truncateText(recipe.ingredients, 40)}
                            </p>
                            <button onClick={() => handleEdit(recipe)}>
                              Edit
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => onDelete(recipe.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
}

export default MenuBoard;
