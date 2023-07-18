import { useContext, useEffect, useRef, useState } from "react";
import { Card, Column } from "../../pages/MainPage";
import { DefaultCard } from "../Card/DefaultCard";
import { ColumnTitle } from "./ColumnTitle";
import { AddCard } from "../Card/AddCard";
import { ModalContext } from "../../contexts/ModalContext";
import { CardContext } from "../../contexts/CardContext";
import { CloneCard } from "../Card/CloneCard";
import { getUserDevice } from "../../utils/getUserDevice";

export function ColumnWrapper({ column }: { column: Column }) {
  const cardContextValue = useContext(CardContext);
  const {
    setColumnPositions,
    mainPageData,
    canAddCardToColumn,
    sharedDragRef,
    dragOverCardIdRef,
    sharedColumnId,
  } = cardContextValue!;
  const columnRef = useRef<HTMLDivElement>(null);
  const { setHistoryData } = useContext(ModalContext)!;
  const [isAddCard, setIsAddCard] = useState<boolean>(false);
  const [cardsList, setCardsList] = useState<Card[]>(column.cards); // column.cards
  const columnTitle = column.name;

  const columnFromMainPage = mainPageData![column.id - 1];

  const isRightColumnId = column.id === sharedColumnId;

  useEffect(() => {
    if (columnRef.current) {
      const rect = columnRef.current.getBoundingClientRect();
      setColumnPositions((prev) => ({
        ...prev,
        [column.id]: {
          columnId: column.id,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          topLeft: { x: rect.left, y: rect.top },
          topRight: { x: rect.right, y: rect.top },
          bottomLeft: { x: rect.left, y: rect.bottom },
          bottomRight: { x: rect.right, y: rect.bottom },
        },
      }));
    }
  }, [columnRef, setColumnPositions, column.id]);

  // const cardsCount = 10; // 두자리 수 모킹 값
  const showAddCard = () => {
    setIsAddCard(true);
  };

  const closeAddCard = () => {
    setIsAddCard(false);
  };

  const addNewCard = (inputTitle: string, inputContent: string) => {
    const newCard = {
      id: Date.now(),
      title: inputTitle,
      contents: inputContent,
    };

    const newHistory = {
      title: inputTitle,
      at: columnTitle,
      action: "생성",
    };

    setHistoryData((prevHistoryData) => [newHistory, ...prevHistoryData]);
    setCardsList((prevCardsList) => [newCard, ...prevCardsList]);
    closeAddCard();
  };

  const removeCard = (key: number, cardTitle: string) => {
    const filter = cardsList.filter((list) => list.id !== key);
    const newHistory = {
      title: cardTitle,
      at: columnTitle,
      action: "삭제",
    };

    setHistoryData((prevHistoryData) => [newHistory, ...prevHistoryData]);
    setCardsList(filter);
  };

  const updateEditCard = (
    inputTitle: string,
    inputContent: string,
    cardId: number
  ) => {
    setCardsList((prevCardsList) => {
      return prevCardsList.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            title: inputTitle,
            contents: inputContent,
          };
        }
        return card;
      });
    });
  };

  return (
    <div
      ref={columnRef}
      css={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "268px",
        gap: "8px",
        padding: "0 16px",
      }}>
      <ColumnTitle
        columnTitle={columnTitle}
        cardsCount={cardsList.length}
        showAddCard={showAddCard}
      />
      {isAddCard && (
        <AddCard closeAddCard={closeAddCard} addNewCard={addNewCard} />
      )}
      {cardsList.map((card) => (
        <DefaultCard
          key={card.id}
          id={card.id}
          columnId={columnFromMainPage.id}
          cardTitle={card.title}
          cardContent={card.contents}
          removeCard={removeCard}
          updateEditCard={updateEditCard}
        />
      ))}
      {canAddCardToColumn && isRightColumnId ? (
        // {isAddToColumn && column.id === dragOverCardIdRef.current.columnId ? (
        <CloneCard
          cloneType="to"
          cloneCardPosition={{ x: 0, y: 0 }}
          newCardTitle={sharedDragRef.current.cardTitle!}
          newCardContent={sharedDragRef.current.cardContent!}
          getUserDevice={getUserDevice()}
        />
      ) : null}
    </div>
  );
}
