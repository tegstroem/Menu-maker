import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./InspirationPage.module.css";

function InspirationPage({ addRecipe }) {
  const [apiRecipes, setApiRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  // Wrap fetchRecipes in useCallback and add to dependency array
  const fetchRecipes = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      );
      
      // Check response.ok before parsing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApiRecipes(data.meals || []);
    } catch (err) {
      setError("Failed to fetch recipes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes("curry");
  }, [fetchRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchRecipes(searchTerm);
    }
  };

  // Helper function to extract ingredients from MealDB format
  const extractIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() : ""} ${ingredient}`.trim());
      }
    }
    return ingredients.length > 0 ? ingredients.join(", ") : "No ingredients listed";
  };

  // Toast notification function
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddRecipe = (meal) => {
    const newRecipe = {
      id: Date.now(),
      title: meal.strMeal,
      description: meal.strInstructions || "No description available",
      ingredients: extractIngredients(meal),
      image: meal.strMealThumb,
      day: "",
    };
    addRecipe(newRecipe);
    showToast(`${meal.strMeal} added to your recipes!`);
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backBtn}>
        ← Back to home
      </Link>

      <h1>INSPIRATION</h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {loading && <p className={styles.loading}>Loading recipes...</p>}

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.recipeGrid}>
        {apiRecipes.map((meal) => (
          <div key={meal.idMeal} className={styles.recipeCard}>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h3>{meal.strMeal}</h3>
            <p className={styles.category}>{meal.strCategory}</p>
            <p className={styles.description}>
              {meal.strInstructions?.substring(0, 100)}...
            </p>
            <button
              onClick={() => handleAddRecipe(meal)}
              className={styles.addBtn}
            >
              + Add to Recipes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InspirationPage;
