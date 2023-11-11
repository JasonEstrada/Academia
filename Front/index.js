function guardarInfoRegistro() {
  const userData = {
    n1: document.getElementById("name1id").value,
    n2: document.getElementById("name2id").value,
    s1: document.getElementById("surname1id").value,
    s2: document.getElementById("surname2id").value,
    us: document.getElementById("userid").value,
    pwd: document.getElementById("passwordid").value,
  };

  const userDataJson = JSON.stringify(userData);

  fetch("http://127.0.0.1:3000/registerUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: userDataJson,
  }).then((result) => {
    document.getElementById("registerUser").reset();
  });
}

const form_periodo = document.getElementById("periodoForm");

form_periodo.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.getElementById("periodo").value != "todo") {
    refreshTable(
      "http://127.0.0.1:3000/filtrarPeriodo?periodo=" +
        document.getElementById("periodo").value,
      "personDataTableTbody"
    );
  } else {
    refreshTable(
      "http://127.0.0.1:3000/aspirantesPeriodo",
      "personDataTableTbody"
    );
  }
});

const form_periodo2 = document.getElementById("periodoForm2");

form_periodo2.addEventListener("submit", (event) => {
  event.preventDefault();
  refreshTable(
    "http://127.0.0.1:3000/insXprog?periodo2=" +
      document.getElementById("periodo2").value,
    "insXprogTbody"
  );
});

const form_fecha = document.getElementById("fechaForm");

form_fecha.addEventListener("submit", (event) => {
  event.preventDefault();
  refreshTable(
    "http://127.0.0.1:3000/filtrarFecha?fecha=" +
      document.getElementById("fecha").value,
    "aspirantesDiaTbody"
  );
});

async function deleteFiltroFecha() {
  refreshTable("http://127.0.0.1:3000/aspirantesDia", "aspirantesDiaTbody");
}

async function refreshTable(link, table) {
  const people = await getPeopleFromAPI(link);
  drawPeopleTable(people, table);
}

async function getPeopleFromAPI(link) {
  const response = await fetch(link);
  const people = await response.json();
  return people;
}

async function drawPeopleTable(people, table) {
  document.getElementById(table).innerHTML = "";
  people.forEach((person) => {
    addPersonToTable(person, table);
  });
}

function addPersonToTable(person, table) {
  const personDataTable = document.getElementById(table);

  if (table == "personDataTableTbody") {
    const row = personDataTable.insertRow(-1);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);
    const cell7 = row.insertCell(6);

    cell1.innerHTML = person.asp_id;
    cell2.innerHTML = person.nombre;
    cell3.innerHTML = person.prog_id;
    cell4.innerHTML = person.paso_1;
    cell5.innerHTML = person.paso_2;
    cell6.innerHTML = person.paso_3;
    cell7.innerHTML = person.periodo;
  } else if (table == "aspirantesDiaTbody") {
    const row = personDataTable.insertRow(-1);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.innerHTML = person.fechainscripcion;
    cell2.innerHTML = person.periodo;
    cell3.innerHTML = person.cantidad_inscripciones;
  } else if (table == "insXprogTbody") {
    const row = personDataTable.insertRow(-1);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.innerHTML = person.prog_id;
    cell2.innerHTML = person.prog_nombre;
    cell3.innerHTML = person.cantidad_inscripciones;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  refreshTable(
    "http://127.0.0.1:3000/aspirantesPeriodo",
    "personDataTableTbody"
  );
  refreshTable("http://127.0.0.1:3000/aspirantesDia", "aspirantesDiaTbody");

  document.getElementById("fecha").value = obtenerFechaActual();
  document.getElementById("fecha").max = obtenerFechaActual();
  cargarFiltroPeriodo();

  refreshTable(
    "http://127.0.0.1:3000/insXprog?periodo2=" +
      document.getElementById("periodo2").value,
    "insXprogTbody"
  );
});

function obtenerFechaActual() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function cargarFiltroPeriodo() {
  const response = await fetch("http://127.0.0.1:3000/periodos");
  const periodos = await response.json();

  var periodoSelect = document.getElementById("periodo");
  var periodoSelect2 = document.getElementById("periodo2");
  // Agregar las opciones al elemento select
  periodos.forEach(function (periodo) {
    var option1 = document.createElement("option");
    option1.value = periodo.periodo;
    option1.text = periodo.periodo;
    periodoSelect.add(option1);

    // Para el segundo select
    var option2 = document.createElement("option");
    option2.value = periodo.periodo;
    option2.text = periodo.periodo;
    periodoSelect2.add(option2);
  });
}
