const Buttons = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        paddingBottom: "50px",
      }}
    >
      <button
        className="action-button add-button"
        onClick={() => console.log("Добавить")}
      >
        Добавить
      </button>
      <button
        className="action-button edit-button"
        onClick={() => console.log("Изменить")}
      >
        Изменить
      </button>
      <button
        className="action-button delete-button"
        onClick={() => console.log("Удалить")}
      >
        Удалить
      </button>
    </div>
  );
};
export default Buttons;
