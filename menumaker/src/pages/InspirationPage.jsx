import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./InspirationPage.module.css";

function InspirationPage({ addRecipe }) {
  const [apiRecipes, setApiRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // REVIEW: fetchRecipes is used inside this useEffect but is not listed in the
  // dependency array. React's exhaustive-deps rule will warn about this. Either
  // move the function inside the useEffect, or wrap it in useCallback and add it
  // to the dependency array.
  useEffect(() => {
    fetchRecipes("curry");
  }, []);

  const fetchRecipes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      );
      // REVIEW: No check for response.ok before parsing. A 404 or 500 response
      // won't throw — it will parse whatever the server returns (often an HTML
      // error page) and silently produce bad data.
      const data = await response.json();
      setApiRecipes(data.meals || []);
    } catch (err) {
      setError("Failed to fetch recipes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchRecipes(searchTerm);
    }
  };

  // REVIEW: BUG — meal.strIngredients does not exist in the MealDB API response.
  // Ingredients are returned as separate fields: strIngredient1, strIngredient2, ...
  // strIngredient20 (with matching strMeasure1–strMeasure20). You need to loop
  // through those fields and combine them into a single string.
  // Also, alert() is a blocking browser dialog — use a toast notification instead.
  const handleAddRecipe = (meal) => {
    const newRecipe = {
      id: Date.now(),
      title: meal.strMeal,
      description: meal.strInstructions || "No description available",
      ingredients: meal.strIngredients || "No ingredients listed",
      image: meal.strMealThumb,
      day: "",
    };
    addRecipe(newRecipe);
    alert(`${meal.strMeal} added to your recipes!`);
  };

  return (
    <div className={styles.container}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <button className={styles.backBtn}>← Back to Home</button>
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
