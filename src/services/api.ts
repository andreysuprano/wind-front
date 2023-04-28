import { client } from './client';

type ProfessorType = {
	nome: string;
	sobrenome: string;
	cpf: string;
	email: string;
	senha: string;
	ativo: true;
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

export const adicionarProfessor = async (usuario: ProfessorType) => {
	return await client.post('/v1/professor', usuario);
};

export const adicionarAluno = async (usuario: AlunoType) => {
	return await client.post('/v1/aluno', usuario);
};

export const adicionarAula = async (aula: AulaType) => {
	return await client.post('/v1/aula', aula);
};

export const listarAlunos = async () => {
	return await client.get('/v1/aluno');
};

export const listarProfessores = async () => {
	return await client.get('/v1/professor');
};

export const listarAulas = async (professorId: string) => {
	return await client.get(`/v1/aula/professor/${professorId}`);
};

export const auth = async (auth: AuthType) => {
	return await client.post('/v1/auth/login', auth);
};

export const updateProfessor = async (usuario: ProfessorType) => {
	return await client.post(`/v1/professor/update/${usuario.email}`, usuario);
};

export const updateAluno = async (usuario: AlunoType) => {
	return await client.post(`/v1/aluno/update/${usuario.email}`, usuario);
};

export const listarMateriais = async () => {
	return await client.get('/v1/material');
};
