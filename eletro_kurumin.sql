-- Database Creation
CREATE DATABASE IF NOT EXISTS eletro_kurumin;
USE eletro_kurumin;

-- Table: USUARIO
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: CATEGORIA
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: COMPONENTE
CREATE TABLE IF NOT EXISTS componente (
    id_componente INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_componente_categoria FOREIGN KEY (id_categoria) 
        REFERENCES categoria (id_categoria) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_componente_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: MOVIMENTACAO
CREATE TABLE IF NOT EXISTS movimentacao (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_componente INT NOT NULL,
    id_usuario INT NOT NULL,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    justificativa TEXT,
    CONSTRAINT fk_movimentacao_componente FOREIGN KEY (id_componente) 
        REFERENCES componente (id_componente) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_movimentacao_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario (id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
