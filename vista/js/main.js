// main.js

class Mascota {
    constructor(objDatosMascota) {
        this._ListaDatosMascota = objDatosMascota;
    }

    registrarMascota() {
        let datosMascota = new FormData();
        datosMascota.append("nombre", this._ListaDatosMascota.nombre);
        datosMascota.append("edad", this._ListaDatosMascota.edad);
        datosMascota.append("sexo", this._ListaDatosMascota.sexo);
        datosMascota.append("raza", this._ListaDatosMascota.raza);
        datosMascota.append("nombreDueno", this._ListaDatosMascota.nombreDueno);
        datosMascota.append("telefonoDueno", this._ListaDatosMascota.telefonoDueno);
        datosMascota.append("registrarMascota", "ok");

        fetch("control/mascotaControl.php", {
            method: 'POST',
            body: datosMascota
        }).then(response => response.json())
          .catch(error => {
              console.log("Error in registrarMascota fetch: ", error);
          }).then(response => {
              console.log("registrarMascota response: ", response);
              if (response.codigo === "200") {
                  Swal.fire({
                      title: "Buen trabajo!",
                      text: "Mascota registrada correctamente!",
                      icon: "success"
                  });
                  this.listarTodasMascotas();
              } else {
                  Swal.fire({
                      title: "Error!",
                      text: response.mensaje,
                      icon: "error"
                  });
              }
          });
    }

    listarTodasMascotas() {
        let datosMascota = new FormData();
        datosMascota.append("listarMascotas", "ok");

        fetch("control/mascotaControl.php", {
            method: 'POST',
            body: datosMascota
        }).then(response => response.json())
          .catch(error => {
              console.log("Error in listarTodasMascotas fetch: ", error);
          }).then(response => {
              console.log("listarTodasMascotas response: ", response);
              if (response.codigo === "200") {
                  const dataSet = [];
                  response.listaMascotas.forEach(item => {
                      let objBotones = '<div class="btn-group">';
                      objBotones += `<button id="btnEditar" type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditarMascota" data-id="${item.Id_Mascota}" data-nombre="${item.Nombre}" data-edad="${item.Edad}" data-sexo="${item.Sexo}" data-raza="${item.Raza}" data-nombredueno="${item.Nombre_Dueno}" data-telefonodueno="${item.Telefono_Dueno}">Editar</button>`;
                      objBotones += `<button id="btnEliminar" data-id="${item.Id_Mascota}" type="button" class="btn btn-danger">Eliminar</button>`;
                      objBotones += '</div>';

                      dataSet.push([item.Nombre, item.Edad, item.Sexo, item.Raza, item.Nombre_Dueno, item.Telefono_Dueno, objBotones]);
                  });

                  $("#tablaMascotas").DataTable({
                      destroy: true,
                      data: dataSet,
                      columns: [
                          { title: "Nombre Mascota" },
                          { title: "Edad" },
                          { title: "Sexo" },
                          { title: "Raza" },
                          { title: "Nombre del Dueño" },
                          { title: "Teléfono del Dueño" },
                          { title: "Acciones" }
                      ],
                      buttons: [
                          {
                              extend: "colvis",
                              text: "Columnas visibles",
                          },
                          "excel",
                      ],
                      dom: "Bfrtip",
                      responsive: true
                  });

              } else {
                  alert(response.mensaje);
              }
          });
    }

    eliminarMascota() {
        let datosMascota = new FormData();
        datosMascota.append("eliminarMascota", this._ListaDatosMascota.eliminarMascota);

        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminado!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("control/mascotaControl.php", {
                    method: 'POST',
                    body: datosMascota
                }).then(response => response.json())
                  .catch(error => {
                      console.log("Error in eliminarMascota fetch: ", error);
                  }).then(response => {
                      console.log("eliminarMascota response: ", response);
                      Swal.fire({
                          title: "Eliminado!",
                          text: "La mascota ha sido eliminada.",
                          icon: "success"
                      });
                      this.listarTodasMascotas();
                  });
            }
        });
    }

    editarMascota() {
        console.log("editarMascota data: ", this._ListaDatosMascota);

        let objData = new FormData();
        objData.append("editarNombre", this._ListaDatosMascota.editarNombre);
        objData.append("editarEdad", this._ListaDatosMascota.editarEdad);
        objData.append("editarSexo", this._ListaDatosMascota.editarSexo);
        objData.append("editarRaza", this._ListaDatosMascota.editarRaza);
        objData.append("editarNombreDueno", this._ListaDatosMascota.editarNombreDueno);
        objData.append("editarTelefonoDueno", this._ListaDatosMascota.editarTelefonoDueno);
        objData.append("idMascota", this._ListaDatosMascota.mascota);

        fetch("control/mascotaControl.php", {
            method: 'POST',
            body: objData
        }).then(response => response.json())
          .catch(error => {
              console.log("Error in editarMascota fetch: ", error);
          }).then(response => {
              console.log("editarMascota response: ", response);
              if (response.codigo === "200") {
                  $("#modalEditarMascota").modal("toggle");

                  Swal.fire({
                      title: "Buen trabajo!",
                      text: "Mascota editada correctamente!",
                      icon: "success"
                  });
                  this.listarTodasMascotas();
              } else {
                  Swal.fire({
                      title: "Error!",
                      text: response.mensaje,
                      icon: "error"
                  });
              }
          });
    }

    static fetchRazas() {
        let formData = new FormData();
        formData.append('listarRazas', 'ok');

        return fetch("control/mascotaControl.php", {
            method: 'POST',
            body: formData
        }).then(response => response.json());
    }

    static populateRazaOptions() {
        Mascota.fetchRazas().then(response => {
            const razaSelect = document.getElementById('selectRazaMascota');
            const editarRazaSelect = document.getElementById('selectEditarRazaMascota');
            response.listaRazas.forEach(raza => {
                const option = document.createElement('option');
                option.value = raza.Id_Raza;
                option.textContent = raza.Nombre;
                razaSelect.appendChild(option);

                const editOption = document.createElement('option');
                editOption.value = raza.Id_Raza;
                editOption.textContent = raza.Nombre;
                editarRazaSelect.appendChild(editOption);
            });
        }).catch(error => {
            console.log("Error in populateRazaOptions fetch: ", error);
        });
    }
}

function validateForm(fields) {
    for (let field of fields) {
        if (field.value.trim() === "") {
            Swal.fire({
                title: "Error!",
                text: "Todos los campos son obligatorios",
                icon: "error"
            });
            return false;
        }
    }
    return true;
}

let btnRegistrarMascota = document.getElementById('btnRegistrarMascota');

btnRegistrarMascota.addEventListener("click", () => {
    let nombre = document.getElementById('txtNombreMascota').value;
    let edad = document.getElementById('txtEdadMascota').value;
    let sexo = document.querySelector('input[name="sexoMascota"]:checked');
    let raza = document.getElementById('selectRazaMascota').value;
    let nombreDueno = document.getElementById('txtNombreDueno').value;
    let telefonoDueno = document.getElementById('txtTelefonoDueno').value;

    let fieldsToValidate = [nombre, edad, sexo, raza, nombreDueno, telefonoDueno];
    if (!validateForm(fieldsToValidate)) return;

    let listaDatosMascota = { "nombre": nombre, "edad": edad, "sexo": sexo.value, "raza": raza, "nombreDueno": nombreDueno, "telefonoDueno": telefonoDueno };
    let objRespuesta = new Mascota(listaDatosMascota);
    objRespuesta.registrarMascota();
});

$("#btnEditarMascota").on("click", function () {
    let nombre = $('#txtEditarNombreMascota').val();
    let edad = $('#txtEditarEdadMascota').val();
    let sexo = $('input[name="editarSexoMascota"]:checked').val();
    let raza = $('#selectEditarRazaMascota').val();
    let nombreDueno = $('#txtEditarNombreDueno').val();
    let telefonoDueno = $('#txtEditarTelefonoDueno').val();
    let mascota = $("#btnEditarMascota").attr("data-id");

    let fieldsToValidate = [nombre, edad, sexo, raza, nombreDueno, telefonoDueno];
    if (!validateForm(fieldsToValidate)) return;

    let objData = { "editarNombre": nombre, "editarEdad": edad, "editarSexo": sexo, "editarRaza": raza, "editarNombreDueno": nombreDueno, "editarTelefonoDueno": telefonoDueno, "mascota": mascota };
    let objEditarMascota = new Mascota(objData);
    objEditarMascota.editarMascota();
});

listarMascotas();

function listarMascotas() {
    let objData = { "listarMascotas": "ok" };
    let objListaMascotas = new Mascota(objData);
    objListaMascotas.listarTodasMascotas();
}

$("#tablaMascotas").on("click", "#btnEliminar", function () {
    let id_Mascota = $(this).attr("data-id");
    let objData = { "eliminarMascota": id_Mascota };
    let objMascota = new Mascota(objData);
    objMascota.eliminarMascota();
});

$("#tablaMascotas").on("click", "#btnEditar", function () {
    let nombre = $(this).attr("data-nombre");
    let edad = $(this).attr("data-edad");
    let sexo = $(this).attr("data-sexo");
    let raza = $(this).attr("data-raza");
    let nombreDueno = $(this).attr("data-nombredueno");
    let telefonoDueno = $(this).attr("data-telefonodueno");
    let mascota = $(this).attr("data-id");

    $("#txtEditarNombreMascota").val(nombre);
    $("#txtEditarEdadMascota").val(edad);
    if (sexo === "Macho") {
        $("#editarSexoMacho").prop("checked", true);
    } else {
        $("#editarSexoHembra").prop("checked", true);
    }
    $("#selectEditarRazaMascota").val(raza);
    $("#txtEditarNombreDueno").val(nombreDueno);
    $("#txtEditarTelefonoDueno").val(telefonoDueno);
    $("#btnEditarMascota").attr("data-id", mascota);
});

Mascota.populateRazaOptions();
