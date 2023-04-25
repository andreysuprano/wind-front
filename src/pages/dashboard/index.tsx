import SidebarWithHeader from '@/components/SideBar';
import { StatsCard } from '@/components/StatsCard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
	return (
		<SidebarWithHeader>
			<Flex
				flexDir={'column'}
				gap={'20px'}
				backgroundColor={'#FFF'}
				padding={'20px'}
				borderRadius={'10px'}
				marginBottom={'20px'}
			>
				<Flex marginBottom={'30px'} gap={'10px'} flexWrap={'wrap'}>
					<StatsCard stat="150" title="Quantidade de Alunos" icon={<FaPlus />} />
					<StatsCard stat="150" title="Quantidade de Alunos" icon={<FaPlus />} />
					<StatsCard stat="150" title="Quantidade de Alunos" icon={<FaPlus />} />
				</Flex>
				<Flex marginBottom={'30px'} gap={'10px'} flexWrap={'wrap'}>
					<StatsCard stat="150" title="Quantidade de Professores" icon={<FaPlus />} />
					<StatsCard stat="150" title="Quantidade de Professores" icon={<FaPlus />} />
					<StatsCard stat="150" title="Quantidade de Professores" icon={<FaPlus />} />
				</Flex>
				<Flex marginBottom={'30px'} gap={'10px'} flexWrap={'wrap'}>
					<StatsCard stat="150" title="Aulas essa semana" icon={<FaPlus />} />
					<StatsCard stat="150" title="Acesso ao material" icon={<FaPlus />} />
					<StatsCard stat="150" title="Alunos online" icon={<FaPlus />} />
				</Flex>
			</Flex>
		</SidebarWithHeader>
	);
}
