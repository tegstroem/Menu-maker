/*RECIPE ITEM TO PUT INTO WEEKMENU*/

function RecipeItem({ title, ingredients, description, day, onDelete, id }) {
  return (
    <section className="Recipeitem">
      <h3>{title}</h3>
      <p>{ingredients}</p>
      <p>{description}</p>
      <p>{day}</p>
      <button onClick={() => onDelete(id)}>Delete</button>
    </section>
  );
}

export default RecipeItem;