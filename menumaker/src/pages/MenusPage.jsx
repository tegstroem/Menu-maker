// REVIEW: This component is dead code — it's never used anywhere. The /menus
// route in App.jsx renders <SavedMenus> directly, not <MenusPage>. Either
// delete this file, or update App.jsx to use <MenusPage> for consistency.
import SavedMenus from "../components/SavedMenus";

function MenusPage({ menus, setMenus }) {
  return (
    <div>
      <SavedMenus menus={menus} setMenus={setMenus} />
    </div>
  );
}

export default MenusPage;
