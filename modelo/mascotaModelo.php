<?php

include_once "conexion.php";

class MascotaModelo
{
    public static function mdlRegistrarMascota($nombre, $edad, $sexo, $idRaza, $nombreDueno, $telefonoDueno)
    {
        $mensaje = array();
        try {
            $objRespuesta = Conexion::conectar()->prepare(
                "INSERT INTO mascotas (nombre, edad, sexo, id_raza, nombre_dueno, telefono_dueno) 
                VALUES (:nombre, :edad, :sexo, :idRaza, :nombreDueno, :telefonoDueno)"
            );
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":edad", $edad);
            $objRespuesta->bindParam(":sexo", $sexo);
            $objRespuesta->bindParam(":idRaza", $idRaza);
            $objRespuesta->bindParam(":nombreDueno", $nombreDueno);
            $objRespuesta->bindParam(":telefonoDueno", $telefonoDueno);

            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Mascota registrada correctamente.");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Error. No fue posible registrar la mascota.");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }

    public static function mdlListarMascotas()
    {
        $mensaje = array();
        try {
            $objRespuesta = Conexion::conectar()->prepare("
                SELECT 
                    m.id_mascota AS Id_Mascota, 
                    m.nombre AS Nombre, 
                    m.edad AS Edad, 
                    m.sexo AS Sexo, 
                    r.nombre AS Raza, 
                    m.nombre_dueno AS Nombre_Dueno, 
                    m.telefono_dueno AS Telefono_Dueno 
                FROM 
                    mascotas m
                JOIN 
                    razas r ON m.id_raza = r.id_raza
            ");
            $objRespuesta->execute();
            $listaMascotas = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            $mensaje = array("codigo" => "200", "listaMascotas" => $listaMascotas);
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }

    public static function mdlEditarMascota($idMascota, $nombre, $edad, $sexo, $idRaza, $nombreDueno, $telefonoDueno)
    {
        $mensaje = array();
        try {
            $objRespuesta = Conexion::conectar()->prepare(
                "UPDATE mascotas SET 
                nombre = :nombre, 
                edad = :edad, 
                sexo = :sexo, 
                id_raza = :idRaza, 
                nombre_dueno = :nombreDueno, 
                telefono_dueno = :telefonoDueno 
                WHERE id_mascota = :id_mascota"
            );
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":edad", $edad);
            $objRespuesta->bindParam(":sexo", $sexo);
            $objRespuesta->bindParam(":idRaza", $idRaza);
            $objRespuesta->bindParam(":nombreDueno", $nombreDueno);
            $objRespuesta->bindParam(":telefonoDueno", $telefonoDueno);
            $objRespuesta->bindParam(":id_mascota", $idMascota);

            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Mascota editada correctamente");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "No fue posible editar la mascota");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }

    public static function mdlListarRazas()
    {
        $mensaje = array();
        try {
            $objRespuesta = Conexion::conectar()->prepare("SELECT id_raza AS Id_Raza, nombre AS Nombre FROM razas");
            $objRespuesta->execute();
            $listaRazas = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            $mensaje = array("codigo" => "200", "listaRazas" => $listaRazas);
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }

    public static function createTriggerIfNotExists()
    {
        $mensaje = array();
        try {
            $conexion = Conexion::conectar();

            // Verificar si el trigger ya existe
            $result = $conexion->query("SHOW TRIGGERS LIKE 'trigger_historial_mascotas'");

            $triggerExists = false;
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                if ($row['Trigger'] === 'trigger_historial_mascotas') {
                    $triggerExists = true;
                    break;
                }
            }

            if (!$triggerExists) {
                // Crear el trigger si no existe
                $createTriggerSQL = "
                    CREATE TRIGGER trigger_historial_mascotas
                    BEFORE DELETE ON mascotas
                    FOR EACH ROW
                    INSERT INTO historial_mascotas (id_mascota, nombre, edad, sexo, id_raza, nombre_dueno, telefono_dueno)
                    VALUES (OLD.id_mascota, OLD.nombre, OLD.edad, OLD.sexo, OLD.id_raza, OLD.nombre_dueno, OLD.telefono_dueno);
                ";
                $conexion->exec($createTriggerSQL);
                echo "Trigger 'trigger_historial_mascotas' creado correctamente.";
            } else {
                echo "Trigger 'trigger_historial_mascotas' ya existe.";
            }
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }
        return $mensaje;
    }

    public static function mdlEliminarMascota($idMascota)
    {
        $mensaje = array();
        try {
            $conexion = Conexion::conectar();

            // Asegurarse de que el trigger está creado
            self::createTriggerIfNotExists();

            // Eliminar la mascota de la tabla mascotas
            $objEliminar = $conexion->prepare("DELETE FROM mascotas WHERE id_mascota = :id_mascota");
            $objEliminar->bindParam(":id_mascota", $idMascota);
            $objEliminar->execute();

            $mensaje = array("codigo" => "200", "mensaje" => "Mascota eliminada correctamente");
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }
}
