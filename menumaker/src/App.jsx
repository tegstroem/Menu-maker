import "./index.css";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import RecipeForm from "./components/RecipeForm";
import RecipeSelect from "./components/RecipeSelect";
import MenuBoard from "./components/MenuBoard";
import SavedMenus from "./components/SavedMenus";
import InspirationPage from "./pages/InspirationPage";
import RecipesPage from "./pages/RecipesPage";

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
          path="/recipes"
          element={
            <RecipesPage recipes={recipes} setRecipes={setRecipes} />
          }
        />
        <Route
          path="/menus"
          element={
            <SavedMenus menus={menus} setMenus={setMenus} />
          }
        />
        <Route
          path="/inspiration"
          element={
            <InspirationPage addRecipe={(newRecipe) => setRecipes([...recipes, newRecipe])} />
          }
        />
      </Routes>
  );
}

function HomePage({ recipes, setRecipes, menus, setMenus }) {
  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  
  const removeFromMenu = (id) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === id ? { ...recipe, day: "" } : recipe
    );
    setRecipes(updatedRecipes);
  };


  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
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
        <Link to="/recipes" style={{ textDecoration: "none" }}>
          <h2>RECIPES</h2>
        </Link>
        <Link to="/menus" style={{ textDecoration: "none" }}>
          <h2>MENUS</h2>
        </Link>
        <Link to="/inspiration" style={{ textDecoration: "none" }}>
          <h2>INSPIRATION</h2>
        </Link>
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
      <MenuBoard 
        recipes={recipes} 
        onDelete={removeFromMenu}  
        onEdit={editRecipe} 
      />
    </DragDropContext>
  );
}

export default App;