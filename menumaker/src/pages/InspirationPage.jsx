import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./InspirationPage.module.css";

function InspirationPage({ addRecipe }) {
  const [apiRecipes, setApiRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecipes("curry");
  }, []);

  const fetchRecipes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
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

  const handleAddRecipe = (meal) => {
    const newRecipe = {
      id: Date.now(),
      title: meal.strMeal,
      description: meal.strInstructions || "No description available",
      ingredients: meal.strIngredients || "No ingredients listed",
      image: meal.strMealThumb,
      day: ""
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
        <button type="submit" className={styles.searchBtn}>Search</button>
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