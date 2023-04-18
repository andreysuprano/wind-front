import SidebarWithHeader from '@/components/NavBar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

export default function Home() {
	return (
		<SidebarWithHeader>
			<Breadcrumb spacing="8px" separator={'>'}>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbItem>
					<BreadcrumbLink href="#">About</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbItem isCurrentPage>
					<BreadcrumbLink href="#">Contact</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
		</SidebarWithHeader>
	);
}
