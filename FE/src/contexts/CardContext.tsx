import { createContext, useState, ReactNode, useRef } from "react";
import { MainPageData } from "../pages/MainPage";

type CardContextType = {
  mainPageData: MainPageData | undefined;
  setMainPageData: React.Dispatch<
    React.SetStateAction<MainPageData | undefined>
  >;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  sharedDragRef: React.MutableRefObject<{
    columnId: number;
    cardId: number;
    position: string;

    cardTitle?: string;
    cardContent?: string;
  }>;
  sharedDragCardPosition: {
    x: number;
    y: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  setSharedDragCardPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
    }>
  >;
  cardsRefs: React.MutableRefObject<{
    [key: string]: React.RefObject<HTMLElement>;
  }>;
  cardsPosition: {
    [id: number]: CardPosition;
  };
  setCardsPosition: React.Dispatch<
    React.SetStateAction<{
      [id: number]: CardPosition;
    }>
  >;
  dragOverCardIdRef: React.MutableRefObject<DragCardRef>;
  columnPositions: {
    [id: number]: ColumnPosition;
  };
  setColumnPositions: React.Dispatch<
    React.SetStateAction<{
      [id: number]: ColumnPosition;
    }>
  >;
  cardPositions: {
    [id: number]: CardPosition;
  };
  setCardPositions: React.Dispatch<
    React.SetStateAction<{
      [id: number]: CardPosition;
    }>
  >;
  canAddCardToColumn: boolean;
  setCanAddCardToColumn: React.Dispatch<React.SetStateAction<boolean>>;
  sharedColumnId: number;
  setSharedColumnId: React.Dispatch<React.SetStateAction<number>>;
  isOverHalf: boolean;
  setIsOverHalf: React.Dispatch<React.SetStateAction<boolean>>;
  sharedCardId: {
    cardId: number;
    position: string;
  };
  setSharedCardId: React.Dispatch<
    React.SetStateAction<{ cardId: number; position: string }>
  >;
  canAddCardToCard: boolean;
  setCanAddCardToCard: React.Dispatch<React.SetStateAction<boolean>>;
  dragCardPosition: {
    x: number;
    y: number;
    cardMiddleX: number;
    cardMiddleY: number;
    cardTop: number;
  };
  setDragCardPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      cardMiddleX: number;
      cardMiddleY: number;
      cardTop: number;
    }>
  >;
  currentDragCard: {
    cardId: number;
    columnId: number;
  };
  setCurrentDragCard: React.Dispatch<
    React.SetStateAction<{
      cardId: number;
      columnId: number;
    }>
  >;
  currentDragOverCardRef: React.MutableRefObject<{
    cardId: number;
    position: string;
  }>;
  currentDragOverColumnRef: React.MutableRefObject<number>;
  isCardOverRef: React.MutableRefObject<boolean>;
  isColumnOverRef: React.MutableRefObject<boolean>;
  isColumnOver: boolean;
  setIsColumnOver: React.Dispatch<React.SetStateAction<boolean>>;
  isCardOver: boolean;
  setIsCardOver: React.Dispatch<React.SetStateAction<boolean>>;
  draggingColumnRef: React.MutableRefObject<number>;
  sharedColumnRect: React.MutableRefObject<{ [columnId: number]: DOMRect }>;
};

export type Position = {
  x: number;
  y: number;
};

export type ColumnPosition = {
  columnId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  topLeft: Position;
  topRight: Position;
  bottomLeft: Position;
  bottomRight: Position;
};

export type CardPosition = {
  cardId: number;
  columnId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  topLeft: Position;
  topRight: Position;
  bottomLeft: Position;
  bottomRight: Position;
};

type CardProviderProps = {
  children: ReactNode;
};
type DragCardRef = {
  columnId: number;
  cardId: number;
  position: string;

  cardTitle?: string;
  cardContent?: string;
  dragCardId?: number;
};
export const CardContext = createContext<CardContextType | undefined>(
  undefined
);

export function CardProvider({ children }: CardProviderProps) {
  const [mainPageData, setMainPageData] = useState<MainPageData>();
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [sharedDragCardPosition, setSharedDragCardPosition] = useState({
    x: 0,
    y: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const sharedDragRef = useRef({
    columnId: 0,
    cardId: 0,
    position: "",
    cardTitle: "",
    cardContent: "",
  });

  //아래의 cardsRefs는 HTMLDivElement들이 담긴 객체  배열이아닌 속성
  const cardsRefs = useRef<{ [key: string]: React.RefObject<HTMLElement> }>({});
  const [cardsPosition, setCardsPosition] = useState<{
    [id: number]: CardPosition;
  }>({});

  const [cardPositions, setCardPositions] = useState<{
    [id: number]: CardPosition;
  }>({});

  const [columnPositions, setColumnPositions] = useState<{
    [id: number]: ColumnPosition;
  }>({});

  const dragOverCardIdRef = useRef<DragCardRef>({
    columnId: 0,
    cardId: 0,
    position: "",

    cardTitle: "",
    cardContent: "",
    dragCardId: -1,
  });

  const [canAddCardToColumn, setCanAddCardToColumn] = useState(false);
  const [canAddCardToCard, setCanAddCardToCard] = useState(false);

  const [sharedColumnId, setSharedColumnId] = useState<number>(0);
  const [sharedCardId, setSharedCardId] = useState({
    cardId: 0,
    position: "",
  });

  const [isOverHalf, setIsOverHalf] = useState<boolean>(false);

  const [dragCardPosition, setDragCardPosition] = useState({
    x: 0,
    y: 0,
    cardMiddleX: 0,
    cardMiddleY: 0,
    cardTop: 0,
  });

  const [currentDragCard, setCurrentDragCard] = useState({
    cardId: 0,
    columnId: 0,
  });
  const currentDragOverCardRef = useRef({
    cardId: 0,
    position: "",
  });

  const currentDragOverColumnRef = useRef(0);

  const isCardOverRef = useRef(false);
  const [isCardOver, setIsCardOver] = useState(false);
  const isColumnOverRef = useRef(false);
  const [isColumnOver, setIsColumnOver] = useState(false);
  const draggingColumnRef = useRef(0);

  const sharedColumnRect = useRef<{ [columnId: number]: DOMRect }>({});

  const value: CardContextType = {
    isCardOver,
    setIsCardOver,
    isColumnOver,
    setIsColumnOver,
    mainPageData,
    setMainPageData,
    isDragging,
    setIsDragging,
    sharedDragRef,
    sharedDragCardPosition,
    setSharedDragCardPosition,
    cardsRefs,
    cardsPosition,
    setCardsPosition,
    dragOverCardIdRef,
    columnPositions,
    setColumnPositions,
    cardPositions,
    setCardPositions,
    canAddCardToColumn,
    setCanAddCardToColumn,
    sharedColumnId,
    setSharedColumnId,
    isOverHalf,
    setIsOverHalf,
    sharedCardId,
    setSharedCardId,
    canAddCardToCard,
    setCanAddCardToCard,
    dragCardPosition,
    setDragCardPosition,
    currentDragCard,
    setCurrentDragCard,
    currentDragOverCardRef,
    currentDragOverColumnRef,
    isCardOverRef,
    isColumnOverRef,
    draggingColumnRef,
    sharedColumnRect,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}
