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
  Avatar,
  Select,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { FaSearch, FaPlus, FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { AiOutlineSelect, AiOutlineDown } from "react-icons/ai";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import {
  adicionarAula,
  listarAulas,
  listarProfessores,
  updateAula,
} from "@/services/api";
import useAuth from "@/hooks/useAuth";

interface AulasGet {
  id: string;
  titulo: string;
  data: string;
  alunoId: string;
  professorId: string;
  status: string;
  aluno: {
    nome: string;
    avatarUrl: string;
    sobrenome: string;
    email: string;
    userId: string;
  };
}

interface AulasGetNormalized {
  id: string;
  titulo: string;
  data: string;
  alunoId: string;
  professorId: string;
  status: string;
  nomeAluno: string;
  avatarUrl: string;
  emailAluno: string;
}

interface AulasPost {
  id: string;
  titulo: string;
  data: string;
  alunoId: string;
  professorId: string;
  status: boolean;
}

interface ProfessorGet {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  userId: string;
  user: {
    avatarUrl: string;
    ativo: boolean;
  };
}

export default function Aulas() {
  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
    setValue,
    unregister,
  } = useForm<AulasPost>({
    defaultValues: {
      alunoId: "",
      titulo: "",
      professorId: "",
      data: "",
      status: true,
    },
  });

  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [loadingProfessores, setLoadingProfessores] = useState(false);
  const [aulas, setAulas] = useState<AulasGet[]>([]);
  const [professores, setProfessores] = useState<ProfessorGet[]>([]);
  const [professor, setProfessor] = useState<ProfessorGet>();
  const [professorSelected, setProfessorSelected] = useState<string>("");
  const toast = useToast();

  const [editingAulaID, setEditingAulaID] = useState("");

  const editingAula = useMemo(
    () => aulas.find((aula) => aula.id === editingAulaID),
    [aulas, editingAulaID]
  );

  const professorAula = useMemo(
    () => professores.find((prof) => prof.id === professorSelected),
    [professores, professorSelected]
  );

  useEffect(() => {
    buscarProfessores();
  }, []);

  useEffect(() => {
    if (professorSelected != "") {
      buscarAulas(professorSelected);
      var result = professores.filter((prof) => prof.id == professorSelected);
      setProfessor(result[0]);
    }
  }, [professorSelected]);

  useEffect(() => {
    if (editingAula) {
      setValue("alunoId", editingAula.alunoId);
      setValue("titulo", editingAula.titulo);
      setValue("professorId", editingAula.professorId);
      setValue("data", editingAula.data);
      unregister("status");
    } else {
      setValue("alunoId", "");
      setValue("titulo", "");
      setValue("professorId", "");
      setValue("data", "");
      setValue("status", false);
    }
  }, [editingAula, setValue]);

  async function buscarAulas(professorId: string) {
    setProfessorSelected(professorId);
    setLoading(true);
    listarAulas(professorSelected)
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

  async function buscarProfessores() {
    setLoadingProfessores(true);
    listarProfessores()
      .then((response) => {
        setLoadingProfessores(false);
        setProfessores(response.data);
      })
      .catch((error) => {
        if (!error.response) return;
        setLoading(false);
        toast({
          title: `Não foi possível listar os professores.`,
          status: "error",
          isClosable: true,
        });
      });
  }

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

  const handleOpenModal = () => {
    onOpen();
  };

  const handleUpdateAula: SubmitHandler<any> = (formData) => {
    setLoading(true);
    updateAula(formData)
      .then(() => {
        onClose();
        setEditingAulaID("");
        setLoading(false);
        toast({
          title: `Professor(a) editado com sucesso.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível editar professor(a).`,
          status: "error",
          isClosable: true,
        });
      });
  };

  return (
    <SidebarWithHeader>
      <Flex
        flexDir={"column"}
        gap={"20px"}
        backgroundColor={"gray.700"}
        color={"white"}
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
        <Flex gap={"20px"}>
          {!loadingProfessores ? (
            <Select
              onChange={(e) => {
                setProfessorSelected(e.target.value);
              }}
              border="none"
              bgColor="gray.600"
            >
              <option value="">Selecione o Professor</option>;
              {professores.map((item, index) => {
                return (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.nome} ${item.sobrenome}`}</option>
                );
              })}
            </Select>
          ) : (
            <Stack>
              <Skeleton height="40px" width={200} />
            </Stack>
          )}
          <InputGroup gap={"20px"}>
            <InputLeftElement pointerEvents="none" color={"gray.300"}>
              <FaSearch />
            </InputLeftElement>
            <Input
              type="tel"
              placeholder="Buscar aulas..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              border="none"
              bgColor="gray.600"
            />
            {user?.userType === "PROFESSOR" && (
              <Button
                leftIcon={<FaPlus />}
                colorScheme="blue"
                variant="solid"
                onClick={onOpen}
              >
                Novo
              </Button>
            )}
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
      ) : !aulas ? (
        <Flex
          width={"100%"}
          height={"60%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Flex>
            <AiOutlineSelect />
            <Text>Selecione um professor para buscar as aulas.</Text>
          </Flex>
        </Flex>
      ) : (
        <TableContainer
          backgroundColor="gray.700"
          borderRadius="10px"
          maxH={"70vh"}
          overflowY={"auto"}
        >
          <Table variant="unstyled" color="#DDD">
            <Thead
              position="sticky"
              top={0}
              zIndex="docked"
              bgColor={"gray.700"}
              borderBottom={"gray.300"}
            >
              <Tr>
                <Th color="#DDD">Título</Th>
                <Th color="#DDD">Data</Th>
                <Th color="#DDD">Aluno</Th>
                <Th color="#DDD">Professor</Th>
                <Th color="#DDD">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {aulas.length > 0 ? (
                aulas.map((item, index: number) => {
                  const aula: AulasGetNormalized = {
                    alunoId: item.alunoId,
                    avatarUrl: item.aluno.avatarUrl,
                    data: item.data,
                    emailAluno: item.aluno.email,
                    id: item.id,
                    nomeAluno: `${item.aluno.nome} ${item.aluno.sobrenome}`,
                    professorId: item.professorId,
                    status: item.status,
                    titulo: item.titulo,
                  };
                  // @ts-ignore
                  if (
                    Object.values(aula)
                      .map((variavel) => variavel)
                      .reduce((a, b) => (b = a + " " + b))
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                    return (
                      <Tr
                        key={index}
                        _hover={{ bgColor: "gray.600", cursor: "pointer" }}
                        borderColor="gray.700"
                        color="#DDD"
                        onClick={
                          ()=>{
                            setEditingAulaID(aula.id)
                            onOpen();
                          } 
                        }
                      >
                        <Td
                        >
                          {aula.titulo}
                        </Td>
                        <Td
                        >
                          {new Date(aula.data).toLocaleString("pt-br", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </Td>
                        <Td

                        >
                          <Flex gap={"10px"} alignItems={"center"}>
                            <Avatar
                              size="sm"
                              name={aula.nomeAluno}
                              src={aula.avatarUrl}
                            />
                            {aula.nomeAluno}
                          </Flex>
                        </Td>
                        <Td

                        >
                          {professor ? (
                            <Flex gap={"10px"} alignItems={"center"}>
                              <Avatar
                                size="sm"
                                name={professor?.nome}
                                src={professor.user.avatarUrl}
                              />
                              {`${professor.nome} ${professor.sobrenome}`}
                            </Flex>
                          ) : (
                            <Flex></Flex>
                          )}
                        </Td>
                        <Td
  
                        >
                          {aula.status === "CONCLUIDA" ? (
                            <Badge colorScheme="green">{aula.status}</Badge>
                          ) : (
                            <Badge colorScheme="orange">{aula.status}</Badge>
                          )}
                        </Td>
                      </Tr>
                    );
                })
              ) : (
                <Tr>
                  <Td>
                    <Flex
                      width={"100%"}
                      height={"60%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <AiOutlineSelect />
                      <Text>Nenhum resultado encontrado.</Text>
                    </Flex>
                  </Td>
                </Tr>
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
        <form
          onSubmit={handleSubmit(
            editingAulaID ? handleUpdateAula : handleAddAula
          )}
        >
          <ModalContent>
            <ModalHeader>{`${
              editingAula ? "Editar" : "Adicionar nova"
            } aula`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDir={"column"} gap={"15px"}>
                <Flex gap={"15px"}>
                  <Flex gap={"10px"} alignItems={"center"}>
                      <Avatar
                        size="sm"
                        name={professorAula?.nome}
                        src={professorAula?.user.avatarUrl}
                      />
                      {`${professorAula?.nome} ${professorAula?.sobrenome} | Professor`}
                    </Flex>
                  </Flex>
                  <Flex gap={"10px"} alignItems={"center"} marginBottom="20px">
                      <Avatar
                        size="sm"
                        name={editingAula?.aluno.nome}
                        src={editingAula?.aluno.avatarUrl}
                      />
                      {`${editingAula?.aluno.nome} ${editingAula?.aluno.sobrenome} | Aluno`}
                    </Flex>
                  </Flex>
                <Controller
                  name="titulo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Titulo</Text>
                      <Input placeholder="titulo" required={true} {...field} />
                    </Box>
                  )}
                />

                <Controller
                  name="data"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Data</Text>
                      <Input
                        placeholder="00/00/00"
                        required={true}
                        {...field}
                        type="date"
                      />
                    </Box>
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text>Status</Text>
                      <Select>
                        <option value={editingAula?.status} >{editingAula?.status}</option>
                        <option value="AGENDADA">AGENDADA</option>
                        <option value="PENDENTE">PENDENTE</option>
                        <option value="INICIADA">INICIADA</option>
                        <option value="CONCLUIDA">CONCLUIDA</option>
                        <option value="CANCELADA">CANCELADA</option>  
                      </Select>
                    </Box>
                  )}
                />

                {/* <Box>
                  <Text>Foto de perfil</Text>
                  <Input type="file" />
                </Box> */}
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
              <Button
                variant={"solid"}
                background={"#254C80"}
                color={"#FFF"}
                type="submit"
                _hover={{ bgColor: "#254D80" }}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </SidebarWithHeader>
  );
}
