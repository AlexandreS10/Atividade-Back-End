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
let recados = [];
app.post("/recados/recado", (request, response) => {
  const recado = request.body;
  const id = recado.id;
  const usuario = usuarios.find((usuario) => usuario.id === id);
  if (!usuario) {
    return response.status(402).json("Usuario não encontrado");
  }
  const existeRecado = recados.find((recado) => recado.id);
  if (existeRecado) {
    return response.status(402).json("já existe um recado para este usuário");
  }
  recados.push({
    id: usuario.id,
    titulo: recado.titulo,
    descricao: recado.descricao,
  });

  response.status(200).json("recado criado com sucesso");
});
app.get("/recados/", (request, response) => {
  response.status(200).json(recados);
});
app.put("/recados/:id", (request, response) => {
  const recado = request.body;
  const id = Number(request.params.id);
  const indexRecado = recados.findIndex((recado) => recado.id === id);
  recados[indexRecado] = {
    id: id,
    titulo: recado.titulo,
    descricao: recado.descricao,
  };
  response.status(201).json(recados[indexRecado]);
});

app.delete("/recados/:id", (request, response) => {
  const id = Number(request.params.id);
  const indexRecado = recados.findIndex((recado) => recado.id === id);
  recados.splice(indexRecado, 1);
  return response.status(200).json("recado deletado");
});

app.listen(5555, () => {
    console.log("servidor Rodando");
  });