import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';

export default function Aviso() {
	return (
		<Alert status="info" borderRadius="20px" width="90%" marginTop="50px">
			<AlertIcon />
			<Box>
				<AlertTitle>Neste final de semana!</AlertTitle>
				<AlertDescription>
					A Windfall está ofertando neste sábado ao vivo uma live abordando viagens e como conseguir descontos
					em passagens e hospedagens usando estratégias simples de conversão de dinheiro.
				</AlertDescription>
			</Box>
		</Alert>
	);
}
