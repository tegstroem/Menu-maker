import SavedMenus from "../components/SavedMenus";

function MenusPage({ menus, setMenus }) {
  return (
    <div>
      <SavedMenus menus={menus} setMenus={setMenus} />
    </div>
  );
}

export default MenusPage;