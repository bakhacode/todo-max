import { useContext, useEffect, useState } from "react";
import { ColumnList } from "../components/ColumnList/ColumnList";
import { Header } from "../components/Header/Header";
import { colors } from "../constants/colors";
import { Alert } from "../components/Alert/Alert";
import { ModalContext } from "../contexts/ModalContext";
import { Dim } from "../components/Dim/Dim";
import { CardContext } from "../contexts/CardContext";

export function MainPage() {
  // const [mainPageData, setMainPageData] = useState<MainPageData>();
  const CardContextValue = useContext(CardContext);
  const { mainPageData, setMainPageData } = CardContextValue!;
  const modalContextValue = useContext(ModalContext);
  const { isAlertOpen, setIsAlertOpen } = modalContextValue!;

  const handleClickAlertCancelButton = () => {
    setIsAlertOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/index");
        const data = await response.json();
        setMainPageData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // width: "100vw",
        width: "1440px",
        // height: "100vh",
        height: "1024px",
        backgroundColor: colors.surfaceAlt,
        overflow: "hidden",
      }}>
      <Header />
      <ColumnList data={mainPageData} />
      {isAlertOpen ? <Dim /> : null}
      {isAlertOpen ? (
        <Alert
          onClickLeftButton={handleClickAlertCancelButton}
          leftButtonLabel="취소"
          rightButtonLabel="삭제"
        />
      ) : null}
    </div>
  );
}

export type Card = {
  id: number;
  title: string;
  contents: string;
};

export type Column = {
  id: number;
  name: string;
  cards: Card[];
};

export type MainPageData = Column[];
