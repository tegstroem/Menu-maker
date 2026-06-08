import { Link } from "react-router-dom";
import styles from "./SavedMenus.module.css";

function SavedMenus({ menus, setMenus }) {
  const deleteMenu = (id, menuName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${menuName}"? This action cannot be undone.`
    );

    if (confirmed) {
      const updatedMenus = menus.filter((menu) => menu.id !== id);
      setMenus(updatedMenus);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backBtn}>
        ← Back to home
      </Link>
      <h1>Saved Menus</h1>
      {menus.length === 0 ? (
        <h3>No saved menus yet</h3>
      ) : (
        <div className={styles.menusList}>
          {menus.map((menu) => (
            <div key={menu.id} className={styles.menuCard}>
              <h2>{menu.name}</h2>
              <p>Created: {menu.createdAt}</p>
              <p>Recipes: {menu.recipes.length}</p>
              <div className={styles.recipes}>
                {menu.recipes.map((recipe) => (
                  <div key={recipe.id} className={styles.recipeItem}>
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className={styles.recipeImage}
                      />
                    )}
                    <h3>{recipe.title}</h3>
                    <p className={styles.day}>{recipe.day}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => deleteMenu(menu.id, menu.name)}
                className={styles.deleteBtn}
              >
                Delete Menu
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedMenus;