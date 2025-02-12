<?php

include_once "../modelo/mascotaModelo.php";

class MascotaControl
{
    public $idMascota;
    public $nombre;
    public $edad;
    public $sexo;
    public $raza;
    public $nombreDueno;
    public $telefonoDueno;

    public function ctrRegistrarMascota()
    {
        $objRespuesta = MascotaModelo::mdlRegistrarMascota($this->nombre, $this->edad, $this->sexo, $this->raza, $this->nombreDueno, $this->telefonoDueno);
        echo json_encode($objRespuesta);
    }

    public function ctrListarMascotas()
    {
        $objRespuesta = MascotaModelo::mdlListarMascotas();
        echo json_encode($objRespuesta);
    }

    public function ctrEliminarMascota()
    {
        $objRespuesta = MascotaModelo::mdlEliminarMascota($this->idMascota);
        echo json_encode($objRespuesta);
    }

    public function ctrEditarMascota()
    {
        $objRespuesta = MascotaModelo::mdlEditarMascota($this->idMascota, $this->nombre, $this->edad, $this->sexo, $this->raza, $this->nombreDueno, $this->telefonoDueno);
        echo json_encode($objRespuesta);
    }

    public function ctrListarRazas()
    {
        $objRespuesta = MascotaModelo::mdlListarRazas();
        echo json_encode($objRespuesta);
    }
}

if (isset($_POST["registrarMascota"])) {
    $objMascota = new MascotaControl();
    $objMascota->nombre = $_POST["nombre"];
    $objMascota->edad = $_POST["edad"];
    $objMascota->sexo = $_POST["sexo"];
    $objMascota->raza = $_POST["raza"];
    $objMascota->nombreDueno = $_POST["nombreDueno"];
    $objMascota->telefonoDueno = $_POST["telefonoDueno"];
    $objMascota->ctrRegistrarMascota();
}

if (isset($_POST["listarMascotas"])) {
    $objMascota = new MascotaControl();
    $objMascota->ctrListarMascotas();
}

if (isset($_POST["eliminarMascota"])) {
    $objMascota = new MascotaControl();
    $objMascota->idMascota = $_POST["eliminarMascota"];
    $objMascota->ctrEliminarMascota();
}

if (isset($_POST["editarMascota"])) {
    $objEditarMascota = new MascotaControl();
    $objEditarMascota->idMascota = $_POST["idMascota"];
    $objEditarMascota->nombre = $_POST["editarNombre"];
    $objEditarMascota->edad = $_POST["editarEdad"];
    $objEditarMascota->sexo = $_POST["editarSexo"];
    $objEditarMascota->raza = $_POST["editarRaza"];
    $objEditarMascota->nombreDueno = $_POST["editarNombreDueno"];
    $objEditarMascota->telefonoDueno = $_POST["editarTelefonoDueno"];
    $objEditarMascota->ctrEditarMascota();
}

if (isset($_POST["listarRazas"])) {
    $objRaza = new MascotaControl();
    $objRaza->ctrListarRazas();
}
