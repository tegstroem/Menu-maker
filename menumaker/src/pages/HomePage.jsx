import { DragDropContext } from "@hello-pangea/dnd";
import RecipeForm from "../components/RecipeForm";
import RecipeSelect from "../components/RecipeSelect";
import MenuBoard from "../components/MenuBoard";
import styles from "./HomePage.module.css";

function HomePage({ recipes, setRecipes, setMenus }) {
  const addRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
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

  const saveMenu = () => {
    const menuName = prompt("Enter a name for this menu:");
    if (menuName) {
      const newMenu = {
        id: Date.now(),
        name: menuName,
        recipes: recipes.filter((r) => r.day),
        createdAt: new Date().toLocaleDateString(),
      };
      setMenus((prev) => [...prev, newMenu]);
      alert("Menu saved!");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container">
        <section className="Recipeform">
          <RecipeForm addRecipe={addRecipe} />
        </section>

        <section className="Recipesearch">
          <RecipeSelect onSelectRecipe={addRecipe} />
        </section>
      </div>
      <button onClick={saveMenu} className={styles.saveMenuBtn}>
        Save Menu
      </button>
      <MenuBoard
        recipes={recipes}
        onDelete={deleteRecipe}
        onEdit={editRecipe}
      />
    </DragDropContext>
  );
}

export default HomePage;