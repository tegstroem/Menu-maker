import "./index.css";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import RecipeForm from "./components/RecipeForm";
import RecipeSelect from "./components/RecipeSelect";
import MenuBoard from "./components/MenuBoard";
import SavedMenus from "./components/SavedMenus";


function App() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem("recipes");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  const [menus, setMenus] = useState(() => {
    const savedMenus = localStorage.getItem("menus");
    return savedMenus ? JSON.parse(savedMenus) : [];
  });

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("menus", JSON.stringify(menus));
  }, [menus]);

  return (
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              recipes={recipes}
              setRecipes={setRecipes}
              menus={menus}
              setMenus={setMenus}
            />
          }
        />
        <Route
          path="/menus"
          element={
            <SavedMenus menus={menus} setMenus={setMenus} />
          }
        />
      </Routes>
  );
}

function HomePage({ recipes, setRecipes, menus, setMenus }) {
  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const editRecipe = (id, updatedRecipe) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
      )
    );
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const newDay = destination.droppableId;
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id.toString() === draggableId
          ? { ...recipe, day: newDay }
          : recipe
      )
    );
  };

  const saveMenu = () => {
    const menuName = prompt("Enter a name for this menu:");
    if (menuName) {
      const newMenu = {
        id: Date.now(),
        name: menuName,
        recipes: recipes.filter(r => r.day),
        createdAt: new Date().toLocaleDateString()
      };
      setMenus([...menus, newMenu]);
      alert("Menu saved!");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <header> 
        <h1>MENU MAKER</h1>
        <h2>RECIPES</h2>
        <Link to="/menus" style={{ textDecoration: "none" }}>
          <h2>MENUS</h2>
        </Link>
        <h2>INSPIRATION</h2>
      </header>
      <div className="container">
        <section className="Recipeform">
          <RecipeForm addRecipe={addRecipe} />
        </section>
        
        <section className="Recipesearch">
          <RecipeSelect onSelectRecipe={addRecipe} />
        </section>
      </div>
      <button onClick={saveMenu} style={{ margin: "2rem auto", display: "block", padding: "0.75rem 2rem" }}>
        Save Menu
      </button>
      <MenuBoard recipes={recipes} onDelete={deleteRecipe} onEdit={editRecipe} />
    </DragDropContext>
  );
}

export default App;