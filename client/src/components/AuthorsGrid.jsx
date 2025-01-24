import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community"; // or themeBalham, themeAlpine
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import Buttons from "./Buttons.jsx";

const AuthorsGrid = () => {
  const [authorsData, setAuthorsData] = useState([]);
  const [authorsColumnDefs, setAuthorsColumnDefs] = useState([
    { headerName: "ID", field: "id", sortable: true, filter: true, flex: 1 },
    { headerName: "Имя", field: "name", sortable: true, filter: true, flex: 2 },
    {
      headerName: "Дата рождения",
      field: "birth_date",
      sortable: true,
      valueFormatter: formatDate,
      flex: 1,
    },
  ]);
  const pagination = true;
  const paginationPageSize = 5;
  const paginationPageSizeSelector = [5, 10, 50];
  const myTheme = themeQuartz.withParams({
    spacing: 10,
    headerBackgroundColor: "rgb(228, 237, 250)",
    rowHoverColor: "rgb(216, 226, 255)",
  });
  useEffect(() => {
    fetchAuthors();
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "singleRow",
    };
  }, []);
  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/authors");
      setAuthorsData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка загрузки авторов:", error);
    }
  };
  const onRowSelected = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data); // Получаем данные выбранной строки
    console.log("Выбранные строки:", selectedData);
  };
  function formatDate(params) {
    const date = new Date(params.value);
    if (params.colDef.field === "birth_date") {
      return date.toLocaleDateString("ru-RU");
    }
    if (params.colDef.field === "publication_date") {
      return date.toLocaleString("ru-RU");
    }
    return params.value;
  }
  return (
    <div style={{ width: "70%", height: "350px", margin: "20px auto" }}>
      <AgGridReact
        rowData={authorsData}
        columnDefs={authorsColumnDefs}
        rowSelection={rowSelection}
        onRowSelected={onRowSelected}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        theme={myTheme}
      />
      <div style={{ marginTop: "20px" }}>
        <Buttons />
      </div>
    </div>
  );
};
export default AuthorsGrid;
