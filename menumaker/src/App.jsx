import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import RecipeForm from "./components/RecipeForm";
import RecipeSelect from "./components/RecipeSelect";
import MenuBoard from "./components/MenuBoard";
import SavedMenus from "./components/SavedMenus";
import InspirationPage from "./pages/InspirationPage";
import RecipesPage from "./pages/RecipesPage";

// REVIEW: HomePage is defined in this same file (line 68) but it's a large component
// with its own state and handlers. Extract it into its own file (e.g. pages/HomePage.jsx)
// to keep App.jsx focused on routing and shared state.
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
    <Router basename="/Menu-maker">
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
          element={<RecipesPage recipes={recipes} setRecipes={setRecipes} />}
        />
        <Route
          path="/menus"
          element={<SavedMenus menus={menus} setMenus={setMenus} />}
        />
        {/* REVIEW: This inline addRecipe reads `recipes` from the closure, not
            the latest state. If two recipes are added quickly, the second add will
            overwrite the first. Use the callback form: setRecipes(prev => [...prev, newRecipe]) */}
        <Route
          path="/inspiration"
          element={
            <InspirationPage
              addRecipe={(newRecipe) => setRecipes([...recipes, newRecipe])}
            />
          }
        />
      </Routes>
    </Router>
  );
}

function HomePage({ recipes, setRecipes, menus, setMenus }) {
  // REVIEW: Same stale-closure issue — uses `recipes` from render scope instead
  // of the callback form. Should be: setRecipes(prev => [...prev, newRecipe])
  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const removeFromMenu = (id) => {
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === id ? { ...recipe, day: "" } : recipe,
    );
    setRecipes(updatedRecipes);
  };

  // REVIEW: The manual localStorage.setItem here is redundant — the useEffect
  // in App already syncs `recipes` to localStorage whenever they change. This
  // double-write is confusing and could cause subtle race conditions.
  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
  };

  const editRecipe = (id, updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe,
      ),
    );
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
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

  // REVIEW: prompt() and alert() are blocking browser dialogs that look out of
  // place in a modern React app and can't be styled. Replace with a custom modal
  // or inline form for naming the menu, and a toast notification for confirmation.
  const saveMenu = () => {
    const menuName = prompt("Enter a name for this menu:");
    if (menuName) {
      const newMenu = {
        id: Date.now(),
        name: menuName,
        recipes: recipes.filter((r) => r.day),
        createdAt: new Date().toLocaleDateString(),
      };
      setMenus([...menus, newMenu]);
      alert("Menu saved!");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* REVIEW: Navigation links use inline styles instead of a CSS class. Move
          textDecoration: "none" to a shared CSS rule (e.g. header a { text-decoration: none }).
          Also, wrapping <h2> inside <Link> means navigation items are marked as
          headings — use a <nav> with <ul>/<li> and styled <Link> elements for
          proper semantic structure and accessibility. */}
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
      {/* REVIEW: Inline styles on this button should be moved to a CSS class. */}
      <button
        onClick={saveMenu}
        style={{
          margin: "2rem auto",
          display: "block",
          padding: "0.75rem 2rem",
        }}
      >
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
