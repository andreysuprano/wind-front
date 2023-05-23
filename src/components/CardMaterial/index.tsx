import { useState } from 'react';
import { Text, Flex, Image, Badge, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BsCollectionPlayFill } from 'react-icons/bs';
import { FaRegTrashAlt } from 'react-icons/fa';
import { deleteBook } from '@/services/api';
import useAuth from '@/hooks/useAuth';

export interface CardBookProps {
	id: string;
	nome: string;
	descricao: string;
	capa: string;
	idioma: string;
	nivel: string;
}

export default function CardMaterial(bookProps: CardBookProps) {
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
	return (
		<Flex
			bgColor="gray.700"
			borderRadius={20}
			maxW="600px"
			alignItems="center"
			justifyContent="center"
			padding="10px"
			gap="10px"
		>
			<Image maxWidth="200px" height="fit-content" borderRadius={20} src={bookProps.capa} />
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
