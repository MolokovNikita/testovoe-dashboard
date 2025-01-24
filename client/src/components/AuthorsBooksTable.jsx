import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import InfiniteLoadingGrid from "./InfiniteLoadingGrid";
import AuthorsGrid from "./AuthorsGrid.jsx";
ModuleRegistry.registerModules([AllCommunityModule]);
const AuthorsBooksTable = () => {
  return (
    <div style={{ width: "80%", marginLeft: "20%" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Список книг и авторов
      </h1>
      <div style={{ height: 500 }}>
        <InfiniteLoadingGrid />
        <AuthorsGrid />
      </div>
    </div>
  );
};
export default AuthorsBooksTable;
