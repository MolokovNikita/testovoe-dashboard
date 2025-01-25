import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import axios from "axios";
import { useState, useEffect, useMemo, useRef } from "react";
import Buttons from "./Buttons.jsx";
import MDAlert from "components/MDAlert";

const AuthorsGrid = () => {
  const [authorsData, setAuthorsData] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const timeoutRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const gridRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [authorsColumnDefs, setAuthorsColumnDefs] = useState([
    { headerName: "ID", field: "id", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Имя",
      field: "name",
      sortable: true,
      filter: true,
      flex: 2,
      editable: true,
    },
    {
      headerName: "Дата рождения",
      field: "birth_date",
      sortable: true,
      flex: 1,
      editable: true,
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
      const authorsWithFormattedDates = response.data.map((author) => {
        return {
          ...author,
          birth_date: new Date(author.birth_date).toLocaleDateString("ru-RU"),
        };
      });

      setAuthorsData(authorsWithFormattedDates);
    } catch (error) {
      console.error("Ошибка загрузки авторов:", error);
    }
  };

  const onRowSelected = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedAuthor(selectedData);
  };

  const handleDelete = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (selectedAuthor.length === 0) {
      showAlert("Пожалуйста, выберите автора для удаления!", "error");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:5002/api/authors/${selectedAuthor[0].id}`,
      );
      const updatedAuthorsData = authorsData.filter(
        (author) => author.id !== selectedAuthor[0].id,
      );
      setAuthorsData(updatedAuthorsData);
      setSelectedAuthor([]);
      showAlert("Автор успешно удален!", "success");
    } catch (error) {
      console.error(error);
      showAlert("Произошла ошибка при удалении автора!", "error");
    }
  };

  const handleChange = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (selectedAuthor.length === 0) {
      showAlert("Пожалуйста, выберите строку для изменения!", "error");
      return;
    }
    const updatedAuthor = selectedAuthor[0];
    try {
      await axios.put(
        `http://localhost:5002/api/authors/${updatedAuthor.id}`,
        updatedAuthor,
      );
      setAuthorsData((prevData) =>
        prevData.map((author) =>
          author.id === updatedAuthor.id ? updatedAuthor : author,
        ),
      );
      showAlert("Данные успешно изменены!", "success");
    } catch (error) {
      console.error("Ошибка изменения данных:", error);
      showAlert("Ошибка изменения данных!", "error");
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    const gridApi = gridRef.current.api;
    const newRow = {
      tempId: Date.now(),
      id: undefined,
      name: "",
      birth_date: "",
    };
    gridApi.applyTransaction({ add: [newRow] });
  };

  const handleSave = async () => {
    const gridApi = gridRef.current.api;

    const rowsToUpdate = [];
    const rowsToDelete = [];

    gridApi.forEachNode((node) => {
      if (!node.data.name || !node.data.birth_date.trim()) {
        rowsToDelete.push(node.data);
      } else {
        rowsToUpdate.push(node.data);
      }
    });

    if (rowsToDelete.length > 0) {
      gridApi.applyTransaction({
        remove: rowsToDelete,
      });
      showAlert(
        "Некоторые строки содержат пустые обязательные поля и были удалены!",
        "error",
      );
      setIsAdding(false);
      return;
    }
    try {
      const lastRow = rowsToUpdate[rowsToUpdate.length - 1];
      const response = await axios.post(
        "http://localhost:5002/api/authors",
        lastRow,
      );
      const newAuthor = response.data[0];
      const authorToAdd = {
        id: newAuthor.id,
        name: newAuthor.name,
        birth_date: new Date(newAuthor.birth_date).toLocaleDateString("ru-RU"),
      };
      gridApi.applyTransaction({
        remove: gridApi.getRowNode(lastRow.tempId)?.data ? [lastRow] : [],
      });
      gridApi.applyTransaction({
        add: [newAuthor],
      });
      setAuthorsData((prevData) => {
        const filteredData = prevData.filter(
          (author) => author.id !== undefined,
        );
        return [...filteredData, authorToAdd];
      });
      showAlert("Данные успешно сохранены!", "success");
      setIsAdding(false);
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      showAlert("Произошла ошибка при сохранении данных.", "error");
      setIsAdding(false);
    }
  };

  function showAlert(message, type) {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);

    timeoutRef.current = setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  }

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <div
      style={{
        paddingBottom: "50px",
      }}
    >
      {alertVisible && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            fontSize: "15px",
            width: "350px",
          }}
        >
          <MDAlert color={alertType} dismissible onClose={handleCloseAlert}>
            {alertMessage}
          </MDAlert>
        </div>
      )}
      <div
        style={{
          width: "70%",
          height: "350px",
          margin: "20px auto",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <Buttons
            handleDelete={handleDelete}
            handleChange={handleChange}
            handleAdd={handleAdd}
            handleSave={handleSave}
            isAdding={isAdding}
          />
        </div>
        <AgGridReact
          ref={gridRef}
          rowData={authorsData}
          columnDefs={authorsColumnDefs}
          rowSelection={rowSelection}
          getRowId={(params) =>
            String(params.data.id) || String(params.data.tempId)
          }
          onRowSelected={onRowSelected}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          theme={myTheme}
        />
      </div>
    </div>
  );
};

export default AuthorsGrid;
