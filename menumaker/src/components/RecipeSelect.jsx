import { useState, useRef, useEffect } from "react";
import styles from "./RecipeSelect.module.css";

function RecipeSelect({ onSelectRecipe, assignedDays = [] }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [selectedSuggestionDay, setSelectedSuggestionDay] = useState("");
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

  // Fetch a random suggestion on component mount
  useEffect(() => {
    fetchSuggestion();
  }, []);

  const fetchSuggestion = async () => {
    setSuggestionLoading(true);
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      setSuggestion(data.meals?.[0] || null);
    } catch (error) {
      console.error("Error fetching suggestion:", error);
      setSuggestion(null);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const getRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationError("");

    try {
      const api_call = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
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

  const handleSuggestionClick = () => {
    const availableDays = getAvailableDays();
    if (availableDays.length === 0) {
      alert("All days are assigned! Remove a recipe first.");
      return;
    }

    setShowSuggestionModal(true);
  };

  const confirmSuggestion = () => {
    if (!selectedSuggestionDay) {
      alert("Please select a day");
      return;
    }

    const newRecipe = {
      id: Date.now(),
      title: suggestion.strMeal,
      ingredients: suggestion.strIngredients || "No ingredients listed",
      description: suggestion.strInstructions || "No description available",
      image: suggestion.strMealThumb,
      day: selectedSuggestionDay,
    };

    onSelectRecipe(newRecipe);
    setSelectedSuggestionDay("");
    setShowSuggestionModal(false);
    fetchSuggestion();
  };

  const closeModal = () => {
    setShowModal(false);
    setRecipes([]);
    setValidationError("");
  };

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

      {/* Suggestion Section */}
      {suggestion && !showModal && (
        <div className={styles.suggestionBox}>
          <h4 className={styles.suggestionTitle}>Today's Suggestion</h4>
          <img
            src={suggestion.strMealThumb}
            alt={suggestion.strMeal}
            className={styles.suggestionImage}
          />
          <h5 className={styles.suggestionMealName}>{suggestion.strMeal}</h5>
          <p className={styles.suggestionCategory}>
            {suggestion.strCategory}
          </p>
          <div className={styles.suggestionButtons}>
            <button
              className={styles.addSuggestionBtn}
              onClick={handleSuggestionClick}
              disabled={getAvailableDays().length === 0}
            >
              Add
            </button>
            <button
              className={styles.refreshSuggestionBtn}
              onClick={fetchSuggestion}
              disabled={suggestionLoading}
            >
              {suggestionLoading ? "Loading..." : "New"}
            </button>
          </div>
        </div>
      )}

      {/* Suggestion Day Selection Modal */}
      {showSuggestionModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowSuggestionModal(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowSuggestionModal(false)}
            >
              ✕
            </button>
            <h3 className={styles.modalTitle}>
              Select a day for {suggestion?.strMeal}
            </h3>

            <select
              className={styles.daySelect}
              value={selectedSuggestionDay}
              onChange={(e) => setSelectedSuggestionDay(e.target.value)}
            >
              <option value="">Choose a day</option>
              {getAvailableDays().map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <div className={styles.modalButtons}>
              <button
                className={styles.confirmBtn}
                onClick={confirmSuggestion}
              >
                Confirm
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowSuggestionModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              aria-label="Close"
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
