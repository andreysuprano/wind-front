import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';

export default function Aviso() {
	return (
		<Alert status="info" borderRadius="20px" width="90%" marginTop="50px">
			<AlertIcon />
			<Box>
				<AlertTitle>Bem vindo a Windfall!</AlertTitle>
				<AlertDescription>Desejamos a você uma excelente experiência de aprendizado!</AlertDescription>
			</Box>
		</Alert>
	);
}
