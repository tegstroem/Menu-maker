import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./SavedMenus.module.css";

function SavedMenus({ menus, setMenus }) {
  const deleteMenu = (id) => {
    const updatedMenus = menus.filter(menu => menu.id !== id);
    setMenus(updatedMenus);
    localStorage.setItem("menus", JSON.stringify(updatedMenus));
  };

  return (
    <div className={styles.container}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <button className={styles.backBtn}>+ Create New Menu</button>
      </Link>
      <h1>Saved Menus</h1>
      {menus.length === 0 ? (
        <p>No saved menus yet</p>
      ) : (
        <div className={styles.menusList}>
          {menus.map(menu => (
            <div key={menu.id} className={styles.menuCard}>
              <h2>{menu.name}</h2>
              <p>Created: {menu.createdAt}</p>
              <p>Recipes: {menu.recipes.length}</p>
              <div className={styles.recipes}>
                {menu.recipes.map(recipe => (
                  <div key={recipe.id} className={styles.recipeItem}>
                    {recipe.image && <img src={recipe.image} alt={recipe.title} />}
                    <h3>{recipe.title}</h3>
                    <p>{recipe.day}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => deleteMenu(menu.id)} className={styles.deleteBtn}>
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
