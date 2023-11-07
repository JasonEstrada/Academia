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
