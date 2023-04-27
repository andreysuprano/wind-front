import SidebarWithHeader from "@/components/SideBar";
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  Text,
  useDisclosure,
  ModalFooter,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { FaSearch, FaPlus, FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { client } from "@/services/client";
import { useEffect, useMemo, useState } from "react";
import { adicionarAula, listarAulas } from "@/services/api";

export default function Aulas() {
  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<any>({
    defaultValues: {
      alunoId: "",
      titulo: "",
      professorId: "",
      data: "",
      status: "",
    },
  });
  const [search, setSearch] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [aulas, setAulas] = useState<any[]>([]);
  const toast = useToast();
  const [editingAulaID, setEditingAulaID] = useState("");
  const editingAula = useMemo(
    () => aulas.find((aula) => aula.cpf === editingAulaID),
    [aulas, editingAulaID]
  );

  async function buscarAulas() {
    setLoading(true);
    listarAulas()
      .then((response) => {
        setLoading(false);
        setAulas(response.data);
      })
      .catch((error) => {
        if (!error.response) return;
        setLoading(false);
        toast({
          title: `Não foi possível listar as aulas.`,
          status: "error",
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    buscarAulas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAula: SubmitHandler<any> = (formData) => {
    setLoading(true);
    adicionarAula(formData)
      .then(() => {
        onClose();
        setLoading(false);
        window.location.reload();
        toast({
          title: `Aula adicionada com sucesso.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível adicionar nova aula.`,
          status: "error",
          isClosable: true,
        });
      });
  };

  console.log(aulas);

  return (
    <SidebarWithHeader>
      <Flex
        flexDir={"column"}
        gap={"20px"}
        backgroundColor={"#FFF"}
        padding={"20px"}
        borderRadius={"10px"}
        marginBottom={"20px"}
      >
        <Flex>
          <Breadcrumb spacing="8px" separator={">"}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="">Aulas</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <Flex>
          <InputGroup gap={"20px"}>
            <InputLeftElement pointerEvents="none" color={"gray.300"}>
              <FaSearch />
            </InputLeftElement>
            <Input
              type="tel"
              placeholder="Buscar aulas..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              variant="solid"
              onClick={onOpen}
            >
              Novo
            </Button>
          </InputGroup>
        </Flex>
      </Flex>
      {loading ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <TableContainer backgroundColor={"#FFF"} borderRadius="10px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Título</Th>
                <Th>Data</Th>
                <Th>Aluno</Th>
                <Th>Professor</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {aulas.map(
                (
                  aula: {
                    titulo: string;
                    data: string;
                    alunoId: string;
                    professorId: string;
                    status: string;
                  },
                  index: number
                ) => {
                  // @ts-ignore
                  if (
                    Object.values(aula)
                      .map((variavel) => variavel)
                      .reduce((a, b) => (b = a + " " + b))
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                    return (
                      <Tr key={index}>
                        <Td>{aula.titulo}</Td>
                        <Td>
                          {new Date(aula.data).toLocaleString("pt-br", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </Td>
                        <Td>{aula.alunoId}</Td>
                        <Td>{aula.professorId}</Td>
                        <Td>
                          {aula.status !== "PENDENTE" ? (
                            <Badge colorScheme="green">REALIZADA</Badge>
                          ) : (
                            <Badge colorScheme="red">PENDENTE</Badge>
                          )}
                        </Td>
                        <Td>
                          <Flex gap={"10px"}>
                            <IconButton
                              icon={<FaPencilAlt />}
                              colorScheme="yellow"
                              variant="solid"
                              aria-label=""
                              onClick={() => {}}
                            />
                            <IconButton
                              icon={<FaTrashAlt />}
                              colorScheme="red"
                              variant="solid"
                              aria-label=""
                              onClick={() => {}}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    );
                }
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Modal
        onClose={() => {
          onClose();
          setEditingAulaID("");
        }}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit(handleAddAula)}>
          <ModalContent>
            <ModalHeader>{`${
              editingAula ? "Editar" : "Adicionar nova"
            } aula`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDir={"column"} gap={"15px"}>
                <Flex gap={"15px"}>
                  <Controller
                    name="nome"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Box>
                        <Text>Nome</Text>
                        <Input placeholder="Nome" required={true} {...field} />
                      </Box>
                    )}
                  />
                  <Controller
                    name="sobrenome"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Box>
                        <Text>Sobrenome</Text>
                        <Input
                          placeholder="Sobrenome"
                          required={true}
                          {...field}
                        />
                      </Box>
                    )}
                  />
                </Flex>
                <Controller
                  name="cpf"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Cpf</Text>
                      <Input placeholder="Cpf" required={true} {...field} />
                    </Box>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Email</Text>
                      <Input placeholder="Email" required={true} {...field} />
                    </Box>
                  )}
                />
                <Controller
                  name="senha"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Senha</Text>
                      <Input placeholder="Senha" required={true} {...field} />
                    </Box>
                  )}
                />

                {/* <Box>
                  <Text>Foto de perfil</Text>
                  <Input type="file" />
                </Box> */}
              </Flex>
            </ModalBody>
            <ModalFooter gap={"15px"}>
              <Button
                onClick={() => {
                  onClose();
                  setEditingAulaID("");
                }}
              >
                Fechar
              </Button>
              <Button variant={"solid"} background={"green.200"} type="submit">
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </SidebarWithHeader>
  );
}
