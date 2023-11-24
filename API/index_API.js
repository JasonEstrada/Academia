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
  res.send("Usuario registrado");
});

app.post("/agregarPrograma", (req, res) => {
  const programaData = req.body;
  saveProgramaInDB(programaData);
  res.send("Programa agregado");
});

app.post("/agregarAsignatura", (req, res) => {
  const asignaturaData = req.body;
  saveAsignaturaInDB(asignaturaData);
  res.send("Asignatura agregada");
});

app.post("/actualizarPrograma", (req, res) => {
  const programaData = req.body;
  updateProgramaInDB(programaData);
  res.send("Programa actualizado");
});

app.post("/eliminarPrograma", (req, res) => {
  const idData = req.body;
  deleteProgramaInDB(idData);
  res.send("Programa eliminado");
});

app.get("/periodos", async (req, res) => {
  const periodos = await getPeriodos();
  res.send(periodos);
});

app.get("/programas2", async (req, res) => {
  const programas = await getProgramas2();
  res.send(programas);
});

app.get("/programas", async (req, res) => {
  const op = req.query.op;
  const programas = await getProgramas(op);
  res.send(programas);
});

app.get("/requerimientos", async (req, res) => {
  const requerimientos = await getRequerimientos();
  res.send(requerimientos);
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

app.get("/filtrarPrograma2", async (req, res) => {
  const filtro = req.query.programa;
  const people = await getProgramaFiltrado(filtro);
  res.send(people);
});

app.get("/programaAsig", async (req, res) => {
  const programa = req.query.programa;
  const people = await getAsignaturasPrograma(programa);
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

async function getProgramas(op) {
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

    var query = "";

    if (op == 1) {
      query = `select distinct(I.prog_id || ' - ' || P.prog_nombre) as programa 
    from Inscripciones I inner join Programas P on I.prog_ID = P.prog_ID 
    order by programa`;
    } else {
      query = `select (prog_ID || ' - ' || prog_nombre) as programa from (
        select P.*, STRING_AGG(RP.req_ID, ', ') as Requisitos from programas P 
        left join Requerimientos_programa RP on P.prog_ID = RP.prog_ID
        group by P.prog_ID)`;
    }

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getProgramas2() {
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
    const query = `select P.*, STRING_AGG(RP.req_ID, ', ') as Requisitos from programas P 
    left join Requerimientos_programa RP on P.prog_ID = RP.prog_ID
    group by P.prog_ID`;

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
    const query =
      `SELECT 
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
        I.periodo = '` +
      periodo +
      `'
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
  var filtrado = filtro.split(" - ");

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
      `SELECT 
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
        I.periodo = '` +
      filtrado[2] +
      `'
        and P.prog_ID = '` +
      filtrado[0] +
      `'
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

async function getProgramaFiltrado(filtro) {
  var filtrado = filtro.split(" - ");

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
      `select P.*, STRING_AGG(RP.req_ID, ', ') as Requisitos from programas P 
    left join Requerimientos_programa RP on P.prog_ID = RP.prog_ID
    where P.prog_ID = '` +
      filtrado[0] +
      `'
    group by P.prog_ID `;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAsignaturasPrograma(programa) {
  var prog = programa.split(" - ");

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
      `select asign_ID, area_formacion as area_nombre, asign_nombre, 
      carga_horaria from asignaturas
      where prog_ID = '${prog[0]}' order by area_nombre, 
      asign_nombre`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getRequerimientos() {
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
    const query = `select req_id, req_nombre from requerimientos`;

    console.log("Se está ejecuntando " + query);

    const res = await client.query(query);

    await client.end();

    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

async function saveProgramaInDB(programaData) {
  const id = programaData.prog_id;
  const nombre = programaData.prog_nombre;
  const descr = programaData.prog_descr;
  const costo = programaData.prog_costo;
  const requerimientos = programaData.requerimientos;

  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
    });

    await client.connect();

    // Obtener el número total de requerimientos
    const numRequerimientos = requerimientos.length;

    // Construir la consulta para insertar el programa
    const programaQuery =
      `INSERT INTO Programas VALUES 
      ('${id}', '${nombre}', '${descr}', ${costo});`;

    console.log("Se está ejecutando " + programaQuery);

    // Ejecutar la consulta para insertar el programa
    const resPrograma = await client.query(programaQuery);

    // Construir la consulta para insertar los requerimientos
    const requerimientosQuery =
      `INSERT INTO Requerimientos_programa (req_prog_id, req_id, prog_id)
       VALUES ${requerimientos.map((req, index) => `((SELECT
        'RP' || MAX(CAST(SUBSTRING(req_prog_id, 3) AS INT)) + ${index + 1} 
      FROM
        requerimientos_programa),
        '${req}', '${id}'
       )`).join(', ')};`;

    console.log("Se está ejecutando " + requerimientosQuery);

    // Ejecutar la consulta para insertar los requerimientos
    const resRequerimientos = await client.query(requerimientosQuery);

    await client.end();

  } catch (error) {
    console.log(error);
  }
}

async function saveAsignaturaInDB(asignaturaData) {
  const programa = asignaturaData.programa;
  var prog = programa.split(" - ");
  const prog_id = prog[0]
  const area = asignaturaData.area;
  const nombre = asignaturaData.nombre;
  const carga = asignaturaData.carga;

  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
    });

    await client.connect();

    // Construir la consulta para insertar la asignatura
    const AsignaturaQuery =
      `
      INSERT INTO Asignaturas VALUES (
        (SELECT CAST(MAX(CAST(asign_ID AS INT)) + 1 AS VARCHAR(5))
        FROM Asignaturas),
        '${nombre}',
        '${prog_id}',
        '${area}',
        ${carga});
      `;

    console.log("Se está ejecutando " + AsignaturaQuery);

    // Ejecutar la consulta para insertar la asignatura
    const resPrograma = await client.query(AsignaturaQuery);

    await client.end();

  } catch (error) {
    console.log(error);
  }
}


async function updateProgramaInDB(programaData) {
  const id = programaData.prog_id;
  const nombre = programaData.prog_nombre;
  const descr = programaData.prog_descr;
  const costo = programaData.prog_costo;
  const requerimientos = programaData.requerimientos;

  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
    });

    await client.connect();

    // Obtener el número total de requerimientos
    const numRequerimientos = requerimientos.length;

    // Construir la consulta para actualizar el programa
    const updateQuery =
      `UPDATE programas SET prog_nombre = '${nombre}', prog_descr = '${descr}', 
      prog_costo = '${costo}'
      WHERE prog_id = '${id}'`;

    console.log("Se está ejecutando " + updateQuery);

    // Ejecutar la consulta para insertar el programa
    const resUpdatePrograma = await client.query(updateQuery);

    const queryDeleteRequerimientos = `DELETE FROM Requerimientos_programa 
    WHERE prog_id = '${id}'`;
    console.log("Se está ejecutando " + queryDeleteRequerimientos);
    const resDelRequerimientos = await client.query(queryDeleteRequerimientos);

    // Construir la consulta para insertar los requerimientos
    const requerimientosQuery =
      `INSERT INTO Requerimientos_programa (req_prog_id, req_id, prog_id)
       VALUES ${requerimientos.map((req, index) => `((SELECT
        'RP' || MAX(CAST(SUBSTRING(req_prog_id, 3) AS INT)) + ${index + 1} 
      FROM
        requerimientos_programa),
        '${req}', '${id}'
       )`).join(', ')};`;

    console.log("Se está ejecutando " + requerimientosQuery);

    // Ejecutar la consulta para insertar los requerimientos
    const resRequerimientos = await client.query(requerimientosQuery);

    await client.end();

  } catch (error) {
    console.log(error);
  }
}

async function deleteProgramaInDB(idData) {
  const prog_id = idData.prog_id;

  try {
    const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "Academia",
      password: "13102003",
      port: 5432,
    });

    await client.connect();

    const deleteQuery =
      `delete from Programas where prog_id = '${prog_id}'`;

    console.log("Se está ejecutando " + deleteQuery);

    // Ejecutar la consulta para insertar el programa
    const resUpdatePrograma = await client.query(deleteQuery);

    await client.end();

  } catch (error) {
    console.log(error);
  }
}
