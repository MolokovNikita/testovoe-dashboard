import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "ag-grid-community";
import { InfiniteRowModelModule } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import axios from "axios";

ModuleRegistry.registerModules([ClientSideRowModelModule, InfiniteRowModelModule]);

const AuthorsBooksTable = () => {
    const [authorsData, setAuthorsData] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    const formatDate = (params) => {
        const date = new Date(params.value);
        if (params.colDef.field === "birth_date") {
            return date.toLocaleDateString('ru-RU'); 
        }
        if (params.colDef.field === "publication_date") {
            return date.toLocaleString('ru-RU'); 
        }
        return params.value;
    };

    const booksColumnDefs = [
        { headerName: "ID", field: "id", sortable: true, filter: true },
        { headerName: "Название", field: "title", sortable: true, filter: true },
        { headerName: "Дата публикации", field: "publication_date", sortable: true, valueFormatter: formatDate },
        { headerName: "ID Автора", field: "author_id", sortable: true },
        { headerName: "Стоимость", field: "cost", sortable: true, filter: true },
    ];

    const authorsColumnDefs = [
        { headerName: "ID", field: "id", sortable: true, filter: true },
        { headerName: "Имя", field: "name", sortable: true, filter: true },
        { headerName: "Дата рождения", field: "birth_date", sortable: true, valueFormatter: formatDate },
    ];

    const fetchBooks = async (params) => {
        const { startRow, endRow, successCallback, failCallback } = params;
        try {
            const response = await axios.get("http://localhost:5002/api/books", {
                params: {
                    offset: startRow,
                    limit: endRow - startRow,
                },
            });
            const { books, totalRecords } = response.data;
            successCallback(books, totalRecords);
        } catch (error) {
            console.error("Ошибка загрузки книг:", error);
            failCallback();
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await axios.get("http://localhost:5002/api/authors");
            setAuthorsData(response.data);
        } catch (error) {
            console.error("Ошибка загрузки авторов:", error);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const onBookSelected = (event) => {
        const selected = event.api.getSelectedRows()[0];
        setSelectedBook(selected);
    };

    const datasource = {
        getRows: (params) => fetchBooks(params),
    };

    return (
        <div style={{ width: "80%", marginLeft: "20%" }}>
            <div style={{ padding: "20px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Список книг и авторов
                </h1>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div
                        className="theme-alpine"
                        style={{
                            height: "400px",
                            width: "100%",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        <AgGridReact
                            columnDefs={booksColumnDefs}
                            rowModelType="infinite"
                            cacheBlockSize={10}
                            datasource={datasource}
                            rowSelection="single"
                            onRowSelected={onBookSelected}
                        />
                    </div>
                    <div
                        className="theme-alpine"
                        style={{
                            height: "300px",
                            width: "100%",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        <AgGridReact
                            rowData={authorsData}
                            columnDefs={authorsColumnDefs}
                            rowModelType="clientSide"
                            domLayout="autoHeight"
                        />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            className="action-button add-button"
                            onClick={() => console.log("Добавить")}
                        >
                            Добавить
                        </button>
                        <button
                            className="action-button edit-button"
                            onClick={() => console.log("Изменить", selectedBook)}
                        >
                            Изменить
                        </button>
                        <button
                            className="action-button delete-button"
                            onClick={() => console.log("Удалить", selectedBook)}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorsBooksTable;
