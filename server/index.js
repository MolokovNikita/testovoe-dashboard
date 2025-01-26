const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(bodyParser.json());

const authorRoutes = require("./routes/authorsRouter.js");
const bookRoutes = require("./routes/booksRouter.js");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5002;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3001";
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.listen(PORT, async () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  await sequelize.authenticate();
  console.log("Подключение к базе данных успешно!");
});
