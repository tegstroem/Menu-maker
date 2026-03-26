function RecipeItem({ title, ingredients, onDelete, id }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{ingredients}</p>
      <button onClick={() => onDelete(id)}>Ta bort</button>
    </div>
  );
}

export default RecipeItem;