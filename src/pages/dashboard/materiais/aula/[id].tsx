import { buscarMaterialPorId } from "@/services/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import styles from "@/styles/general.module.css";
import { buscarAulaPorID } from "@/services/api";

export default function MateriaisId() {
  const toast = useToast();
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [materialURL, setMaterialURL] = useState<string>('');
  const [countdown, setCountdown] = useState(3600);

  const router = useRouter();
  const { id } = router.query;

  const buscarAula = async () => {
    setLoading(true);
    await buscarAulaPorID(location.pathname.split('/')[4])
      .then((aula) => {
        buscarMaterialPorId(aula.data.materialId).then((material)=>{
          console.log(material.data);
          setMaterialURL(material.data.driveUrl);
        });
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível buscar a aula`,
          status: "error",
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    console.log(location.pathname);

    buscarAula();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countdown < 0) {
        setCountdown(0);
        setDenied(true);
      } else {
        setCountdown((countdown) => countdown - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      const keys = [91,16, 17,18];
      if(keys.includes(event.keyCode)|| event.keyCode === 91){
        setDenied(true);
      }
    });

    window.addEventListener('mouseleave', function() {
      setDenied(true);
    });

    window.addEventListener('blur', function() {
      setDenied(true);
    });

  }, []);

  useEffect(() => {
    if (id) {
      buscarMaterialPorId(id[0]);
    }
  }, []);

  return (
    <div className={styles.wrap}>
        <Flex 
          position="absolute" 
          height="100vh" 
          width="100vw"
          flexDir="column" 
          alignItems="center" 
          justifyContent="center"
          background="#112233"
          opacity="0.95"
          backdropFilter="blur(10px)"
          visibility={!denied ? "hidden": "visible"}
          zIndex={999}
        >
            <h1 className={styles.message}>Cuidado!</h1>
            <h5 className={styles.subMessage}>
              Não utilize este material de forma inapropriada ou sem consentimento
              da coordenação da Windfall.
            </h5>
            <Text color="white" marginBottom="20px" fontSize="12px">
             Conteúdo protegido por direitos autorais.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => {
                setDenied(false);
              }}
            >
              VOLTAR
            </Button>
        </Flex>   
        <>
          <div className={styles["big-div"]}>
            <div className={styles.buttons}>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                gap={"50px"}
                bgColor={"gray.800"}
                width={"1000px"}
                padding="8px"
              >
                <Text fontWeight={900} color={"white"}>
                  {/* 00:{Math.round(counter / 1000)} */}
                  {countdown === 0
                    ? "Acabou o tempo"
                    : `${hours.toString().padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}:${seconds
                        .toString()
                        .padStart(2, "0")}`}
                </Text>
                <Text fontWeight={900} color={"white"}>
                  Aluno do Joberval
                </Text>
                {/* <Button
                  aria-label="Toggle Color Mode"
                  onClick={goToPrevPage}
                  _focus={{ boxShadow: "none" }}
                  w="fit-content"
                  color={"white"}
                  height="30px"
                >
                  <FaBackward color={"black"} />
                </Button>
                <Button
                  aria-label="Toggle Color Mode"
                  onClick={goToNextPage}
                  _focus={{ boxShadow: "none" }}
                  w="fit-content"
                  color={"white"}
                  height="30px"
                >
                  <TbPlayerTrackNextFilled color={"black"} />
                </Button> */}
              </Flex>
            </div>
            {/* <div className={styles["wrap-contentMaterial"]}> */}
            <div style={{ width: "100%", height: "100vh" }}>
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                  <iframe src={materialURL+"#toolbar=0"} width="100%" height="600" ></iframe>
              </div>
            </div>
          </div>
          {/* </div> */}
        </>
    </div>
  );
}
