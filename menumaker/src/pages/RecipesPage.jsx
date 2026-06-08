import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipesPage.module.css";

function RecipesPage({ recipes, setRecipes }) {
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const deleteRecipe = (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (confirmed) {
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
      setRecipes(updatedRecipes);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate("/")} 
        className={styles.backBtn}
      >
        ← Back to Home
      </button>

      <h1>MY RECIPES</h1>

      {recipes.length === 0 ? (
        <p className={styles.emptyState}>
          No recipes yet. Create one to get started!
        </p>
      ) : (
        <div className={styles.recipeGrid}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeCard}>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className={styles.image}
                />
              )}
              <div className={styles.cardContent}>
                <h3>{recipe.title}</h3>
                <p className={styles.description}>{recipe.description}</p>

                <button
                  onClick={() => toggleExpand(recipe.id)}
                  className={styles.expandBtn}
                >
                  {expandedId === recipe.id ? "Hide Details" : "View Details"}
                </button>

                {expandedId === recipe.id && (
                  <div className={styles.expandedContent}>
                    <h4>Ingredients:</h4>
                    <p>{recipe.ingredients}</p>
                  </div>
                )}

                <button
                  onClick={() => deleteRecipe(recipe.id, recipe.title)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipesPage;
