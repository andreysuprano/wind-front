import { client } from './client';

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
};

type AulaTypePost = {
	id: string;
	alunoId: string;
	titulo: string;
	professorId: string;
	data: string;
	status: true;
};

type CreateBookPost = {
	nome: string;
	descricao: string;
	capa: string;
	idioma: string;
	nivel: string;
};

type CreateLessonPost = {
	nome: string;
	bookId: string;
	canvaUrl: string;
};

type UpdateStatusAula = {
	info: string;
	timer: number;
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

export const adicionarMaterial = async (material: MaterialType) => {
	return await client.post('/v1/material', material);
};

export const listarAlunos = async () => {
	return await client.get('/v1/aluno');
};

export const listarAlunosPorProfessorId = async (professorId: string) => {
	return await client.get(`/v1/aluno/professor/${professorId}`);
};
export const buscarAlunoPorId = async (id: string) => {
	return await client.get(`/v1/aluno/${id}`);
};
export const listarProfessores = async () => {
	return await client.get('/v1/professor');
};

export const listarAulas = async (professorId: string) => {
	return await client.get(`/v1/aula/professor/${professorId}`);
};

export const listarAulasPorAluno = async (alunoId: any) => {
	return await client.get(`/v1/aula/aluno/${alunoId}`);
};

export const buscarAulaPorID = async (id: any) => {
	return await client.get(`/v1/aula/${id}`);
};

export const listarMateriais = async () => {
	return await client.get('/v1/material');
};

export const listarBooks = async () => {
	return await client.get('/v1/book');
};

export const auth = async (auth: AuthType) => {
	return await client.post('/v1/auth/login', auth);
};

export const updateUsuario = async (email: string, usuario: UserType) => {
	return await client.post(`/v1/user/update-profile/${email}`, usuario);
};

export const updateProfessor = async (usuario: ProfessorType) => {
	return await client.post(`/v1/professor/update/${usuario.email}`, usuario);
};

export const updateAluno = async (usuario: AlunoType) => {
	return await client.post(`/v1/aluno/update/${usuario.email}`, usuario);
};

export const updateMaterial = async (id: string, material: MaterialType) => {
	return await client.post(`/v1/material/update/${id}`, material);
};

export const deleteMaterial = async (id: string) => {
	return await client.delete(`/v1/material/delete/${id}`);
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
export const buscarBookPorId = async (id: string) => {
	return await client.get(`/v1/book/${id}`);
};

export const sendToken = async (email: string) => {
	return await client.post(`/v1/user/send-code`, { email });
};

export const updatePassword = async (payload: UpdatePassword) => {
	return await client.post(`/v1/user/update-password`, payload);
};

export const updateStatusAula = async (id: string, status: string, payload: UpdateStatusAula) => {
	return await client.put(`/v1/aula/update/${id}/status/${status}`, payload);
};

export const adicionarBook = async (payload: CreateBookPost) => {
	return await client.post(`/v1/book`, payload);
};

export const adicionarLesson = async (payload: CreateLessonPost) => {
	return await client.post(`/v1/lesson`, payload);
};

export const updateLesson = async (id: string, payload: CreateLessonPost) => {
	return await client.put(`/v1/lesson/${id}`, payload);
};

export const deleteBook = async (id: string) => {
	return await client.delete(`/v1/book/${id}`);
};

export const deleteLesson = async (id: string) => {
	return await client.delete(`/v1/lesson/${id}`);
};
