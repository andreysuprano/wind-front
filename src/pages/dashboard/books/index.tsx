import CardMaterial, { CardBookProps } from '@/components/CardMaterial';
import SidebarWithHeader from '@/components/SideBar';
import useAuth from '@/hooks/useAuth';
import { adicionarBook, listarBooks, updateBook } from '@/services/api';
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
	Spinner
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

type ServiceBook = {
	nome: string;
	descricao: string;
	capa: string;
	idioma: string;
	nivel: string;
};

export default function Books() {
	const [ books, setBooks ] = useState<CardBookProps[]>([]);
	const [ loading, setLoading ] = useState(true);
	const [ isUploading, setIsUploading ] = useState(false);
	const [ bookEditing, setBookEditing ] = useState('');
	const [ search, setSearch ] = useState('');
	const [ step, setStep ] = useState(1);
	
	const [ selectImage, setSelectImage ] = useState(false);
	const [ imageFile, setImageFile ] = useState<File>();

	const [ nome, setNome ] = useState('');
	const [ descricao, setDescricao ] = useState('');
	const [ capa, setCapa ] = useState('');
	const [ idioma, setIdioma ] = useState('Inglês');
	const [ nivel, setNivel ] = useState('Beginner');

	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const {user} = useAuth();

	const buscarBooks = useCallback(
		() => {
			listarBooks()
				.then((response) => {
					setBooks(response.data);
					setLoading(false);
				})
				.catch((err) => {
					toast({
						title: `Não foi possível carregar o livro${err}`,
						status: 'error',
						isClosable: true
					});
				});
		},
		[ books ]
	);

	useEffect(() => {
		buscarBooks();
	}, []);

	const handleSelectedFile = async (files: any) => {
		if (files && files[0].size < 10000000) {
			setSelectImage(true);
			setImageFile(files[0]);
			const picBase64 = await toBase64(files[0]);
			setCapa(`${picBase64}`);
		} else {
			toast({
				title: `Foto muito pesada, selecione outra!`,
				status: 'warning',
				isClosable: true
			});
		}
	};

	const handleNextStep = () => {
		if (!nome || !descricao) {
			toast({
				title: `Todos os campos são obirgatórios`,
				status: 'error',
				isClosable: true
			});
		} else {
			if (step === 1) {
				setStep(2);
			}
		}
	};

	const handleSaveBook = async () => {
		if (!capa) {
			toast({
				title: `A capa é obrigatória!`,
				status: 'error',
				isClosable: true
			});
		} else {
			setIsUploading(true);
			uploadWithBase64(capa).then((link) => {
				adicionarBook({
					capa: link,
					descricao,
					idioma,
					nivel,
					nome
				})
					.then(() => {
						setIsUploading(false);
						onClose();
						setCapa('');
						setDescricao('');
						setIdioma('');
						setNivel('');
						setNome('');
						toast({
							title: `Livro adicionado com sucesso!`,
							status: 'success',
							isClosable: true
						});
						setStep(1);
						buscarBooks();
					})
					.catch((err) => {
						toast({
							title: `Erro ao adicionar livro! ${err}`,
							status: 'success',
							isClosable: true
						});
						setStep(1);
					});
			});
		}
	};

	const handleSaveEditingBook = async () => {
		if (!capa) {
			toast({
				title: `A capa é obrigatória!`,
				status: 'error',
				isClosable: true
			});
		} else {
			if(bookEditing && selectImage){
				setIsUploading(true);
				uploadWithBase64(capa).then((link) => {
					updateBook(bookEditing,{
						capa: link,
						descricao,
						idioma,
						nivel,
						nome
					})
						.then(() => {
							setIsUploading(false);
							onClose();
							setCapa('');
							setDescricao('');
							setIdioma('');
							setNivel('');
							setNome('');
							toast({
								title: `Livro adicionado com sucesso!`,
								status: 'success',
								isClosable: true
							});
							setStep(1);
							buscarBooks();
						})
						.catch((err) => {
							toast({
								title: `Erro ao adicionar livro! ${err}`,
								status: 'success',
								isClosable: true
							});
							setStep(1);
						});
				});
			}else{
				updateBook(bookEditing,{
					capa,
					descricao,
					idioma,
					nivel,
					nome
				})
					.then(() => {
						setIsUploading(false);
						onClose();
						setCapa('');
						setDescricao('');
						setIdioma('');
						setNivel('');
						setNome('');
						toast({
							title: `Livro adicionado com sucesso!`,
							status: 'success',
							isClosable: true
						});
						setStep(1);
						buscarBooks();
					})
					.catch((err) => {
						toast({
							title: `Erro ao adicionar livro! ${err}`,
							status: 'success',
							isClosable: true
						});
						setStep(1);
					});
			}
		}
	};

	const findBookInArray = (id:string) => {
		const book = books.find(bk => bk.id === id);
		if(book){
			setCapa(book.capa);
			setDescricao(book.descricao);
			setIdioma(book.idioma);
			setNivel(book.nivel);
			setNome(book.nome);
			setBookEditing(book.id);
		}
	}

	const handleEditBook = (id:string) =>{
		findBookInArray(id);
		onOpen();
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
						{
							user?.userType === "ADMIN" &&
							<Button leftIcon={<FaPlus />} colorScheme="blue" variant="solid" onClick={onOpen}>
								Novo
							</Button>
						}
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
				<Flex flexWrap="wrap" gap={10}>
					{books.map((book, index) => {
						if (
							Object.values(book)
								.map((variavel) => variavel)
								.reduce((a, b) => (b = a + ' ' + b))
								.toLowerCase()
								.includes(search.toLowerCase())
						)
							return (
								<CardMaterial
									descricao={book.descricao}
									nome={book.nome}
									key={index}
									capa={book.capa}
									idioma={book.idioma}
									nivel={book.nivel}
									id={book.id}
									editHandler={handleEditBook}
								/>
							);
					})}
				</Flex>
			)}

			<Modal
				isOpen={isOpen}
				onClose={() => {
					setStep(1);
					setCapa('');
					setDescricao('');
					setIdioma('');
					setNivel('');
					setNome('');
					setBookEditing('');
					setSelectImage(false);
					onClose();
				}}
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{bookEditing ? 'Edit Book' : 'Novo Book'}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{step === 1 ? (
							<Flex flexDir={'column'} gap={'15px'}>
								<FormControl>
									<FormLabel>Nome do book</FormLabel>
									<Input
										placeholder="Informe o nome do book"
										value={nome}
										onChange={(e) => setNome(e.target.value)}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Descrição</FormLabel>
									<Input
										placeholder="Informe a descrição do book"
										maxLength={100}
										value={descricao}
										onChange={(e) => setDescricao(e.target.value)}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Idioma</FormLabel>
									<Select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
										<option value="Inglês">Inglês</option>
										<option value="Português">Português</option>
										<option value="Italiano">Italiano</option>
									</Select>
								</FormControl>
								<FormControl>
									<FormLabel>Nível</FormLabel>
									<Select value={nivel} onChange={(e) => setNivel(e.target.value)}>
										<option value="Beginner">Beginner</option>
										<option value="Intermediate">Intermediate</option>
										<option value="Advanced">Advanced</option>
									</Select>
								</FormControl>
							</Flex>
						) : !isUploading ? (
							<Flex flexDir={'column'} gap={'15px'}>
								<Text fontSize="24px" fontWeight="bold">
									Selecione uma capa
								</Text>
								<Image src={capa} />
								<Input
									type="file"
									accept="image/*"
									onChange={(files) => handleSelectedFile(files.target.files)}
								/>
							</Flex>
						) : (
							<Flex
								flexDir={'column'}
								gap={'15px'}
								justifyContent="center"
								alignItems="center"
								padding="20px"
							>
								<Text fontSize="24px" fontWeight="bold">
									Fazendo upload do arquivo.
								</Text>
								<Spinner
									thickness="4px"
									speed="0.65s"
									emptyColor="gray.200"
									color="blue.500"
									size="xl"
								/>
							</Flex>
						)}
					</ModalBody>
					{!isUploading && (
						<ModalFooter gap={'15px'}>
							<Button isDisabled={step != 2} onClick={() => setStep(1)}>
								Voltar
							</Button>
							<Button
								variant={'solid'}
								background={'green.200'}
								onClick={() => {
									if (step === 1) {
										handleNextStep();
									} else {
										if(bookEditing){
											return handleSaveEditingBook();
										}
										handleSaveBook();
									}
								}}
							>
								{step === 1 ? 'Próximo' : 'Salvar'}
							</Button>
						</ModalFooter>
					)}
				</ModalContent>
			</Modal>
		</SidebarWithHeader>
	);
}
