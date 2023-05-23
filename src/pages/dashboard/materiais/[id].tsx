import { buscarAlunoPorId, buscarBookPorId, updateStatusAula } from '@/services/api';
import { useEffect, useState } from 'react';
import { Button, Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import styles from '@/styles/general.module.css';
import { buscarAulaPorID } from '@/services/api';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import useAuth from '@/hooks/useAuth';

export type Lesson = {
	id:string;
	nome:string;
	canvaUrl:string;
	bookId:string;
}

export type Aula = {
	id: string;
    titulo: string;
    alunoId: string;
    materialId: string;
    professorId: string;
    status: string;
}

export type Book = {
	id: string,
	nome: string,
  	descricao: string,
  	capa: string,
  	idioma: string,
  	nivel: string,
	lessons: Lesson[]
}

export default function MateriaisId() {
	const toast = useToast();
	const [ denied, setDenied ] = useState(false);
	const [ loading, setLoading ] = useState(true);
	const [ countdown, setCountdown ] = useState(3600);
	const [ nomeAluno, setNomeAluno ] = useState('');

	const [ aulaBook, setBook] = useState<Book>();
	const [ lessons, setLessons] = useState<Lesson[]>([]);
	const [ lesson, setLesson ] = useState<Lesson>();
	const bookIdPath = location.pathname.split('/')[3];
	const {user} = useAuth();

	useEffect(()=>{
		buscarBookPorId(bookIdPath).then((response)=>{
			setLoading(false);
			const book:Book = response.data;
			setBook(book);
			setLessons(book.lessons);
			toast({
				title: `Information`,
				description:'You can access this material by contacting Windfall management. Copyrighted material!',
				status: 'info',
				isClosable: true,
				position:'top-left'
			});	
		}).catch((err)=>{
			toast({
				title: `${err}`,
				status: 'error',
				isClosable: true
			});
		});
	},[]);

	useEffect(
		() => {
			const intervalId = setInterval(() => {
				if (countdown < 0) {
					setCountdown(0);
					setDenied(true);
					window.close();
				} else {
					setCountdown((countdown) => countdown - 1);
				}
			}, 1000);

			return () => clearInterval(intervalId);
		},
		[ countdown ]
	);

	const handleSetLesson = (id:string) =>{
		const lessonFilter = lessons.find(item => item.id === id);
		setLesson(lessonFilter);
	}

	useEffect(() => {
		document.addEventListener('keydown', function(event) {
			const keys = [ 91, 16, 17, 18 ];
			if (keys.includes(event.keyCode) || event.keyCode === 91) {
				setDenied(true);
			}
		});
		
	}, []);

	useEffect(() => {
		setInterval(() => {
			toast({
				title: `Information`,
				description:'You can access this material by contacting Windfall management. Copyrighted material!',
				status: 'info',
				isClosable: true,
				position:'top-left'
			});			
		}, 600000);
	}, []);

	return (
		<>
			{loading ? 
				<Flex 
					flexDir="column" 
					backgroundColor="gray.800" 
					alignItems="center" 
					justifyContent="center"
					width="100%"
					height="100vh"
					gap="20px"
				>
					<Text fontSize="24px" fontWeight="bold" color="#ddd">
						Iniciando...
					</Text>
					<Spinner
						thickness="4px"
						speed="0.65s"
						emptyColor="gray.200"
						color="blue.500"
						size="xl"
					/>
				</Flex>
				:
				<Flex flexDir="column" backgroundColor="gray.800">
					<Flex>
						<Flex
							alignItems={'center'}
							gap={'50px'}
							bgColor={'gray.800'}
							width={'100%'}
							height={'60px'}
							padding="8px"
							position="fixed"
							bottom="0"
							zIndex={999}
						>
							<Button
								aria-label="Toggle Color Mode"
								onClick={()=>{setLesson(undefined)}}
								_focus={{ boxShadow: 'none' }}
								w="fit-content"
								>
								 <MdOutlineLibraryBooks />
							</Button>
						<Text fontSize={30} color="#DDD" fontWeight="extrabold">{user?.name}</Text>

						</Flex>
					</Flex>
					<Flex height="100vh">
						<iframe
							style={{ width: '100%' }}
							loading="lazy"
							src={lesson?.canvaUrl}
							allow="fullscreen"
						/>
					</Flex>
					<Flex
						position="absolute"
						height="100vh"
						width="100vw"
						flexDir="column"
						alignItems="center"
						justifyContent="center"
						background="#112233"
						opacity="0.95"
						backdropFilter="blur(10px)"
						visibility={!denied ? 'hidden' : 'visible'}
						zIndex={999}
					>
						<h1 className={styles.message}>Cuidado!</h1>
						<h5 className={styles.subMessage}>
							Não utilize este material de forma inapropriada ou sem consentimento da coordenação da Windfall.
						</h5>
						<Text color="white" marginBottom="20px" fontSize="12px">
							Conteúdo protegido por direitos autorais.
						</Text>
						<Button
							colorScheme="blue"
							onClick={() => {
								setDenied(false);
							}}
						>
							VOLTAR
						</Button>
					</Flex>
					<Flex
						position="absolute"
						height="100vh"
						width="100vw"
						flexDir="column"
						alignItems="center"
						justifyContent="center"
						background="#112233"
						opacity="1"
						backdropFilter="blur(10px)"
						visibility={lesson ? 'hidden' : 'visible'}
						zIndex={889}
					>
						<TableContainer backgroundColor="gray.700" borderRadius="10px" overflowY={'auto'} maxH={'70vh'}>
					<Table variant="unstyled" color="#DDD">
						<Tbody>
							{lessons.map((lesson, index) => {
								return (
									<Tr key={index} _hover={{ bgColor: 'gray.500', cursor: 'pointer' }} onClick={()=>{
										handleSetLesson(lesson.id);
									}}>
										<Td>{lesson.nome}</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
					</Flex>
					<Flex
						position="absolute"
						height="100vh"
						width="100vw"
						flexDir="column"
						alignItems="center"
						justifyContent="center"
						opacity="0.5"
						visibility={'visible'}
						zIndex={888}
						pointerEvents="none"
						bg="url(https://firebasestorage.googleapis.com/v0/b/projetcs-storage.appspot.com/o/windfall%2Fwatermark.png?alt=media&token=da2aef56-bae0-47d2-a7c3-58bd95f56d85)"
						bgRepeat="repeat"
					>
						<Text fontSize={30} color="#DDD" fontWeight="extrabold">{user?.name}</Text>
					</Flex>
				</Flex>
			}
		</>
		
	);
}
