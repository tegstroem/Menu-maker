import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import RecipeForm from "../components/RecipeForm";
import RecipeSelect from "../components/RecipeSelect";
import MenuBoard from "../components/MenuBoard";
import styles from "./HomePage.module.css";

function HomePage({ recipes, setRecipes, setMenus }) {
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showRecipeSelect, setShowRecipeSelect] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [menuName, setMenuName] = useState("");

  const addRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
    setShowRecipeForm(false);
    setShowRecipeSelect(false);
  };

  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    setRecipes(updatedRecipes);
  };

  const editRecipe = (id, updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe,
      ),
    );
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newDay = destination.droppableId;
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id.toString() === draggableId
          ? { ...recipe, day: newDay }
          : recipe,
      ),
    );
  };

  const handleSaveMenu = () => {
    if (!menuName.trim()) {
      alert("Please enter a menu name");
      return;
    }

    const newMenu = {
      id: Date.now(),
      name: menuName.trim(),
      recipes: recipes.filter((r) => r.day),
      createdAt: new Date().toLocaleDateString(),
    };
    
    setMenus((prev) => [...prev, newMenu]);
    setMenuName("");
    setShowSaveMenu(false);
  };

  const closeMenuModal = () => {
    setMenuName("");
    setShowSaveMenu(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Action Buttons - Top */}
      <div className={styles.actionButtons}>
        <button
          className={styles.actionBtn}
          onClick={() => setShowRecipeForm(true)}
        >
          + Add Recipe
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => setShowRecipeSelect(true)}
        >
           Find Recipe
        </button>
      </div>

      {/* Save Menu Button - Separate */}
      <button 
        onClick={() => setShowSaveMenu(true)} 
        className={styles.saveMenuBtn}
      >
        Save Menu
      </button>

      {/* Desktop Layout - Side by side */}
      <div className={styles.desktopContainer}>
        {/* Left Column - Forms */}
        <div className={styles.recipeform}>
          <RecipeForm addRecipe={addRecipe} />
        </div>

        <div className={styles.recipesearch}>
          <RecipeSelect onSelectRecipe={addRecipe} />
        </div>
      </div>

      {/* MenuBoard - Below */}
      <div className={styles.menuBoardContainer}>
        <MenuBoard
          recipes={recipes}
          onDelete={deleteRecipe}
          onEdit={editRecipe}
        />
      </div>

      {/* Recipe Form Modal */}
      {showRecipeForm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowRecipeForm(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowRecipeForm(false)}
            >
              ✕
            </button>
            <RecipeForm addRecipe={addRecipe} />
          </div>
        </div>
      )}

      {/* Recipe Select Modal */}
      {showRecipeSelect && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowRecipeSelect(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowRecipeSelect(false)}
            >
              ✕
            </button>
            <RecipeSelect onSelectRecipe={addRecipe} />
          </div>
        </div>
      )}

      {/* Save Menu Modal */}
      {showSaveMenu && (
        <div
          className={styles.modalOverlay}
          onClick={closeMenuModal}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={closeMenuModal}
            >
              ✕
            </button>
            <h2>Save Menu</h2>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Enter menu name"
              className={styles.menuNameInput}
              onKeyPress={(e) => e.key === "Enter" && handleSaveMenu()}
            />
            <div className={styles.modalButtons}>
              <button
                onClick={handleSaveMenu}
                className={styles.confirmBtn}
              >
                Save
              </button>
              <button
                onClick={closeMenuModal}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  );
}

export default HomePage;