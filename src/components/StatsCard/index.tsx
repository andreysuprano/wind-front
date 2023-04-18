import { Box, Flex, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react';

import { ReactNode } from 'react';

interface StatsCardProps {
	title: string;
	stat: string;
	icon: ReactNode;
}

export function StatsCard(props: StatsCardProps) {
	const { title, stat, icon } = props;
	return (
		<Stat
			px={{ base: 2, md: 4 }}
			py={'5'}
			border={'1px solid'}
			borderColor={useColorModeValue('gray.100', 'gray.500')}
			rounded={'lg'}
			backgroundColor={'green.300'}
		>
			<Flex justifyContent={'space-between'}>
				<Box pl={{ base: 2, md: 4 }}>
					<StatLabel fontWeight={'medium'} isTruncated>
						{title}
					</StatLabel>
					<StatNumber fontSize={'2xl'} fontWeight={'medium'}>
						{stat}
					</StatNumber>
				</Box>
				<Box my={'auto'} color={useColorModeValue('gray.800', 'gray.200')} alignContent={'center'}>
					{icon}
				</Box>
			</Flex>
		</Stat>
	);
}
