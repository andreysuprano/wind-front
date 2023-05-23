import SidebarWithHeader from '@/components/SideBar';
import { Flex, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { AxisOptions, Chart } from 'react-charts';
import { BsFillJournalBookmarkFill } from 'react-icons/bs';
import { IoSchoolOutline } from 'react-icons/io5';
import { MdFreeCancellation } from 'react-icons/md';
import useDemoConfig from '../useDemoConfig';

type DailyStars = {
	professor: string;
	aulas: number;
};

type Series = {
	label: string;
	data: DailyStars[];
};

export default function Home() {
	const { data, randomizeData } = useDemoConfig({
		series: 3,
		dataType: 'ordinal'
	});

	const primaryAxis = useMemo<AxisOptions<typeof data[number]['data'][number]>>(
		() => ({
			getValue: (datum) => datum.primary
		}),
		[]
	);

	const secondaryAxes = useMemo<AxisOptions<typeof data[number]['data'][number]>[]>(
		() => [
			{
				getValue: (datum) => datum.secondary
			}
		],
		[]
	);

	return (
		<SidebarWithHeader>
			<Flex flexDir={'column'} gap={'10px'} padding={'20px'} borderRadius={'10px'} marginBottom={'20px'}>
				<Text color="#DDD">Dados Fakes</Text>
				<Flex marginBottom={'30px'} flexWrap={'wrap'} gap="10px" justifyContent="center">
					<Flex
						width={{ base: '100%', md: '32%' }}
						height="100px"
						bgColor="gray.700"
						borderRadius="10px"
						flexDir="column"
						justifyContent="center"
						alignItems="center"
						borderColor="orange"
						borderWidth="2px"
					>
						<Flex flexDir="column">
							<Flex justifyContent="center" alignItems="center" gap="10px">
								<BsFillJournalBookmarkFill size={35} color="orange" />
								<Text fontWeight={700} lineHeight="25px" fontSize="16px" color="#DDD">
									Aulas iniciadas<Text fontWeight={900} fontSize="32px">
										29
									</Text>
								</Text>
							</Flex>
						</Flex>
					</Flex>

					<Flex
						width={{ base: '100%', md: '32%' }}
						height="100px"
						bgColor="gray.700"
						borderRadius="10px"
						flexDir="column"
						justifyContent="center"
						alignItems="center"
						borderColor="green.300"
						borderWidth="2px"
					>
						<Flex flexDir="column">
							<Flex justifyContent="center" alignItems="center" gap="10px">
								<IoSchoolOutline size={35} color="green" />
								<Text fontWeight={700} lineHeight="25px" fontSize="16px" color="#DDD">
									Aulas Concluídas<Text fontWeight={900} fontSize="32px">
										42
									</Text>
								</Text>
							</Flex>
						</Flex>
					</Flex>

					<Flex
						width={{ base: '100%', md: '32%' }}
						height="100px"
						bgColor="gray.700"
						borderRadius="10px"
						flexDir="column"
						justifyContent="center"
						alignItems="center"
						borderColor="red.400"
						borderWidth="2px"
					>
						<Flex flexDir="column">
							<Flex justifyContent="center" alignItems="center" gap="10px">
								<MdFreeCancellation size={35} color="red" />
								<Text fontWeight={700} lineHeight="25px" fontSize="16px" color="#DDD">
									Aulas canceladas<Text fontWeight={900} fontSize="32px">
										3
									</Text>
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			<Flex width="100%" justifyContent="center" alignItems="center">
				<Flex
					bgColor="#DDD"
					width="95%"
					minHeight="400px"
					paddingX="10px"
					paddingY="10px"
					borderRadius="20px"
					justifyContent="center"
					alignItems="center"
				>
					<Flex width="95%" minHeight="300px" borderRadius="20px">
						<Chart
							options={{
								data,
								primaryAxis,
								secondaryAxes,
								tooltip: false
							}}
						/>
					</Flex>
				</Flex>
			</Flex>
		</SidebarWithHeader>
	);
}
