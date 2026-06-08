import { useState, useRef, useEffect } from "react";
import styles from "./RecipeSelect.module.css";

function RecipeSelect({ onSelectRecipe, assignedDays = [] }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState({}); // Map recipe ID to day
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const modalRef = useRef(null);

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
    setValidationError("");

    try {
      const api_call = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`,
      );
      const data = await api_call.json();
      setRecipes(data.meals || []);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
      setValidationError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = (meal) => {
    const selectedDay = selectedDays[meal.idMeal];

    if (!selectedDay) {
      setValidationError(`Please select a day for "${meal.strMeal}"`);
      return;
    }

    if (assignedDays.includes(selectedDay)) {
      const confirmed = window.confirm(
        `${selectedDay} already has a recipe. Do you want to replace it?`
      );
      if (!confirmed) return;
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
    setSelectedDays({});
    setSearchTerm("");
    setRecipes([]);
    setShowModal(false);
    setValidationError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setRecipes([]);
    setValidationError("");
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  const getAvailableDays = () => {
    return days.filter((day) => !assignedDays.includes(day));
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
        <div
          className={styles.modalOverlay}
          onClick={closeModal}
          role="presentation"
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            ref={modalRef}
            tabIndex={-1}
          >
            <button
              className={styles.closeBtn}
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2 className={styles.modalTitle}>Search Results</h2>

            {validationError && (
              <div className={styles.validationError} role="alert">
                {validationError}
              </div>
            )}

            <div className={styles.recipesGrid}>
              {recipes.map((meal) => (
                <div key={meal.idMeal} className={styles.recipeCard}>
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <h4>{meal.strMeal}</h4>

                  <select
                    className={styles.input}
                    value={selectedDays[meal.idMeal] || ""}
                    onChange={(e) =>
                      setSelectedDays({
                        ...selectedDays,
                        [meal.idMeal]: e.target.value,
                      })
                    }
                    aria-label={`Select day for ${meal.strMeal}`}
                  >
                    <option value="">Choose a day</option>
                    {getAvailableDays().map((d) => (
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
