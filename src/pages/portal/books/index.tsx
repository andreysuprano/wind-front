import CardMaterial, { CardBookProps } from '@/components/CardMaterial';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import SidebarWithHeader from '@/components/SideBar';
import useAuth from '@/hooks/useAuth';
import { adicionarBook, listarBooks } from '@/services/api';
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

	return (
		<>
			<NavBar />
			<Flex width={'100%'} height={"75vh"}  alignItems="center" bgColor="gray.100" overflowX="unset" flexDir="column" bgGradient='linear(to-r, #254C80, #004edc)'>
			{loading ? (
				<Flex flexWrap="wrap" gap={'20px'} >
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
					<Skeleton w="600px" height="250px" borderRadius="20px" />
				</Flex>
			) : (
				<Flex flexWrap="wrap" gap={10} marginTop="20px" width={'70%'}>
					{books.map((book, index) => {

							return (
								<CardMaterial
									descricao={book.descricao}
									nome={book.nome}
									key={index}
									capa={book.capa}
									idioma={book.idioma}
									nivel={book.nivel}
									id={book.id}
									editHandler={()=>{}}
								/>
							);
					})}
				</Flex>
			)}
		</Flex>
		<Footer />
	</>)
}