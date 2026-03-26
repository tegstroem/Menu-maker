import { useState } from "react";
import RecipeItem from "./components/RecipeItem";
import RecipeForm from "./components/RecipeForm";

function App() {
  const [recipes, setRecipes] = useState([
    { id: 1, title: "Tacos", ingredients: "Pulled pork" },
    { id: 2, title: "Pasta", ingredients: "Tomatosauce" }
  ]);

  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  return (
    <div>
      <h1>MENU MAKER 🍝</h1>
      <RecipeForm addRecipe={addRecipe} />
      {recipes.map(recipe => (
        <RecipeItem
          key={recipe.id}
          id={recipe.id}
          title={recipe.title}
          ingredients={recipe.ingredients}
          onDelete={deleteRecipe}
        />
      ))}
    </div>
  );
}

export default App;