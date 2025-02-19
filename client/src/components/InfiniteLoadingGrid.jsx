import { AgGridReact } from "ag-grid-react";
import React, { useMemo, useState, useCallback, useRef } from "react";
import axios from "axios";
import Buttons from "./Buttons.jsx";
import MDAlert from "components/MDAlert";
import { func } from "prop-types";
import AddNewRecordForm from "./AddNewRecordForm.jsx";
const InfiniteLoadingGrid = () => {
  const [selectedBook, setSelectedBook] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const timeoutRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const gridRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    publication_date: "",
    author_id: "",
    cost: "",
    age: "",
  });

  const [columnDefs] = useState([
    {
      headerName: "ID",
      field: "id",
      sortable: false,
      flex: 1,
      cellRenderer: (props) => {
        if (props.value !== undefined) {
          return props.value;
        } else {
          return (
            <img
              src="https://www.ag-grid.com/example-assets/loading.gif"
              alt="loading"
            />
          );
        }
      },
    },
    {
      headerName: "Название",
      field: "title",
      sortable: false,
      flex: 1,
      editable: true,
    },
    {
      headerName: "Дата публикации",
      field: "publication_date",
      sortable: false,
      flex: 1,
      editable: true,
    },
    {
      headerName: "ID Автора",
      field: "author_id",
      sortable: false,
      flex: 1,
      editable: true,
    },
    {
      headerName: "Стоимость",
      field: "cost",
      sortable: false,
      flex: 1,
      editable: true,
    },
    {
      headerName: "Возрастн. ограничение",
      field: "age",
      sortable: false,
      flex: 1,
      editable: true,
    },
  ]);

  const rowSelection = useMemo(() => ({ mode: "singleRow" }), []);

  const onGridReady = useCallback((params) => {
    const datasource = {
      rowCount: undefined,
      getRows: async (params) => {
        try {
          console.log(
            "Запрос строк с сервера:",
            params.startRow,
            params.endRow,
          );
          setTimeout(async () => {
            const response = await axios.get(
              "http://localhost:5002/api/books",
              {
                params: {
                  offset: params.startRow,
                  limit: params.endRow - params.startRow,
                },
              },
            );
            const { books, totalRecords } = response.data;
            const formattedBooks = books.map((book) => ({
              ...book,
              publication_date: new Date(
                book.publication_date,
              ).toLocaleDateString("ru-RU"),
            }));
            params.successCallback(formattedBooks, totalRecords);
          }, 500);
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
          params.failCallback();
        }
      },
    };
    params.api.setGridOption("datasource", datasource);
  }, []);

  const onRowSelected = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedBook(selectedData);
  }, []);

  const handleAdd = useCallback(() => {
    setIsAdding(true);
  }, []);
  const handleChange = useCallback(async () => {
    if (selectedBook.length === 0) {
      showAlert("Пожалуйста, выберите строку для изменения!", "error");
      return;
    }

    const updatedBook = selectedBook[0];
    try {
      const response = await axios.put(
        `http://localhost:5002/api/books/${updatedBook.id}`,
        updatedBook,
      );

      const gridApi = gridRef.current.api;
      gridApi.refreshInfiniteCache();
      showAlert("Данные успешно изменены!", "success");
    } catch (error) {
      console.error(
        "Ошибка изменения данных:",
        error.response.data ? error.response.data.message : error,
      );
      showAlert(
        `Ошибка изменения данных! - ${error.response.data ? error.response.data.message : null}`,
        "error",
      );
    }
  }, [selectedBook, showAlert]);

  const handleSave = useCallback(async () => {
    try {
      if (!formData.title || !formData.publication_date) {
        showAlert("Заполните все обязательные поля!", "error");
        return;
      }
      await axios.post("http://localhost:5002/api/books", formData);
      gridRef.current.api.refreshInfiniteCache();
      showAlert("Данные успешно сохранены!", "success");
      setFormData({
        title: "",
        publication_date: "",
        author_id: "",
        cost: "",
        age: "",
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      showAlert(
        `Ошибка при сохранении данных. ${error.response.data.message}`,
        "error",
      );
    }
  }, [formData]);

  const handleDelete = useCallback(async () => {
    if (!selectedBook.length) {
      showAlert("Выберите строку для удаления!", "error");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:5002/api/books/${selectedBook[0].id}`,
      );
      gridRef.current.api.refreshInfiniteCache();
      showAlert("Книга успешно удалена!", "success");
    } catch (error) {
      console.error("Ошибка при удалении книги:", error);
      showAlert("Ошибка при удалении книги.", "error");
    }
  }, [selectedBook]);

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
    <div>
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
      <div style={{ marginBottom: "15px" }}>
        <Buttons
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleAdd={handleAdd}
          isAdding={isAdding}
          handleChange={handleChange}
        />
      </div>
      {isAdding ? (
        <AddNewRecordForm
          formData={formData}
          setFormData={setFormData}
          setIsAdding={setIsAdding}
        />
      ) : null}
      <div style={{ height: "500px", width: "90%", margin: "0 auto" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowModelType="infinite"
          cacheBlockSize={5}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={1}
          maxBlocksInCache={2}
          onGridReady={onGridReady}
          animateRows={true}
          rowSelection={rowSelection}
          onRowSelected={onRowSelected}
        />
      </div>
    </div>
  );
};

export default InfiniteLoadingGrid;
