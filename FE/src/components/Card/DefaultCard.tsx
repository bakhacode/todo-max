import { colors } from "../../constants/colors";
import { IconButton } from "../Button/IconButton";
import { Txt } from "../Txt";
import { getUserDevice } from "../../utils/getUserDevice";
import { shadow } from "../../constants/shadow";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../Button/Button";
import { CloneCard } from "./CloneCard";
import { CardContext } from "../../contexts/CardContext";

export function DefaultCard({
  id,
  columnId,
  cardTitle,
  cardContent,
  removeCard,
  updateEditCard,
}: {
  id: number;
  columnId: number;
  cardTitle: string;
  cardContent: string;
  removeCard(key: number, cardTitle: string): void;
  updateEditCard(
    inputTitle: string,
    inputContent: string,
    cardId: number
  ): void;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newCardTitle, setNewCardTitle] = useState<string>(cardTitle);
  const [newCardContent, setNewCardContent] = useState<string>(cardContent);

  //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 드래그 관려느ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
  const cardContextValue = useContext(CardContext);
  const {
    isDragging,
    setIsDragging,
    // sharedDragCardPosition,
    // setSharedDragCardPosition,
    sharedDragRef,
    // cardsRefs,
    // cardsPosition,
    cardPositions,
    setCardPositions,
    columnPositions,
    // setColumnPositions,
    dragOverCardIdRef,
    setCanAddCardToColumn,
    setSharedColumnId,
    isOverHalf,
    setIsOverHalf,
    sharedCardId,
    setSharedCardId,
    canAddCardToCard,
    setCanAddCardToCard,
    mainPageData,
    dragCardPosition,
    setDragCardPosition,
    currentDragCard,
    setCurrentDragCard,
    //ㅡㅡㅡㅡㅡ 현재 드래그로 덮어진 카드
    currentDragOverCardRef,
    //ㅡㅡㅡㅡㅡㅡ
    isCardOverRef,
    isColumnOverRef,
    setIsColumnOver,
    isCardOver,
    setIsCardOver,
    draggingColumnRef,
    sharedColumnRect,
  } = cardContextValue!;

  const isDragStart = useRef<boolean>(false);
  // const [showCloneCard, setShowCloneCard] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef({ x: 0, y: 0 });

  const [cloneCardPosition, setCloneCardPosition] = useState({
    x: 0,
    y: 0,
  });
  const isDragOverCard = useRef<boolean>(false);
  const absolutePosition = useRef({ x: 0, y: 0 });

  const isDragCard = currentDragCard.cardId === id;

  const cardRect = cardRef.current?.getBoundingClientRect();

  if (cardRect) {
    const isInside =
      dragCardPosition.cardMiddleX >= cardRect!.left &&
      dragCardPosition.cardMiddleX <= cardRect!.right &&
      dragCardPosition.cardMiddleY >= cardRect!.top &&
      dragCardPosition.cardMiddleY <= cardRect!.bottom;

    const isAbove =
      dragCardPosition.cardTop + cardRect.height / 2 <
      cardRect.y + cardRect.height / 2;
    const position = isAbove ? "above" : "below";

    // if (isInside && currentDragOverCardRef.current.cardId === id) {
    //   console.log("같은카드");
    //   setIsOverHalf(false);
    // }
    if (
      isInside &&
      !isDragCard &&
      currentDragOverCardRef.current.position !== position
    ) {
      isDragOverCard.current = true;

      currentDragOverCardRef.current.cardId = id;
      currentDragOverCardRef.current.position = position;
      setIsCardOver(true);
      setIsColumnOver(false);
      setIsOverHalf(true);

      console.log(id, "로", position, "으로", "들어왓어");
    }
  }
  // useEffect(() => {
  //   if (dragCard.current) {
  //     const rect = dragCard.current.getBoundingClientRect();
  //     setCardPositions((prev) => ({
  //       ...prev,
  //       [id]: {
  //         cardId: id,
  //         columnId: columnId,
  //         x: rect.x,
  //         y: rect.y,
  //         width: rect.width,
  //         height: rect.height,
  //         topLeft: { x: rect.left, y: rect.top },
  //         topRight: { x: rect.right, y: rect.top },
  //         bottomLeft: { x: rect.left, y: rect.bottom },
  //         bottomRight: { x: rect.right, y: rect.bottom },
  //       },
  //     }));
  //   }
  // }, [id, dragCard, setCardPositions, columnId]);

  // const isInsideAnyColumn = useRef<boolean>(false);
  // const isInsideAnyCard = useRef<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // console.log(sharedColumnRect.current);
    console.log(sharedColumnRect.current[columnId].x);
    isDragStart.current = true;

    const dragCardRect = cardRef.current?.getBoundingClientRect();
    dragStartPosition.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setCloneCardPosition({
      x: dragCardRect!.x,
      y: dragCardRect!.y,
    });

    setCurrentDragCard({
      cardId: id,
      columnId: columnId,
    });

    absolutePosition.current = {
      x: dragCardRect!.x - sharedColumnRect.current[columnId].x,
      y: dragCardRect!.y - sharedColumnRect.current[columnId].y,
    };

    // 칼럼포지션 없어서 공유시키거나 해야함

    sharedDragRef.current = {
      cardId: id,
      columnId: columnId,
      cardContent: cardContent,
      cardTitle: cardTitle,
      position: "",
    };
    // dragOverCardIdRef.current = {
    //   cardTitle: cardTitle,
    //   cardContent: cardContent,
    //   columnId: columnId,
    //   cardId: id,
    //   position: "",
    // };
    // setIsDragging(true);
    // setShowCloneCard(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    if (isDragStart.current) {
      const moveX = e.clientX - dragStartPosition.current.x;
      const moveY = e.clientY - dragStartPosition.current.y;

      const dragCardRect = cardRef.current!.getBoundingClientRect();

      // const cardTop = dragCardRect.y;

      // const cardMiddleX = dragCardRect.x + dragCardRect.width / 2;
      // const cardMiddleY = dragCardRect.y + dragCardRect.height / 2;

      setDragCardPosition({
        x: moveX,
        y: moveY,
        cardMiddleX: dragCardRect.x + dragCardRect.width / 2,
        cardMiddleY: dragCardRect.y + dragCardRect.height / 2,
        cardTop: dragCardRect.y,
      });

      //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ칼럼ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      // for (let columnId in columnPositions) {
      //   const column = columnPositions[columnId];

      //   const columnTopLeft = column.topLeft;
      //   const columnTopRight = column.topRight;
      //   const columnBottomLeft = column.bottomLeft;

      //   const columnInside =
      //     cardMiddleX >= columnTopLeft.x &&
      //     cardMiddleX <= columnTopRight.x &&
      //     cardMiddleY >= columnTopLeft.y &&
      //     cardMiddleY <= columnBottomLeft.y;
      //   // console.log(sharedDragRef.current.columnId, Number(columnId));
      //   // if (columnInside && sharedDragRef.current.columnId === Number(columnId))
      //   //   break;
      //   if (columnInside) {
      //     // if (dragOverCardIdRef.current.columnId === Number(columnId)) break;
      //     if (sharedDragRef.current.columnId === Number(columnId)) {
      //       setSharedColumnId(0);
      //       setCanAddCardToColumn(false);
      //       setIsOverHalf(false);
      //       // return;
      //     }
      //     console.log(`Column ${columnId}에 들어갔습니다.`);
      //     setSharedColumnId(Number(columnId));
      //     setCanAddCardToColumn(true);
      //     setCanAddCardToCard(false);
      //     setIsOverHalf(true);
      //     isInsideAnyColumn.current = true;
      //     dragOverCardIdRef.current = {
      //       columnId: Number(columnId),
      //       cardId: -1,
      //       position: "",
      //       cardTitle: cardTitle,
      //       cardContent: cardContent,
      //     };
      //   }
      // }
      // //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ카드ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      // for (let cardId in cardPositions) {
      //   const card = cardPositions[cardId];

      //   const isInside =
      //     cardMiddleX >= card.topLeft.x &&
      //     cardMiddleX <= card.topRight.x &&
      //     cardMiddleY >= card.topLeft.y &&
      //     cardMiddleY <= card.bottomLeft.y;

      //   // if (isInside && sharedDragRef.current.cardId === Number(cardId)) break;
      //   if (isInside) {
      //     const isAbove = cardTop + card.height / 2 < card.y + card.height / 2;
      //     const position = isAbove ? "above" : "below";

      //     //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ사용할지말지 고민중
      //     console.log(mainPageData![Number(card.columnId) - 1].cards);
      //     const dragStartColumnCards =
      //       mainPageData![sharedDragRef.current.columnId - 1].cards;
      //     console.log("드래그시작한칼럼카드배열", dragStartColumnCards.length);
      //     const dragStartCardIndex = dragStartColumnCards.findIndex(
      //       (card) => card.id === sharedDragRef.current.cardId
      //     );
      //     console.log("드래그카드배열인덱스", dragStartCardIndex);
      //     const dragStartCardPrev =
      //       dragStartColumnCards[dragStartCardIndex - 1]?.id;
      //     const dragStartCardNext =
      //       dragStartColumnCards[dragStartCardIndex + 1]?.id;
      //     console.log(dragStartCardPrev);
      //     console.log(dragStartCardNext);

      //     const columnCardsList =
      //       mainPageData![Number(card.columnId) - 1].cards;

      //     const lastCard = columnCardsList[columnCardsList.length - 1];
      //     console.log(lastCard);

      //     if (Number(cardId) === lastCard.id && position === "below") {
      //       console.log("마지막카드");
      //       // break;
      //     }

      // if (Number(cardId) === dragStartCardPrev && position === "below") {
      //   console.log("전카드 겹침");
      //   break;
      // }
      // if (Number(cardId) === dragStartCardNext && position === "above") {
      //   console.log("다음카드 겹침");
      //   break;
      // }

      // if (sharedDragRef.current.cardId === Number(cardId)) {
      //   console.log("자기카드");
      //   setSharedCardId({
      //     cardId: 0,
      //     position: "",
      //   });
      //   setCanAddCardToColumn(false);
      //   setCanAddCardToCard(false);
      //   setIsOverHalf(false);
      //   // return;
      //   continue;
      // }
      //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 예외처리 살릴지 고민중

      //       console.log(
      //         `Card ${cardId}에 들어갔습니다. 칼럼은 ${card.columnId} Position: ${
      //           isAbove ? "Above" : "Below"
      //         }`
      //       );

      //       setSharedCardId({
      //         cardId: Number(cardId),
      //         position: position,
      //       });
      //       setCanAddCardToCard(true);
      //       setCanAddCardToColumn(false);
      //       setIsOverHalf(true);
      //       dragOverCardIdRef.current = {
      //         columnId: card.columnId,
      //         cardId: Number(cardId),
      //         position: position,
      //         cardTitle: cardTitle,
      //         cardContent: cardContent,
      //       };

      //       isInsideAnyCard.current = true;
      //       break;
      //     }
      //   }

      //   if (!isInsideAnyColumn.current) {
      //     console.log("안들어갔을때");
      //     isInsideAnyColumn.current = false;
      //   }

      //   if (isDragging && !isInsideAnyColumn.current) {
      //     console.log("안들어감");
      //   }
      // }
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    isDragStart.current = false;
    isDragOverCard.current = false;
    currentDragOverCardRef.current.cardId = 0;
    isCardOverRef.current = false;
    // isColumnOverRef.current = false;
    setIsColumnOver(false);

    sharedDragRef.current.cardId = 0;
    setSharedCardId({
      cardId: 0,
      position: "",
    });
    setDragCardPosition({
      x: 0,
      y: 0,
      cardMiddleX: 0,
      cardMiddleY: 0,
      cardTop: 0,
    });
    isDragStart.current = false;

    setIsOverHalf(false);

    setCurrentDragCard({
      cardId: 0,
      columnId: 0,
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

  const handleRemoveCard = () => {
    removeCard(id, cardTitle);
  };

  const editCard = () => {
    setNewCardTitle(cardTitle);
    setNewCardContent(cardContent);
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCardTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCardContent(e.target.value);
  };

  const cancelEditCard = () => {
    setNewCardTitle(cardTitle);
    setNewCardContent(cardContent);
    setIsEditing(false);
  };

  const saveEditCard = () => {
    updateEditCard(newCardTitle, newCardContent, id);
    setIsEditing(false);
  };

  const isButtonDisabled =
    newCardTitle.trim() === "" || newCardContent.trim() === "";

  return (
    <>
      {currentDragOverCardRef.current.cardId === id &&
      currentDragOverCardRef.current.position === "above" &&
      isCardOver ? (
        <CloneCard
          cloneType="to"
          cloneCardPosition={{
            x: 0,
            y: 0,
          }}
          newCardTitle={sharedDragRef.current.cardTitle!}
          newCardContent={sharedDragRef.current.cardContent!}
          getUserDevice={getUserDevice()}
        />
      ) : null}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        css={{
          position: isDragCard
            ? isOverHalf
              ? "absolute"
              : "relative"
            : "relative",

          left: isDragCard
            ? isOverHalf
              ? dragCardPosition.x + absolutePosition.current.x
              : dragCardPosition.x
            : 0,

          top: isDragCard
            ? isOverHalf
              ? dragCardPosition.y + absolutePosition.current.y
              : dragCardPosition.y
            : 0,

          display: "flex",
          flexDirection: "column",
          width: "268px",
          padding: "16px",
          gap: "16px",
          backgroundColor: colors.surfaceDefault,
          borderRadius: "8px",
          boxShadow: shadow.normal,
          opacity: isDragCard ? "0.9" : "1",
          zIndex: isDragCard ? 100 : 0,
        }}>
        <div
          css={{
            display: "flex",
            gap: "4px",
          }}>
          {!isEditing && (
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
                gap: "16px",
              }}>
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                <div>
                  <Txt typography="displayBold14" color={colors.textStrong}>
                    {newCardTitle}
                  </Txt>
                </div>
                <div>
                  <Txt typography="displayMedium14" color={colors.textDefault}>
                    {newCardContent}
                  </Txt>
                </div>
              </div>
              <div>
                <Txt typography="displayMedium12" color={colors.textWeak}>
                  {`author by ${getUserDevice()}`}
                </Txt>
              </div>
            </div>
          )}
          {isEditing && (
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                width: "240px",
                gap: "16px",
              }}>
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                <div>
                  <input
                    css={{
                      "width": "100%",
                      "border": "none",
                      "fontSize": "14px",
                      "fontWeight": 700,
                      "color": colors.textStrong,
                      "::placeholder": {
                        color: colors.textStrong,
                      },
                      ":focus": {
                        outline: 0,
                      },
                    }}
                    placeholder="제목을 입력해주세요"
                    type="text"
                    value={newCardTitle}
                    onChange={handleTitleChange}
                  />
                </div>
                <div>
                  <input
                    css={{
                      "width": "100%",
                      "border": "none",
                      "fontSize": "14px",
                      "fontWeight": 500,
                      "color": colors.textDefault,
                      "::placeholder": {
                        color: colors.textDefault,
                      },
                      ":focus": {
                        outline: 0,
                      },
                      "whiteSpace": "pre-wrap",
                    }}
                    placeholder="내용을 입력해주세요"
                    type="text"
                    value={newCardContent}
                    onChange={handleContentChange}
                  />
                </div>
              </div>
              <div
                css={{
                  display: "flex",
                  width: "272px",
                  gap: "8px",
                }}>
                <Button
                  text="취소"
                  width="132px"
                  height="32px"
                  color={`${colors.textDefault}`}
                  backgroundColor={`${colors.surfaceAlt}`}
                  onClick={cancelEditCard}
                />
                <Button
                  text="저장"
                  width="132px"
                  height="32px"
                  color={`${colors.textWhiteDefault}`}
                  backgroundColor={`${colors.surfaceBrand}`}
                  disabled={isButtonDisabled}
                  onClick={saveEditCard}
                />
              </div>
            </div>
          )}
          {!isEditing && (
            <div>
              <IconButton
                type="close"
                width="24px"
                height="24px"
                color={colors.textWeak}
                onClick={handleRemoveCard}
              />
              <IconButton
                type="edit"
                width="24px"
                height="24px"
                color={colors.textWeak}
                onClick={editCard}
              />
            </div>
          )}
        </div>
      </div>
      {currentDragOverCardRef.current.cardId === id &&
      currentDragOverCardRef.current.position === "below" &&
      isCardOver ? (
        <CloneCard
          cloneType="to"
          cloneCardPosition={{
            x: 0,
            y: 0,
          }}
          newCardTitle={sharedDragRef.current.cardTitle!}
          newCardContent={sharedDragRef.current.cardContent!}
          getUserDevice={getUserDevice()}
        />
      ) : null}
      {isDragCard ? (
        isOverHalf ? null : (
          <CloneCard
            cloneType="from"
            cloneCardPosition={{
              x: cloneCardPosition.x,
              y: cloneCardPosition.y,
            }}
            newCardTitle={newCardTitle}
            newCardContent={newCardContent}
            getUserDevice={getUserDevice()}
            isOverHalf={isOverHalf}
          />
        )
      ) : null}
    </>
  );
}
