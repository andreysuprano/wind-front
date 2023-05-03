import SidebarWithHeader from '@/components/SideBar';
import {
	Badge,
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useToast,
	Text,
	useDisclosure,
	ModalFooter,
	Stack,
	Skeleton,
	Avatar,
	Select
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { AiOutlineSelect } from 'react-icons/ai';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	adicionarAula,
	buscarProfessorPorEmail,
	listarAlunos,
	listarAlunosPorProfessorId,
	listarAulas
} from '@/services/api';
import useAuth from '@/hooks/useAuth';
import { AlunosType } from './alunos';

interface AulasGet {
	id: string;
	titulo: string;
	data: string;
	alunoId: string;
	professorId: string;
	materialId: string;
	status: string;
	aluno: {
		nome: string;
		avatarUrl: string;
		sobrenome: string;
		email: string;
		userId: string;
	};
}

interface AulasGetNormalized {
	id: string;
	titulo: string;
	data: string;
	alunoId: string;
	professorId: string;
	status: string;
	nomeAluno: string;
	avatarUrl: string;
	emailAluno: string;
	materialId: string;
}

interface ProfessorGet {
	id: string;
	nome: string;
	sobrenome: string;
	email: string;
	cpf: string;
	userId: string;
	user: {
		avatarUrl: string;
		ativo: boolean;
	};
}

export default function AulasProfessor() {
	const { formState: { errors }, control, handleSubmit, watch, setValue } = useForm<any>({
		defaultValues: {
			alunoId: '',
			titulo: '',
			professorId: '',
			materialId: '',
			data: '',
			status: ''
		}
	});
	const { user } = useAuth();
	const [ search, setSearch ] = useState('');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ loading, setLoading ] = useState(true);
	const [ professorId, setProfessorId ] = useState<string>('');
	const [ aulas, setAulas ] = useState<AulasGet[]>([]);
	const [ alunos, setAlunos ] = useState<AlunosType[]>([]);

	const toast = useToast();
	const [ editingAulaID, setEditingAulaID ] = useState('');
	const editingAula = useMemo(() => aulas.find((aula) => aula.id === editingAulaID), [ aulas, editingAulaID ]);

	useEffect(() => {
		const profId = localStorage.getItem('@professorID');
		setProfessorId(profId + '');
	}, []);

	useEffect(
		() => {
			buscarAulas();
			buscarAlunos();
		},
		[ professorId ]
	);

	const buscarAulas = useCallback(
		() => {
			listarAulas(professorId)
				.then((response) => {
					setAulas(response.data);
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					if (!error.response) return;
					toast({
						title: `Não foi possível listar as aulas.`,
						status: 'error',
						isClosable: true
					});
				});
		},
		[ aulas ]
	);

	const buscarAlunos = useCallback(
		() => {
			listarAlunosPorProfessorId(professorId)
				.then((response) => {
					setAlunos(response.data);
				})
				.catch((error) => {
					if (!error.response) return;
					toast({
						title: `Não foi possível listar os alunos.`,
						status: 'error',
						isClosable: true
					});
				});
		},
		[ alunos ]
	);

	// const buscarProfessorData = useCallback(
	// 	() => {
	//     if(user){
	//       buscarProfessorPorEmail(user?.username)
	//         .then((response) => {
	//           setProfessorId(response.data.id);
	//           buscarAulas();
	//         })
	//         .catch((error) => {
	//           if (!error.response) return;
	//           toast({
	//             title: `Não foi validar o professor.`,
	//             status: 'error',
	//             isClosable: true
	//           });
	//         });
	//     }
	// 	},
	// 	[ professorId ]
	// );

	useEffect(() => {
		buscarAlunos();
	}, []);

	const handleAddAula: SubmitHandler<any> = (formData) => {
		setLoading(true);
		adicionarAula(formData)
			.then(() => {
				onClose();
				setLoading(false);
				window.location.reload();
				toast({
					title: `Aula adicionada com sucesso.`,
					status: 'success',
					isClosable: true
				});
			})
			.catch((error) => {
				setLoading(false);
				if (!error.response) return;
				toast({
					title: `Não foi possível adicionar nova aula.`,
					status: 'error',
					isClosable: true
				});
			});
	};

	return (
		<SidebarWithHeader>
			<Flex
				flexDir={'column'}
				gap={'20px'}
				backgroundColor={'#FFF'}
				padding={'20px'}
				borderRadius={'10px'}
				marginBottom={'20px'}
			>
				<Flex>
					<Breadcrumb spacing="8px" separator={'>'}>
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem>
							<BreadcrumbLink href="">Aulas</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
				</Flex>
				<Flex gap={'20px'}>
					<InputGroup gap={'20px'}>
						<InputLeftElement pointerEvents="none" color={'gray.300'}>
							<FaSearch />
						</InputLeftElement>
						<Input
							type="tel"
							placeholder="Buscar aulas..."
							onChange={(e) => setSearch(e.target.value)}
							value={search}
						/>
						<Button leftIcon={<FaPlus />} colorScheme="blue" variant="solid" onClick={onOpen}>
							Novo
						</Button>
					</InputGroup>
				</Flex>
			</Flex>
			{loading ? (
				<Stack>
					<Skeleton height="20px" />
					<Skeleton height="40px" />
					<Skeleton height="40px" />
					<Skeleton height="40px" />
					<Skeleton height="20px" />
				</Stack>
			) : !aulas ? (
				<Flex width={'100%'} height={'60%'} alignItems={'center'} justifyContent={'center'}>
					<Flex>
						<AiOutlineSelect />
						<Text>Selecione um professor para buscar as aulas.</Text>
					</Flex>
				</Flex>
			) : (
				<TableContainer backgroundColor={'#FFF'} borderRadius="10px">
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Título</Th>
								<Th>Data</Th>
								<Th>Aluno</Th>
								<Th>Status</Th>
								<Th />
							</Tr>
						</Thead>
						<Tbody>
							{aulas.length > 0 ? (
								aulas.map((item, index: number) => {
									const aula: AulasGetNormalized = {
										alunoId: item.alunoId,
										avatarUrl: item.aluno.avatarUrl,
										data: item.data,
										emailAluno: item.aluno.email,
										id: item.id,
										nomeAluno: `${item.aluno.nome} ${item.aluno.sobrenome}`,
										professorId: item.professorId,
										status: item.status,
										titulo: item.titulo,
										materialId: item.materialId
									};
									// @ts-ignore
									if (
										Object.values(aula)
											.map((variavel) => variavel)
											.reduce((a, b) => (b = a + ' ' + b))
											.toLowerCase()
											.includes(search.toLowerCase())
									)
										return (
											<Tr key={index}>
												<Td>{aula.titulo}</Td>
												<Td>
													{new Date(aula.data).toLocaleString('pt-br', {
														day: '2-digit',
														month: '2-digit',
														year: '2-digit'
													})}
												</Td>
												<Td>
													<Flex gap={'10px'} alignItems={'center'}>
														<Avatar size="sm" name={aula.nomeAluno} src={aula.avatarUrl} />
														{aula.nomeAluno}
													</Flex>
												</Td>
												<Td>
													{aula.status !== 'PENDENTE' ? (
														<Badge colorScheme="green">REALIZADA</Badge>
													) : (
														<Badge colorScheme="red">PENDENTE</Badge>
													)}
												</Td>
												<Td>
													<Button>Iniciar</Button>
												</Td>
											</Tr>
										);
								})
							) : (
								<Tr>
									<Td>
										<Flex
											width={'100%'}
											height={'60%'}
											alignItems={'center'}
											justifyContent={'center'}
										>
											<AiOutlineSelect />
											<Text>Nenhum resultado encontrado.</Text>
										</Flex>
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</TableContainer>
			)}
			<Modal
				onClose={() => {
					onClose();
					setEditingAulaID('');
				}}
				isOpen={isOpen}
				isCentered
			>
				<ModalOverlay />
				<form onSubmit={handleSubmit(handleAddAula)}>
					<ModalContent>
						<ModalHeader>{`${editingAula ? 'Editar' : 'Adicionar nova'} aula`}</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Flex flexDir={'column'} gap={'15px'}>
								<Controller
									name="titulo"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Titulo</Text>
											<Input placeholder="Titulo" required={true} {...field} />
										</Box>
									)}
								/>
								<Flex gap={'15px'}>
									<Controller
										name="material"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Box>
												<Text>Material</Text>
												<Select required={true} {...field}>
													<option value="">Selecione o Material</option>;
													{alunos.map((item, index) => {
														return (
															<option
																value={item.id}
																key={index}
															>{`${item.nome} ${item.sobrenome}`}</option>
														);
													})}
												</Select>
											</Box>
										)}
									/>
									<Controller
										name="aluno"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Box>
												<Text>Aluno</Text>
												<Select required={true} {...field}>
													<option value="">Selecione o Aluno</option>;
													{alunos.map((item, index) => {
														return (
															<option
																value={item.id}
																key={index}
															>{`${item.nome} ${item.sobrenome}`}</option>
														);
													})}
												</Select>
											</Box>
										)}
									/>
								</Flex>
								<Controller
									name="data"
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<Box>
											<Text>Data</Text>
											<Input type="datetime-local" required={true} {...field} />
										</Box>
									)}
								/>
							</Flex>
						</ModalBody>
						<ModalFooter gap={'15px'}>
							<Button
								onClick={() => {
									onClose();
									setEditingAulaID('');
								}}
							>
								Fechar
							</Button>
							<Button variant={'solid'} background={'green.200'} type="submit">
								Salvar
							</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</SidebarWithHeader>
	);
}
