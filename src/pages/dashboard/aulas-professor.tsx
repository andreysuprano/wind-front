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
	Select,
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogOverlay,
	AlertDialogCloseButton,
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { AiOutlineSelect } from 'react-icons/ai';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	adicionarAula,
	buscarProfessorPorEmail,
	listarAlunosPorProfessorId,
	listarAulas,
	listarMateriais
} from '@/services/api';
import useAuth from '@/hooks/useAuth';
import { AlunosType } from './alunos';
import { MaterialData } from '@/components/CardMaterial';

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
	const { user } = useAuth();
	const [ search, setSearch ] = useState('');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const alertDisclosure = useDisclosure();
	const [ loading, setLoading ] = useState(true);
	const [ aulas, setAulas ] = useState<AulasGet[]>([]);
	const [ aulaId, setAulaId ] = useState('');
	const [ alunos, setAlunos ] = useState<AlunosType[]>([]);
	const [ materiais, setMateriais ] = useState<MaterialData[]>([]);
	const { formState: { errors }, control, handleSubmit, watch, setValue } = useForm<any>({
		defaultValues: {
			alunoId: '',
			titulo: '',
			professorId: '',
			materialId: '',
			data: '',
			status: 'AGENDADA'
		}
	});
	const cancelRef = useRef<HTMLButtonElement>(null);
	const toast = useToast();

	const [ editingAulaID, setEditingAulaID ] = useState('');

	const editingAula = useMemo(() => aulas.find((aula) => aula.id === editingAulaID), [ aulas, editingAulaID ]);

	const buscarAulas = useCallback(
		() => {
			buscarProfessorPorEmail(`${user?.username}`)
				.then((professor) => {
					setValue('professorId', professor.data.id);
					listarAulas(professor.data.id)
						.then((aulas) => {
							setAulas(aulas.data);
							setLoading(false);
							buscarAlunos(professor.data.id);
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
				})
				.catch((error) => {
					if (!error.response) return;
					toast({
						title: `Não foi validar o professor.`,
						status: 'error',
						isClosable: true
					});
				});
		},
		[ aulas ]
	);

	function openTab(aulaId: string) {
		let win = window.open(
		  `/dashboard/materiais/${aulaId}`,
		  "",
		  "popup,width=1000,height=600, left=300, top=500"
		);
		alertDisclosure.onClose();
	  }

	const buscarMateriais = useCallback(
		() => {
			listarMateriais()
				.then((response) => {
					setMateriais(response.data);
				})
				.catch((error) => {
					if (!error.response) return;
					toast({
						title: `Não foi possível listar os materiais.`,
						status: 'error',
						isClosable: true
					});
				});
		},
		[ materiais ]
	);

	const buscarAlunos = (professorId: string) => {
		listarAlunosPorProfessorId(professorId)
			.then((alunos) => {
				setAlunos(alunos.data);
			})
			.catch((error) => {
				if (!error.response) return;
				toast({
					title: `Não foi possível listar os alunos.`,
					status: 'error',
					isClosable: true
				});
			});
	};

	useEffect(() => {
		buscarAulas();
		buscarMateriais();
	}, []);

	const handleAddAula: SubmitHandler<any> = (formData) => {
		setLoading(true);
		setValue('status', 'AGENDADA');
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
													{aula.status !== 'CONCLUIDA' ? 
														<Badge colorScheme="yellow">{aula.status}</Badge>
														:<Badge colorScheme="green">{aula.status}</Badge>
													}
												</Td>
												<Td>
												{aula.status === 'AGENDADA' &&
													<Button
														onClick={()=>{
															alertDisclosure.onOpen()
															setAulaId(aula.id)
														}}
													>Iniciar
													</Button>
												}
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
										name="materialId"
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<Box>
												<Text>Material</Text>
												<Select required={true} {...field}>
													<option value="">Selecione o Material</option>;
													{materiais.map((item, index) => {
														return (
															<option
																value={item.id}
																key={index}
															>{`${item.nome}`}</option>
														);
													})}
												</Select>
											</Box>
										)}
									/>
									<Controller
										name="alunoId"
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
			<AlertDialog
				motionPreset='slideInBottom'
				leastDestructiveRef={cancelRef}
				onClose={alertDisclosure.onClose}
				isOpen={alertDisclosure.isOpen}
				isCentered
			>
				<AlertDialogOverlay />

				<AlertDialogContent>
				<AlertDialogHeader>Você deseja iniciar a aula?</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>
					Ao inciar o status da aula será alterado e o tempo iniciará a contagem, tenha uma ótima aula!
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={alertDisclosure.onClose}>
						Cancelar
					</Button>
					<Button colorScheme='red' ml={3} onClick={()=>openTab(aulaId)}>
						Iniciar
					</Button>
				</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SidebarWithHeader>
	);
}
