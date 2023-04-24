import SidebarWithHeader from "@/components/NavBar";
import {
  listarAlunos,
  listarProfessores,
  adicionarProfessor,
  updateUser,
} from "@/services/api";
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Box,
  IconButton,
  Stack,
  Skeleton,
  useToast,
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
import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { client } from "@/services/client";

type ProfessorType = {
  nome: string;
  avatarUrl: string;
  sobrenome: string;
  cpf: string;
  email: string;
  ativo: true;
  id: string;
  senha: string;
};

export default function Alunos() {
  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<ProfessorType>({
    defaultValues: {
      nome: "",
      sobrenome: "",
      cpf: "",
      email: "",
      senha: "",
      ativo: true,
    },
  });

  const [search, setSearch] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [professores, setProfessores] = useState<ProfessorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfCPF, setEditingProfCPF] = useState("");
  const editingProf = useMemo(
    () => professores.find((professor) => professor.cpf === editingProfCPF),
    [professores, editingProfCPF]
  );

  async function buscarProfessores() {
    setLoading(true);
    listarProfessores()
      .then((response) => {
        setLoading(false);
        console.log(loading);
        setProfessores(response.data);
      })
      .catch((error) => {
        if (!error.response) return;
        setLoading(false);
        toast({
          title: `Não foi possível listar professores.`,
          status: "error",
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    buscarProfessores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editingProf) {
      setValue("nome", editingProf.nome);
      setValue("sobrenome", editingProf.sobrenome);
      setValue("cpf", editingProf.cpf);
      setValue("email", editingProf.email);
    } else {
      setValue("nome", "");
      setValue("sobrenome", "");
      setValue("cpf", "");
      setValue("email", "");
    }
  }, [editingProf, setValue]);

  const handleAddTeacher: SubmitHandler<any> = (formData) => {
    setLoading(true);
    adicionarProfessor(formData)
      .then(() => {
        onClose();
        setLoading(false);
        window.location.reload();
        toast({
          title: `Professor(a) adicionado com sucesso.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível adicionar professor(a).`,
          status: "error",
          isClosable: true,
        });
      });
  };

  const handleUpdateTeacher: SubmitHandler<any> = (formData) => {
    setLoading(true);
    updateUser(formData)
      .then(() => {
        onClose();
        setLoading(false);
        window.location.reload();
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

  const deleteUser = (id: string) => {
    setLoading(true);
    client
      .post(`/v1/user/${id}/inactivate`)
      .then(() => {
        setLoading(false);
        window.location.reload();
        toast({
          title: `Professor(a) desabilitado.`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error: any) => {
        if (!error.response) return;
        setLoading(false);
        toast({
          title: `Não foi possível desabilitar professor.`,
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
              <BreadcrumbLink href="">Professores</BreadcrumbLink>
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
              placeholder="Buscar Professores"
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
                <Th>Nome</Th>
                <Th>CPF</Th>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {professores.map((professor, index) => {
                // @ts-ignore
                if (
                  Object.values(professor)
                    .map((variavel) =>
                      typeof variavel === "boolean"
                        ? variavel
                          ? "ativo"
                          : "desabilitado"
                        : variavel
                    )
                    .reduce((a, b) => (b = a + " " + b))
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                  return (
                    <Tr key={index}>
                      <Td>
                        <Flex gap={"10px"} alignItems={"center"}>
                          <Avatar
                            size="sm"
                            name={professor.nome + " " + professor.sobrenome}
                            src={professor.avatarUrl}
                          />
                          {professor.nome + " " + professor.sobrenome}
                        </Flex>
                      </Td>
                      <Td>{professor.cpf}</Td>
                      <Td>{professor.email}</Td>
                      <Td>
                        {professor.ativo ? (
                          <Badge colorScheme="green">ATIVO</Badge>
                        ) : (
                          <Badge colorScheme="red">DESABILITADO</Badge>
                        )}
                      </Td>
                      <Td>
                        <Flex gap={"10px"}>
                          <IconButton
                            icon={<FaPencilAlt />}
                            colorScheme="yellow"
                            variant="solid"
                            aria-label=""
                            onClick={() => {
                              setEditingProfCPF(professor.cpf);
                              onOpen();
                            }}
                          />
                          <IconButton
                            icon={<FaTrashAlt />}
                            colorScheme="red"
                            variant="solid"
                            aria-label=""
                            onClick={() => deleteUser(professor.id)}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Modal
        onClose={() => {
          onClose();
          setEditingProfCPF("");
        }}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <form
          onSubmit={handleSubmit(
            editingProf ? handleUpdateTeacher : handleAddTeacher
          )}
        >
          <ModalContent>
            <ModalHeader>{`${
              editingProf ? "Editar" : "Adicionar novo"
            } professor`}</ModalHeader>
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
              </Flex>
            </ModalBody>
            <ModalFooter gap={"15px"}>
              <Button onClick={onClose}>Fechar</Button>
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
