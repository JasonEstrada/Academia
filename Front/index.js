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

const form = document.getElementById("periodoForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.getElementById("periodo").value != ""){
    refreshTable(
    "http://127.0.0.1:3000/filtrarPeriodo?periodo=" +
      document.getElementById("periodo").value
  );} else {
    alert("Seleccione un periodo")
  }
});

async function refreshTable(link) {
  const people = await getPeopleFromAPI(link);
  drawPeopleTable(people);
}

async function getPeopleFromAPI(link) {
  const response = await fetch(link);
  const people = await response.json();
  return people;
}

async function drawPeopleTable(people) {
  document.getElementById("personDataTableTbody").innerHTML = "";
  people.forEach((person) => {
    addPersonToTable(person);
  });
}

function addPersonToTable(person) {
  const personDataTable = document.getElementById("personDataTableTbody");

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
}

document.addEventListener("DOMContentLoaded", () => {
  refreshTable("http://127.0.0.1:3000/aspirantesPeriodo");
});
