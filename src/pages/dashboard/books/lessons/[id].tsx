import SidebarWithHeader from '@/components/SideBar';
import useAuth from '@/hooks/useAuth';
import {
	adicionarBook,
	adicionarLesson,
	buscarBookPorId,
	deleteLesson,
	listarBooks,
	updateLesson
} from '@/services/api';
import { toBase64, uploadWithBase64 } from '@/util/imageHelper';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Text,
	Image,
	Img,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Skeleton,
	useDisclosure,
	useToast,
	Spinner,
	TableContainer,
	Table,
	Thead,
	Th,
	Tbody,
	Tr,
	Td
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { FaSearch, FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import { RiEdit2Line } from 'react-icons/ri';

type Lesson = {
	id: string;
	nome: string;
	canvaUrl: string;
	bookId: string;
};

export default function Lessons() {
	const [ lessons, setLessons ] = useState<Lesson[]>([]);
	const [ loading, setLoading ] = useState(true);
	const [ search, setSearch ] = useState('');
	const [ isEditing, setIsEditing ] = useState(false);
	const [ lessonId, setLessonId ] = useState('');
	const [ nome, setNome ] = useState('');
	const [ canvaUrl, setCanvaUrl ] = useState('');

	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const bookId = location.pathname.split('/')[4];

	const {user} = useAuth();
	const buscarLessons = useCallback(
		() => {
			buscarBookPorId(bookId)
				.then((response) => {
					var lessonsData = response.data.lessons;
					lessonsData.sort();
					setLessons(lessonsData);
					setLoading(false);
					onClose();
				})
				.catch((err) => {
					toast({
						title: `Não foi possível carregar o livro${err}`,
						status: 'error',
						isClosable: true
					});
				});
		},
		[ lessons ]
	);

	useEffect(() => {
		buscarLessons();
	}, []);

	const handleSaveLesson = async () => {
		if (!canvaUrl || !nome) {
			toast({
				title: `Todos os campo são obrigatórios`,
				status: 'error',
				isClosable: true
			});
		} else {
			if (!isEditing) {
				setLoading(true);
				adicionarLesson({
					bookId,
					canvaUrl,
					nome
				}).then(() => {
					setLoading(false);
					buscarLessons();
					setNome('');
					setCanvaUrl('');
					toast({
						title: `Adicionado com sucesso!`,
						status: 'success',
						isClosable: true
					});
				});
			} else {
				setLoading(true);
				updateLesson(lessonId, {
					bookId,
					canvaUrl,
					nome
				}).then(() => {
					setLoading(false);
					buscarLessons();
				});
			}
		}
	};

	const handleDeleteLesson = (id: string) => {
		deleteLesson(id)
			.then(() => {
				buscarLessons();
			})
			.catch((err) => {
				toast({
					title: `${err}`,
					status: 'success',
					isClosable: true
				});
			});
	};
	function openTab() {
		window.open(
		  `/dashboard/materiais/${bookId}`,
		  "",
		  "popup,width=1000,height=600, left=300, top=500"
		);
	  }
	return (
		<SidebarWithHeader>
			<Flex
				flexDir={'column'}
				gap={'20px'}
				backgroundColor={'gray.700'}
				color={'white'}
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
							<BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbItem>
							<BreadcrumbLink>Lessons</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
				</Flex>
				<Flex>
					<InputGroup gap={'20px'}>
						<InputLeftElement pointerEvents="none" color={'gray.300'}>
							<FaSearch />
						</InputLeftElement>
						<Input
							type="tel"
							placeholder="Buscar Material"
							onChange={(e) => setSearch(e.target.value)}
							value={search}
							border="none"
							bgColor="gray.600"
						/>
						<Button leftIcon={<FaPlus />} colorScheme="blue" variant="solid" onClick={onOpen}>
							Novo
						</Button>
					</InputGroup>
				</Flex>
			</Flex>
			{loading ? (
				<Flex flexWrap="wrap" gap={'20px'}>
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
				</Flex>
			) : (
				<TableContainer backgroundColor="gray.700" borderRadius="10px" overflowY={'auto'} maxH={'70vh'}>
					<Table variant="unstyled" color="#DDD">
						<Thead position="sticky" top={0} zIndex="docked" bgColor={'gray.700'} borderBottom={'gray.300'}>
							<Tr>
								<Th>Nome</Th>
								<Th>Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{lessons.sort((a,b)=>{
								if(a.nome < b.nome)
									return -1;
								if(a.nome > b.nome)
									return 1
								return 0
							}).map((lesson, index) => {
								return (
									<Tr key={index} _hover={{ bgColor: 'gray.500', cursor: 'pointer' }}>
										<Td>{lesson.nome}</Td>
										<Td>
											<Flex gap={5}>
												<Button w="fit-content" colorScheme="green" onClick={() => openTab()}>
													<MdGridView />
												</Button>
												<Button
													w="fit-content"
													colorScheme="orange"
													onClick={() => {
														setCanvaUrl(lesson.canvaUrl);
														setNome(lesson.nome);
														setLessonId(lesson.id);
														setIsEditing(true);
														onOpen();
													}}
													visibility={user?.userType != "ADMIN" ? "hidden" : "visible"}
												>
													<RiEdit2Line />
												</Button>
												<Button
													w="fit-content"
													colorScheme="red"
													onClick={() => {
														handleDeleteLesson(lesson.id);
													}}
													visibility={user?.userType != "ADMIN" ? "hidden" : "visible"}
												>
													<FaRegTrashAlt />
												</Button>
											</Flex>
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			)}

			<Modal
				isOpen={isOpen}
				onClose={() => {
					onClose();
					setCanvaUrl('');
					setNome('');
					setIsEditing(false);
					setLessonId('');
				}}
				isCentered
			>
				<ModalOverlay
					onClick={() => {
						onClose();
						setCanvaUrl('');
						setNome('');
						setIsEditing(false);
						setLessonId('');
					}}
				/>
				<ModalContent>
					<ModalHeader>Nova Lesson</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir={'column'} gap={'15px'}>
							<FormControl>
								<FormLabel>Nome</FormLabel>
								<Input
									placeholder="Informe o nome da lesson"
									value={nome}
									onChange={(e) => setNome(e.target.value)}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Canva Url</FormLabel>
								<Input
									placeholder="Informe a descrição da lesson"
									maxLength={100}
									value={canvaUrl}
									onChange={(e) => setCanvaUrl(e.target.value)}
								/>
							</FormControl>
						</Flex>
					</ModalBody>
					<ModalFooter gap={'15px'}>
						<Button variant={'solid'} background={'gray.200'} onClick={() => onClose()}>
							Fechar
						</Button>
						<Button variant={'solid'} background={'blue.500'} onClick={handleSaveLesson}>
							Salvar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</SidebarWithHeader>
	);
}
