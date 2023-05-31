import { Text, Flex, Badge, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { deleteBook } from '@/services/api';
import useAuth from '@/hooks/useAuth';
import { useState } from 'react';
type EditBook = (id: string) => void;

export interface CardBookProps {
	id: string;
	nome: string;
	descricao: string;
	capa: string;
	idioma: string;
	nivel: string;
	editHandler(id:string): void;
}

export default function CardMaterial(bookProps: CardBookProps) {
	const [bookEdit, setBookEdit] = useState();
	
	const router = useRouter();
	const {user} = useAuth();

	const handleDeleteBook = (id: string) => {
		deleteBook(id).then(() => {
			window.location.reload();
		});
	};
	function openTab(aulaId: string) {
		window.open(
		  `/dashboard/materiais/${aulaId}`,
		  "",
		  "popup,width=1280,height=720"
		);
	}
	const handleEdit = (bookId:string) => {
		bookProps.editHandler(bookId);
	}
	return (
		<Flex
			bgColor="gray.700"
			borderRadius={20}
			maxW="600px"
			minW="600px"
			alignItems="center"
			justifyContent="flex-start"
			padding="10px"
			gap="10px"
		>
			<Flex minWidth="180px" maxWidth="180px" height="180px" bgImage={bookProps.capa} bgPosition="center" bgSize="cover" borderRadius="15px">

			</Flex>
			<Flex flexDir="column">
				<Flex gap="10px">
					<Badge>{bookProps.idioma}</Badge>
					<Badge variant="outline" colorScheme="blue">
						{bookProps.nivel}
					</Badge>
				</Flex>
				<Flex flexDir="column">
					<Text color="#ddd" fontWeight="extrabold" fontSize="22px">
						{bookProps.nome}
					</Text>
					<Text color="#ddd">{bookProps.descricao}</Text>
				</Flex>

				<Flex marginTop="20px" gap="10px">
					<Button
						colorScheme="blue"
						zIndex={999}
						onClick={() => {
							if(user?.userType!="ADMIN"){	
								openTab(bookProps.id)
							}else{
								router.push(`/dashboard/books/lessons/${bookProps.id}`);
							}
						}}
					>
						Abrir
					</Button>
					{
						user?.userType === "ADMIN" &&
						<Button
						w="fit-content"
						colorScheme="yellow"
						onClick={() => {
							handleEdit(bookProps.id);
						}}
					>
						<BiEdit />
					</Button>
					}
					{
						user?.userType === "ADMIN" &&
						<Button
						w="fit-content"
						colorScheme="red"
						onClick={() => {
							handleDeleteBook(bookProps.id);
						}}
					>
						<FaRegTrashAlt />
					</Button>
					}
					
				</Flex>
			</Flex>
		</Flex>
	);
}
