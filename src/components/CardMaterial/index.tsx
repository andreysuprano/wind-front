import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Img,
  Flex,
  Center,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { BsArrowUpRight, BsHeartFill, BsHeart } from "react-icons/bs";
import { TbEdit } from "react-icons/tb";

export interface MaterialData {
  id: string;
  nome: string;
  descricao: string;
  driveUrl: string;
  thumbnail: string;
  onEdit: (id: string) => void;
}

export default function CardMaterial(material: MaterialData) {
  const handleEdit = (id: any) => {
    material.onEdit(id);
  };

  return (
    <Center py={6}>
      <Box
        w="250px"
        rounded={"sm"}
        my={5}
        mx={[0, 5]}
        overflow={"hidden"}
        bg="white"
        border={"1px"}
        borderColor="black"
        boxShadow={useColorModeValue("6px 6px 0 black", "6px 6px 0 cyan")}
      >
        <Box h={"150px"} borderBottom={"1px"} borderColor="black">
          <Img
            src={material.thumbnail}
            roundedTop={"sm"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </Box>
        <Box p={4}>
          <Box
            bg="black"
            display={"inline-block"}
            px={2}
            py={1}
            color="white"
            mb={2}
          >
            {/* <Text fontSize={'xs'} fontWeight="medium">
							React
						</Text> */}
          </Box>
          <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
            {material.nome}
          </Heading>
          <Text color={"gray.500"} noOfLines={2}>
            {material.descricao}
          </Text>
        </Box>
        <HStack borderTop={"1px"} color="black">
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            cursor={"pointer"}
            w="full"
          >
            <Text fontSize={"md"} fontWeight={"semibold"}>
              Abrir
            </Text>
            <BsArrowUpRight />
          </Flex>
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            borderLeft={"1px"}
            cursor="pointer"
          >
            <TbEdit fontSize={"24px"} onClick={() => material.onEdit} />
          </Flex>
        </HStack>
      </Box>
    </Center>
  );
}
