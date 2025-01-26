import React from "react";
import { TextField, Grid, Box, Typography, Button } from "@mui/material";

const AddNewRecordForm = ({ formData, setFormData, setIsAdding }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      publication_date: "",
      author_id: "",
      cost: "",
      age: "",
    });
    setIsAdding(false);
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        mx: "auto",
        marginBottom: "30px",
        mt: 4,
      }}
    >
      <Typography variant="h6" mb={2} textAlign="center">
        Добавить новую запись
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Название"
            variant="outlined"
            size="small"
            placeholder="Введите название"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Дата публикации"
            variant="outlined"
            type="date"
            size="small"
            name="publication_date"
            value={formData.publication_date || ""}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="ID Автора"
            variant="outlined"
            size="small"
            placeholder="Введите ID автора"
            name="author_id"
            value={formData.author_id || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Стоимость"
            variant="outlined"
            size="small"
            type="number"
            placeholder="Введите стоимость"
            name="cost"
            value={formData.cost || ""}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Возрастное ограничение"
            variant="outlined"
            size="small"
            type="number"
            placeholder="Введите возрастное ограничение"
            name="age"
            value={formData.age || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f44336",
            color: "white !important",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
          onClick={handleCancel}
        >
          Отменить
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewRecordForm;
