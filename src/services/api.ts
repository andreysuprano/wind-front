import { client } from "./client";

type UserType = {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  senha: string;
  ativo: true;
};

type AuthType = {
  username: string;
  password: string;
};

export const adicionarProfessor = async (usuario: UserType) => {
  return await client.post("/v1/user/professor", usuario);
};

export const adicionarAluno = async (usuario: UserType) => {
  return await client.post("/v1/user/aluno", usuario);
};

export const listarAlunos = async () => {
  return await client.get("/v1/user/alunos");
};

export const listarProfessores = async () => {
  return await client.get("/v1/user/professores");
};

export const auth = async (auth: AuthType) => {
  return await client.post("/v1/auth/login", auth);
};

export const updateUser = async (usuario: UserType) => {
  return await client.post(`/v1/user/update/${usuario.email}`, usuario);
};
