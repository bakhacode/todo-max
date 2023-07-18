import { MainPageData } from "../../pages/MainPage";
import { ColumnWrapper } from "./ColumnWrapper";

export function ColumnList({ data }: { data: MainPageData | undefined }) {
  return (
    <div
      css={{
        display: "flex",
        width: "1280px",
        position: "relative",
        top: "32px",
        gap: "24px",
      }}>
      {data?.map((column) => <ColumnWrapper key={column.id} column={column} />)}
    </div>
  );
}
