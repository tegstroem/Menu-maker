/*FORM FOR RECIPES*/

import { useState } from "react";
import styles from './RecipeForm.module.css';



function RecipeForm({ addRecipe }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState("");

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecipe = {
      id: Date.now(),
      title,
      ingredients,
      description, 
      day
    };

    console.log(newRecipe);

    addRecipe(newRecipe);
    setTitle("");
    setIngredients("");
    setDescription("");
    setDay("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>Add your own recipe</h3>
      
      <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe name"
      />
      
      <input
        className={styles.input}
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Ingredients"
      />

      <input
        className={styles.input}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <select
        className={styles.input}
        value={day}
        onChange={(e) => setDay(e.target.value)}
      >
        <option value="">Choose a day</option>
        {days.map(d => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      
      <button type="Submit" className={styles.button}>Add</button>
    </form>
  );
}

export default RecipeForm;