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
      user: "uotv0we1scqripryfx80",
      host: "bhvufjzwmuligv4m6t8k-postgresql.services.clever-cloud.com",
      database: "bhvufjzwmuligv4m6t8k",
      password: "E1CibmrnGOQsLwtD3nPFsTJvdEsoRY",
      port: 50013,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();

    const query =
      "INSERT INTO Aspirantes2 VALUES ('" +
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
