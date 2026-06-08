import "./index.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import HomePage from "./pages/Homepage";
import RecipesPage from "./pages/RecipesPage";
import SavedMenus from "./components/SavedMenus";
import InspirationPage from "./pages/InspirationPage";
import styles from "./App.module.css"

function App() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem("recipes");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  const [menus, setMenus] = useState(() => {
    const savedMenus = localStorage.getItem("menus");
    return savedMenus ? JSON.parse(savedMenus) : [];
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("menus", JSON.stringify(menus));
  }, [menus]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Router basename="/Menu-maker">
      <header className={styles.header}>
        <h1 className={styles.logo}>MENU MAKER</h1>

        {/* Hamburger button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop Navigation */}
        <nav className={styles.navDesktop}>
          <Link to="/recipes">RECIPES</Link>
          <Link to="/menus">MENUS</Link>
          <Link to="/inspiration">INSPIRATION</Link>
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className={styles.navMobile}>
            <Link to="/" onClick={closeMenu}>
              HOME
            </Link>
            <Link to="/recipes" onClick={closeMenu}>
              RECIPES
            </Link>
            <Link to="/menus" onClick={closeMenu}>
              MENUS
            </Link>
            <Link to="/inspiration" onClick={closeMenu}>
              INSPIRATION
            </Link>
          </nav>
        )}
      </header>

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
        <Route
          path="/inspiration"
          element={
            <InspirationPage
              addRecipe={(newRecipe) =>
                setRecipes((prev) => [...prev, newRecipe])
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
