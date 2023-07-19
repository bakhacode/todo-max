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
    currentDragOverCardRef,
    dragCardPosition,
    currentDragCard,
    isOverHalf,
    setIsOverHalf,
    currentDragOverColumnRef,
    isCardOverRef,
    isColumnOverRef,
    isColumnOver,
    setIsColumnOver,
    isCardOver,
    setIsCardOver,
    draggingColumnRef,
    sharedColumnRect,
  } = cardContextValue!;
  // const columnRef = useRef<HTMLDivElement>(null);
  const { setHistoryData } = useContext(ModalContext)!;
  const [isAddCard, setIsAddCard] = useState<boolean>(false);
  const [cardsList, setCardsList] = useState<Card[]>(column.cards); // column.cards
  const columnTitle = column.name;

  const columnFromMainPage = mainPageData![column.id - 1];

  const columnRef = useRef<HTMLDivElement>(null);

  const isDragCardColumn = currentDragCard.cardId === column.id;

  const isDragOverColumn = useRef<boolean>(false);

  const columnRect = columnRef.current?.getBoundingClientRect();

  const isNotSameColumn = draggingColumnRef.current !== column.id;

  if (columnRect) {
    sharedColumnRect.current = {
      ...sharedColumnRect.current,
      [column.id]: columnRect,
    };
  }

  // console.log(draggingColumnRef.current, column.id);
  if (columnRect) {
    const isInside =
      dragCardPosition.cardMiddleX >= columnRect!.left &&
      dragCardPosition.cardMiddleX <= columnRect!.right &&
      dragCardPosition.cardMiddleY >= columnRect!.top &&
      dragCardPosition.cardMiddleY <= columnRect!.bottom;

    // if (isInside && currentDragOverColumnRef.current === column.id) {
    //   setIsOverHalf(false);
    //   console.log("자기 칼럼");
    // }

    if (isInside && currentDragOverColumnRef.current !== column.id) {
      currentDragOverColumnRef.current = column.id;

      // if (isInside && currentDragCard.columnId !== column.id) {
      isDragOverColumn.current = true;
      currentDragOverColumnRef.current = column.id;
      setIsColumnOver(true);
      setIsCardOver(false);
      setIsOverHalf(true);
      console.log("칼럼", column.id, "로", "들어왓어");
      draggingColumnRef.current = column.id;
      // }
    }
  }

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
      {/* {isDragOverColumn.current && */}
      {/* currentDragOverColumnRef.current === column.id && */}
      {isColumnOver &&
      currentDragOverColumnRef.current === column.id &&
      currentDragCard.columnId !== column.id ? (
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
