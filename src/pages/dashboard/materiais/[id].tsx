import SidebarWithHeader from "@/components/SideBar";
import { buscarMaterialPorId } from "@/services/api";
import { useRouter } from "next/router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
//@ts-ignore
import useKeypress from "react-use-keypress";
import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "@/styles/general.module.css";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function MateriaisId() {
  const toast = useToast();
  const [denied, setDenied] = useState(false);
  const [numPages, setNumPages] = useState<any>();
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [materialURL, setMaterialURL] = useState<any[]>([]);

  const [countdown, setCountdown] = useState(3600);

  const router = useRouter();
  const { id } = router.query;

  const buscarAulaporID = async () => {
    setLoading(true);
    await buscarMaterialPorId(id + "")
      .then((response) => {
        console.log(response);
        setLoading(false);
        setMaterialURL(response.data.driveUrl);
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) return;
        toast({
          title: `Não foi possível buscar o material.`,
          status: "error",
          isClosable: true,
        });
      });
  };

  useLayoutEffect(() => {
    console.log(id);

    buscarAulaporID();
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

  function onDocumentLoadSuccess(numPages: any) {
    setNumPages(numPages);
    setDenied(false);
  }

  useKeypress(["Control", "Shift", "Alt", "91"], () => {
    setDenied(true);
    toast({
      title: `Informação de conteúdo privado!`,
      status: "warning",
      isClosable: true,
    });
  });

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      console.log(
        `Key: ${event.key} with keycode ${event.keyCode} has been pressed`
      );
    });
  }, []);

  useEffect(() => {
    if (id) {
      buscarMaterialPorId(id[0]);
    }
    console.log(pageNumber);
  }, [pageNumber]);

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  return (
    <div className={styles.wrap}>
      {denied ? (
        <div className={styles.wrapdenied}>
          <Button
            colorScheme="orange"
            onClick={() => {
              setDenied(false);
            }}
          >
            VOLTAR
          </Button>
          <h1 className={styles.message}>Conteúdo privado!!!</h1>
          <h5 className={styles.subMessage}>
            Não divulgue ou utilize de forma inapropriada ou sem consentimento
            pelos criadores do mesmo.
          </h5>
        </div>
      ) : (
        <>
          <div className={styles["big-div"]}>
            <div className={styles.buttons}>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                gap={"50px"}
                bgColor={"gray.800"}
                padding={"10px"}
                borderRadius={"10px"}
                width={"1000px"}
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
                <Button
                  aria-label="Toggle Color Mode"
                  onClick={goToPrevPage}
                  _focus={{ boxShadow: "none" }}
                  w="fit-content"
                  color={"white"}
                >
                  <FaBackward color={"black"} />
                </Button>
                <Button
                  aria-label="Toggle Color Mode"
                  onClick={goToNextPage}
                  _focus={{ boxShadow: "none" }}
                  w="fit-content"
                  color={"white"}
                >
                  <TbPlayerTrackNextFilled color={"black"} />
                </Button>
              </Flex>
            </div>
            {/* <div className={styles["wrap-contentMaterial"]}> */}
            <div style={{ width: "100%", height: "100vh" }}>
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                {loading ? (
                  <>
                    <h1>Carregando...</h1>
                  </>
                ) : (
                  <Document
                    file={materialURL}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className={styles.pdf}
                  >
                    <div onContextMenu={(e: any) => e.preventDefault()}>
                      <Page pageNumber={pageNumber} />
                    </div>
                  </Document>
                )}
              </div>
            </div>
          </div>
          {/* </div> */}
        </>
      )}
    </div>
  );
}
