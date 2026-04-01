import { useState } from "react";
import styles from "./RecipeSelect.module.css";

function RecipeSelect({ onSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [showModal, setShowModal] = useState(false);

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  const getRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api_call = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      const data = await api_call.json();
      setRecipes(data.meals || []);
      setShowModal(true);
      console.log(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = (meal) => {
    if (!selectedDay) {
      alert("Please select a day first!");
      return;
    }

    const newRecipe = {
      id: Date.now(),
      title: meal.strMeal,
      ingredients: meal.strIngredients || "No ingredients listed",
      description: meal.strInstructions || "No description available",
      image: meal.strMealThumb,
      day: selectedDay
    };
    
    onSelectRecipe(newRecipe);
    setSelectedDay("");
    setSearchTerm("");
    setRecipes([]);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setRecipes([]);
  };

  return (
    <div className={styles.Recipesearch}>
      <h3 className={styles.formTitle}>Find recipes from our library</h3>
     
      <form onSubmit={getRecipe}>
        <input
          type="text"
          placeholder="Search for a recipe"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>✕</button>
            <h2>Search Results</h2>
            <div className={styles.recipesGrid}>
              {recipes.map((meal) => (
                <div key={meal.idMeal} className={styles.recipeCard}>
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <h4>{meal.strMeal}</h4>
                  
                  <select
                    className={styles.input}
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    <option value="">Choose a day</option>
                    {days.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className={styles.button} 
                    onClick={() => handleSelectRecipe(meal)}
                  >
                    Add to menu
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSelect;