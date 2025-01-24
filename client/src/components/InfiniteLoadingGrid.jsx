import React, { useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import Buttons from "./Buttons.jsx";
import { func } from "prop-types";

const InfiniteLoadingGrid = () => {
  const [columnDefs] = useState([
    {
      headerName: "ID",
      field: "id",
      sortable: true,
      filter: true,
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
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Дата публикации",
      field: "publication_date",
      sortable: true,
      valueFormatter: formatDate,
      flex: 2,
    },
    { headerName: "ID Автора", field: "author_id", sortable: true, flex: 1 },
    {
      headerName: "Стоимость",
      field: "cost",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ]);
  const rowSelection = useMemo(() => {
    return {
      mode: "singleRow",
    };
  }, []);
  const onGridReady = useCallback((params) => {
    const datasource = {
      rowCount: undefined,
      getRows: async (params) => {
        console.log("Запрос строк с сервера:", params.startRow, params.endRow);
        setTimeout(async () => {
          try {
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
            params.successCallback(books, totalRecords);
          } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            params.failCallback();
          }
        }, 500);
      },
    };
    params.api.setGridOption("datasource", datasource);
  }, []);
  const onRowSelected = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data); // Получаем данные выбранной строки
    console.log("Выбранные строки:", selectedData);
  };
  function formatDate(params) {
    if (!params.value) return;
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
    <div>
      <div style={{ height: "500px", width: "80%", margin: "0 auto" }}>
        <AgGridReact
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
      <div style={{ marginTop: "20px" }}>
        <Buttons />
      </div>
    </div>
  );
};

export default InfiniteLoadingGrid;
