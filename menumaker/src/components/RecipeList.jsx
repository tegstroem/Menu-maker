import RecipeItem from "./RecipeItem";

function RecipeList({ recipes }) {
  return (
    <div>
      {recipes.map((recipe) => (
        <RecipeItem
          key={recipe.id}
          title={recipe.title}
          ingredients={recipe.ingredients}
        />
      ))}
    </div>
  );
}

export default RecipeList;
