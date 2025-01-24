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
      valueFormatter: formatDate,
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
      setAuthorsData(response.data);
    } catch (error) {
      console.error("Ошибка загрузки авторов:", error);
    }
  };

  const onRowSelected = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedAuthor(selectedData);
  };

  function formatDate(params) {
    const date = new Date(params.value);
    if (params.colDef.field === "birth_date") {
      return date.toLocaleDateString("ru-RU");
    }
    return params.value;
  }

  const handleDelete = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (selectedAuthor.length === 0) {
      setAlertMessage("Пожалуйста, выберите автора для удаления!");
      setAlertType("error");
      setAlertVisible(true);
      timeoutRef.current = setTimeout(() => {
        setAlertVisible(false);
      }, 5000);

      return;
    }
    axios
      .delete(`http://localhost:5002/api/authors/${selectedAuthor[0].id}`)
      .then((response) => {
        const updatedAuthorsData = authorsData.filter(
          (author) => author.id !== selectedAuthor[0].id,
        );
        setAuthorsData(updatedAuthorsData);

        setSelectedAuthor([]);
        setAlertMessage("Автор успешно удален!");
        setAlertType("success");
        setAlertVisible(true);
      })
      .catch((error) => {
        console.error(error);
        setSelectedAuthor([]);
        setAlertMessage("Произошла ошибка!");
        setAlertType("error");
        setAlertVisible(true);
      })
      .finally(() => {
        timeoutRef.current = setTimeout(() => {
          setAlertVisible(false);
        }, 5000);
      });
  };
  const handleChange = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (selectedAuthor.length === 0) {
      setAlertMessage("Пожалуйста, выберите строку для изменения!");
      setAlertType("error");
      setAlertVisible(true);

      timeoutRef.current = setTimeout(() => {
        setAlertVisible(false);
      }, 5000);

      return;
    }
    const updatedAuthor = selectedAuthor[0];
    try {
      const response = await axios.put(
        `http://localhost:5002/api/authors/${updatedAuthor.id}`,
        updatedAuthor,
      );
      setAuthorsData((prevData) =>
        prevData.map((author) =>
          author.id === updatedAuthor.id ? updatedAuthor : author,
        ),
      );
      setAlertMessage("Данные успешно изменены!");
      setAlertType("success");
      setAlertVisible(true);
    } catch (error) {
      console.error("Ошибка изменения данных:", error.response.data.message);
      setAlertMessage(
        `Ошибка изменения данных! - ${error.response.data.message}`,
      );
      setAlertType("error");
      setAlertVisible(true);
    } finally {
      timeoutRef.current = setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <>
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
          position: "relative",
        }}
      >
        {alertVisible && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1000,
              width: "300px",
            }}
          ></div>
        )}
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
          <Buttons handleDelete={handleDelete} handleChange={handleChange} />
        </div>
      </div>
    </>
  );
};

export default AuthorsGrid;
