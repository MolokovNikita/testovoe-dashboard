CREATE DATABASE testovoe-dashboard;

-- Создание таблицы "authors"
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_date DATE
);

-- Создание таблицы "books"
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_date DATE,
    author_id INT REFERENCES authors(id),
    age INT CHECK (age >= 0), -- Возрастное ограничение (неотрицательное значение)
    cost NUMERIC CHECK (cost >= 0) -- Цена книги 
);

INSERT INTO authors (name, birth_date) VALUES
('Author 1', '1980-01-01'),
('Author 2', '1990-05-15');

INSERT INTO books (title, publication_date, author_id, age, cost) VALUES
('Book 1', '2000-06-20', 1, 12, 20),        
('Book 2', '2010-11-10', 2, 16, 29.99),    
('Book 3', '2020-03-15', 1, 0, 9.5);       
