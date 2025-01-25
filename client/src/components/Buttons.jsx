const Buttons = (props) => {
  const { handleDelete, handleChange, handleAdd, handleSave, isAdding } = props;
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      {!isAdding ? (
        <button
          onClick={() => handleAdd()}
          className="action-button add-button"
        >
          Добавить
        </button>
      ) : null}
      {isAdding ? (
        <button
          onClick={() => handleSave()}
          className="action-button save-button"
        >
          Сохранить
        </button>
      ) : null}
      <button
        className="action-button edit-button"
        onClick={() => handleChange()}
      >
        Изменить
      </button>
      <button
        className="action-button delete-button"
        onClick={() => handleDelete()}
      >
        Удалить
      </button>
    </div>
  );
};
export default Buttons;
