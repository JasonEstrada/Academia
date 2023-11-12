const express = require("express");
const cors = require("cors");
const { Client, Query } = require("pg");

const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.post("/registerUser", (req, res) => {
  const userData = req.body;
  saveUserInDB(userData);
  res.send("Register user");
});

app.get("/periodos", async (req, res) => {
  const periodos = await getPeriodos();
  res.send(periodos);
});

app.get("/programas", async (req, res) => {
  const programas = await getProgramas();
  res.send(programas);
});

app.get("/insXprog", async (req, res) => {
  const periodo = req.query.periodo2;
  const people = await getInscripcionesPorPrograma(periodo);
  res.send(people);
});

app.get("/estXprog", async (req, res) => {
  const periodo = req.query.periodo3;
  const people = await getEstudiantesPorPrograma(periodo);
  res.send(people);
});

app.get("/filtrarPrograma", async (req, res) => {
  const filtro = req.query.programa;
  const people = await getEstXprogFiltrado(filtro);
  res.send(people);
});

app.get("/aspirantesPeriodo", async (req, res) => {
  const people = await getAspirantesPorPeriodo();
  res.send(people);
});

app.get("/filtrarPeriodo", async (req, res) => {
  const filtro = req.query.periodo;
  const people = await getAspirantesPorPeriodoFiltrado(filtro);
  res.send(people);
});

app.get("/aspirantesDia", async (req, res) => {
  const people = await getInscripcionesPorDia();
  res.send(people);
});

app.get("/filtrarFecha", async (req, res) => {
  const filtro = req.query.fecha;
  const people = await getInscripcionesPorDiaFiltrado(filtro);
  res.send(people);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function saveUserInDB(userData) {
  id = userData.us;
  name1 = userData.n1;
  name2 = userData.n2;
  surname1 = userData.s1;
  surname2 = userData.s2;
  pwd = userData.pwd;

  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query =
      "INSERT INTO Aspirantes VALUES ('" +
      id +
      "', '" +
      name1 +
      "', '" +
      name2 +
      "', '" +
      surname1 +
      "', '" +
      surname2 +
      "', '" +
      pwd +
      "');";

    console.log("Se está ejecuntando " + query);
    const res = await client.query(query);

    await client.end();
  } catch (error) {
    console.log(error);
  }
}

async function getPeriodos() {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query = `select distinct(periodo) from Inscripciones`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getProgramas() {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query = `select distinct(I.prog_id || ' - ' || P.prog_nombre) as programa 
    from Inscripciones I inner join Programas P on I.prog_ID = P.prog_ID 
    order by programa`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAspirantesPorPeriodo() {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query = `select I.asp_id, (A.p_nombre || ' ' || A.s_nombre || ' ' || A.p_apellido || ' ' || A.d_apellido) as Nombre, I.prog_ID, I.paso_1, I.paso_2, I.paso_3, I.periodo from Inscripciones I inner join Aspirantes A on I.asp_ID = A.asp_ID`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAspirantesPorPeriodoFiltrado(filtro) {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query =
      `select I.asp_id, (A.p_nombre || ' ' || A.s_nombre || ' ' || A.p_apellido || ' ' || A.d_apellido) as Nombre, I.prog_ID, I.paso_1, I.paso_2, I.paso_3, I.periodo from Inscripciones I inner join Aspirantes A on I.asp_ID = A.asp_ID where I.periodo = '` +
      filtro +
      `'`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getInscripcionesPorDia() {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query = `SELECT TO_CHAR(fecha_inscripcion, 'DD-MM-YYYY') as fechaInscripcion, periodo, COUNT(1) as cantidad_inscripciones FROM Inscripciones GROUP BY periodo, fecha_inscripcion;`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getInscripcionesPorDiaFiltrado(filtro) {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query =
      `SELECT TO_CHAR(fecha_inscripcion, 'YYYY-MM-DD') as fechaInscripcion,periodo, 
    COUNT(1) as cantidad_inscripciones 
    FROM Inscripciones where fecha_inscripcion = '` +
      filtro +
      `' GROUP BY periodo, fecha_inscripcion `;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getInscripcionesPorPrograma(periodo) {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query =
      `select P.prog_ID, P.prog_nombre, count(1) Cantidad_inscripciones from Inscripciones I inner join Programas P on I.prog_ID = P.prog_ID where I.periodo = '` +
      periodo +
      `' group by P.prog_ID order by Cantidad_inscripciones;`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getEstudiantesPorPrograma(periodo) {
  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query = `SELECT 
    I.asp_ID,
    (A.p_nombre || ' ' || A.s_nombre || ' ' || A.p_apellido || ' ' || A.d_apellido) as Nombre,
    P.prog_nombre,
    I.periodo,
    I.ins_ID,
    STRING_AGG(Req.req_nombre, ', ') as Requisitos
    FROM 
        Inscripciones I
    INNER JOIN 
        Programas P ON I.prog_ID = P.prog_ID
    INNER JOIN 
        Aspirantes A ON A.asp_ID = I.asp_ID
    INNER JOIN 
        Requisitos_aspirantes R ON I.ins_ID = R.ins_ID
    INNER JOIN 
        Requerimientos Req ON R.req_ID = Req.req_ID 
    WHERE 
        I.periodo = '` + periodo + `'
    GROUP BY 
        I.asp_ID, A.p_nombre, A.s_nombre, A.p_apellido, A.d_apellido, P.prog_nombre, I.periodo, I.ins_ID;`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getEstXprogFiltrado(filtro) {

  console.log(filtro)
  
  var filtrado = filtro.split(' - ');

  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
      //ssl: {
      //rejectUnauthorized: false,
      //},
    });

    await client.connect();
    const query = `SELECT 
    I.asp_ID,
    (A.p_nombre || ' ' || A.s_nombre || ' ' || A.p_apellido || ' ' || A.d_apellido) as Nombre,
    P.prog_nombre,
    I.periodo,
    I.ins_ID,
    STRING_AGG(Req.req_nombre, ', ') as Requisitos
    FROM 
        Inscripciones I
    INNER JOIN 
        Programas P ON I.prog_ID = P.prog_ID
    INNER JOIN 
        Aspirantes A ON A.asp_ID = I.asp_ID
    INNER JOIN 
        Requisitos_aspirantes R ON I.ins_ID = R.ins_ID
    INNER JOIN 
        Requerimientos Req ON R.req_ID = Req.req_ID 
    WHERE 
        I.periodo = '` + filtrado[2] + `'
        and P.prog_ID = '` + filtrado[0] + `'
    GROUP BY 
        I.asp_ID, A.p_nombre, A.s_nombre, A.p_apellido, A.d_apellido, P.prog_nombre, I.periodo, I.ins_ID;`;
    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}
