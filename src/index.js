import express, { json, request, response } from "express";
import cors from 'cors'
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors('*'));


app.get('/',(request,response)=>{
  response.status(200).send(`<div><h1>Api de Recados</h1></div>`
 )})

let usuarios = [];

app.post("/usuarios",async (request, response) => {
  let {nome,email,senha }= request.body;
  const saltRounds = 10;
  if ( nome === "" || email === "" || senha ==="") {
    return response.status(402).json("Por favor informe nome,email e senha");
  }
  let validaUsuario= usuarios.forEach((usuario) => usuario.email === email)
    if (validaUsuario) {
      return response.status(402).json("E-mail já cadastrado");
    } else{
      let id = Math.floor(Math.random() * 6767);
      let senhaCripto =  await bcrypt.hash(senha,saltRounds);
      let usuario ={id,nome,email,senhaCripto,recado:[]};
      usuarios.push(usuario);
      return response.status(200).json("Usuário criado com sucesso");
    } 
  });

app.get("/usuarios", (request, response) => {
  response.status(200).json(usuarios);
});

app.post("/usuarios/login", async (request, response) => {
  let { email, senha } = request.body;

  let verificaUsuario = usuarios.find((usuario) => usuario.email === email);
  if (!verificaUsuario) {
    return response.status(402).send("E-mail ou senha inválidos");
  }

  let senhaIguais = await bcrypt.compare(senha, verificaUsuario.senhaCripto);
  if (!senhaIguais) {
    return response.status(402).send("E-mail ou senha inválidos");
  } else {
    return response.status(200).json(verificaUsuario.id).send("Usuário logado");
  }
});


app.post("/usuarios/:id/recado",(request, response) => {
  const novoRecado = request.body;
  let recadoCriado = {
    id: Math.floor(Math.random()*6767),
    titulo: novoRecado.titulo,
    descricao: novoRecado.descricao
};
  const id = request.params.id;

  let idDoUsuario = usuarios.findIndex((usuario) => usuario.id === Number (id));
 
    usuarios[idDoUsuario].recado.push(recadoCriado);

   return response.status(200).send("Recado criado com sucesso");
  
});
app.get("/usuarios/:id/recado", (request, response) => {
  const usuarioId = parseInt(request.params.id);

  const usuario = usuarios.find((usuario) => usuario.id === usuarioId);

  if (!usuario) {
    return res.status(404).json("Usuário não encontrado.");

  }else{

  const page = request.query.page || 1;
  const pages = Math.ceil(usuario.recado?.length / 3);
  const indice = (page - 1) * 3;
  const aux = [...usuario.recado]; // spread operator
  const result = aux.splice(indice, 3);

  return response.status(200).json({ total: usuario.recado.length, recados: result, pages });
}
});

app.put("/usuarios/:id/recado/:idDoRecado",(request, response) => {
  const idDoUsuario = request.params.id;
  const idDoRecado = request.params.idDoRecado;

  const usuario = usuarios.find(usuario => usuario.id === Number(idDoUsuario));

  const recado = usuario.recado.find(recado => recado.id === Number(idDoRecado));
  
  if (!recado ) {
    return response.status(404).send('Recado não encontrado');
  }

  if (usuario === undefined && recado === recado) {
    return response.status(404).send('Usuario não encontrado');
  }
else{
  recado.titulo = request.body.titulo;
  recado.descricao = request.body.descricao;

  response.status(200).send('Recado atualizado com sucesso');
  return;
}
  
});
app.delete("/usuarios/:id/recado/:idDoRecado", (request, response) => {
  const id = Number(request.params.id);
  const idDoRecado = Number(request.params.idDoRecado)
  const indexUsuario = usuarios.findIndex((usuario) => usuario.id === id);

  if (indexUsuario < 0) {
    response.status(404).send("Usuário não encontrado.");
    return;
    }

  const indexDoRecado =  usuarios[indexUsuario].recado.findIndex((recado)=>recado.id === idDoRecado);
  
  if (indexDoRecado < 0) {
    response.status(404).send("Recado não encontrado.");
    return;
    }
  
  usuarios[indexUsuario].recado.splice(indexDoRecado, 1);
  return response.status(200).send("recado deletado");
});

app.listen(5555, () => {
    console.log("servidor Rodando");
  });