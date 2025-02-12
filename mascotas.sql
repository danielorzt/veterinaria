SET SQL_MODE
= "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone
= "+00:00";

CREATE TABLE razas
(
    Id_Raza INT
    AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR
    (255) NOT NULL,
    Descripcion TEXT
);

    CREATE TABLE mascotas
    (
        Id_Mascota INT
        AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR
        (255) NOT NULL,
    Edad INT,
    Sexo VARCHAR
        (50) NOT NULL,
    Nombre_Dueno VARCHAR
        (255) NOT NULL,
    Telefono_Dueno VARCHAR
        (20) NOT NULL,
    Id_Raza INT,
    FOREIGN KEY
        (Id_Raza) REFERENCES razas
        (Id_Raza)
);

        CREATE TABLE historial_mascotas
        (
            id_historial INT
            AUTO_INCREMENT PRIMARY KEY,
    id_mascota INT,
    nombre VARCHAR
            (255),
    edad INT,
    sexo VARCHAR
            (50),
    id_raza INT,
    nombre_dueno VARCHAR
            (255),
    telefono_dueno VARCHAR
            (20),
    fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

            CREATE TRIGGER trigger_historial_mascotas
BEFORE
            DELETE ON mascotas
FOR EACH
            ROW
            INSERT INTO historial_mascotas
                (id_mascota, nombre, edad, sexo, id_raza, nombre_dueno, telefono_dueno)
            VALUES
                (OLD.id_mascota, OLD.nombre, OLD.edad, OLD.sexo, OLD.id_raza, OLD.nombre_dueno, OLD.telefono_dueno);