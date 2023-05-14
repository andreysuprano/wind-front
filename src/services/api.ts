import { client } from "./client";

type ProfessorType = {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  senha?: string;
  ativo: true;
};

type UserType = {
  nome: string;
  sobrenome: string;
  email: string;
  avatarUrl: string;
};

type AlunoType = {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  senha: string;
  ativo: true;
  professorId: string;
};

type AulaType = {
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

type UpdatePassword = {
  email: string;
  senha: string;
  codigo: number;
};

type MaterialType = {
  nome: string;
  descricao: string;
  driveUrl: string;
  thumbnail: string;
  id: string;
};

type AulaTypePost = {
  id: string;
  alunoId: string;
  titulo: string;
  professorId: string;
  data: string;
  status: true;
};

export const adicionarProfessor = async (usuario: ProfessorType) => {
  return await client.post("/v1/professor", usuario);
};

export const adicionarAluno = async (usuario: AlunoType) => {
  return await client.post("/v1/aluno", usuario);
};

export const adicionarAula = async (aula: AulaType) => {
  return await client.post("/v1/aula", aula);
};

export const adicionarMaterial = async (material: MaterialType) => {
  return await client.post("/v1/material", material);
};

export const listarAlunos = async () => {
  return await client.get("/v1/aluno");
};

export const listarAlunosPorProfessorId = async (professorId: string) => {
  return await client.get(`/v1/aluno/professor/${professorId}`);
};

export const listarProfessores = async () => {
  return await client.get("/v1/professor");
};

export const listarAulas = async (professorId: string) => {
  return await client.get(`/v1/aula/professor/${professorId}`);
};

export const listarAulasPorAluno = async (alunoId: any) => {
  return await client.get(`/v1/aula/aluno/${alunoId}`);
};

export const listarMateriais = async () => {
  return await client.get("/v1/material");
};

export const auth = async (auth: AuthType) => {
  return await client.post("/v1/auth/login", auth);
};

export const updateUsuario = async (usuario: UserType) => {
  return await client.post(`/v1/user/update-profile/${usuario.email}`, usuario);
};

export const updateProfessor = async (usuario: ProfessorType) => {
  return await client.post(`/v1/professor/update/${usuario.email}`, usuario);
};

export const updateAluno = async (usuario: AlunoType) => {
  return await client.post(`/v1/aluno/update/${usuario.email}`, usuario);
};

export const updateMaterial = async (usuario: MaterialType) => {
  return await client.post(`/v1/material/update/${usuario.id}`, usuario);
};

export const updateAula = async (aula: AulaTypePost) => {
  return await client.post(`/v1/aula/update/${aula.id}`, aula);
};

export const buscarMaterialPorId = async (id: string) => {
  return await client.get(`/v1/material/${id}`);
};

export const buscarProfessorPorEmail = async (email: string) => {
  return await client.get(`/v1/professor/email/${email}`);
};

export const sendToken = async (email: string) => {
  return await client.post(`/v1/user/send-code`, { email });
};

export const updatePassword = async (payload: UpdatePassword) => {
  return await client.post(`/v1/user/update-password`, payload);
};
