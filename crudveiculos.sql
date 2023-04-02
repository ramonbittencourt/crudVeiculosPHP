CREATE DATABASE crudveiculos

USE crudveiculos;

CREATE TABLE veiculos (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  marca VARCHAR(255) NOT NULL,
  ano INT(4) NOT NULL,
  valorVenda DECIMAL(10, 2) NOT NULL
);