import { useState } from "react";
import styles from "./RecipeSelect.module.css";

function RecipeSelect({ onSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // REVIEW: BUG — There's a single selectedDay state shared across ALL recipe cards
  // in the modal. Changing the day dropdown on one card changes it for every card.
  // Each card needs independent day selection — either store selected days per
  // recipe ID (e.g. a Map/object), or move the day selector into a child component
  // with its own local state.
  const [selectedDay, setSelectedDay] = useState("");
  const [showModal, setShowModal] = useState(false);

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const getRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api_call = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`,
      );
      const data = await api_call.json();
      setRecipes(data.meals || []);
      setShowModal(true);
      // REVIEW: console.log left in production code. Remove debug logs before shipping.
      console.log(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = (meal) => {
    // REVIEW: alert() is a blocking browser dialog. Use inline validation
    // messaging instead (e.g. highlight the dropdown, show an error message).
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
      day: selectedDay,
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

      {/* REVIEW: The modal has no keyboard support — pressing Escape doesn't close
          it, there's no focus trap, and focus isn't returned to the trigger element
          on close. Add an onKeyDown handler for Escape, trap focus inside the modal
          while open, and add role="dialog" and aria-modal="true".
          Also, the close button (✕) overlaps the "Search Results" heading text,
          and the modal isn't wide enough for the recipe grid — cards get cramped.
          Give the heading padding-right to clear the button, and increase the
          modal's max-width or min-width so cards have room to breathe. */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>
              ✕
            </button>
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
                    {days.map((d) => (
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
