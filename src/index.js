import express, { json, request, response } from "express";
import bcrypt from "bcrypt";
const app = express();

app.use(express.json());

let usuarios = [];

app.post("/usuarios", (request, response) => {
  const usuario = request.body;
  const saltRounds = 10;
  const email = usuario.email;

  usuarios.forEach((usuario) => {
    if (usuario.email === email) {
      return response.status(402).json("E-mail já cadastrado");
    } else if (email === "") {
      return response.status(402).json("Email inválido");
    }
  });
  bcrypt.hash(usuario.password, saltRounds, function (err, hash) {
    if (hash) {
      usuarios.push({
        id: Math.floor(Math.random() * 6767),
        nome: usuario.nome,
        email: usuario.email,
        password: hash,
      });
      return response.status(200).json("Usuário criado com sucesso");
    } else {
      return response.status(400).json("Ocorreu um erro" + err);
    }
  });
});
app.get("/usuarios", (request, response) => {
  response.status(200).json(usuarios);
});

app.post("/usuarios/login", (request, response) => {
  const login = request.body;
  const email = login.email;
  const password = login.password;
  const usuario = usuarios.find((usuario) => usuario.email === email);
  if (!usuario || usuario === "") {
    return response.status(402).json("E-mail ou senha Inválidos");
  }
  bcrypt.compare(password, usuario.password, function (err, result) {
    if (result) {
      return response.status(200).json("Usuario valido");
    } else {
      return response.status(402).json("Usuario invalido" + err);
    }
  });
});

app.listen(5555, () => {
    console.log("servidor Rodando");
  });