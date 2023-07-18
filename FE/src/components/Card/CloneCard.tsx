import { colors } from "../../constants/colors";
import { shadow } from "../../constants/shadow";
import { IconButton } from "../Button/IconButton";
import { Txt } from "../Txt";

export function CloneCard({
  isOverHalf,
  cloneType,
  cloneCardPosition,
  newCardTitle,
  newCardContent,
  getUserDevice,
}: {
  isOverHalf?: boolean;
  cloneType: string;
  cloneCardPosition: {
    x: number;
    y: number;
  };
  newCardTitle: string;
  newCardContent: string;
  getUserDevice: string;
}) {
  return (
    <div
      css={{
        position: cloneType === "from" ? "fixed" : "relative",
        left: cloneCardPosition.x,
        top: cloneCardPosition.y,
        display: "flex",
        flexDirection: "column",
        width: "268px",
        padding: "16px",
        gap: "16px",
        backgroundColor: colors.surfaceDefault,
        borderRadius: "8px",
        boxShadow: shadow.normal,
        opacity: isOverHalf ? 0 : "0.3",
      }}>
      <div
        css={{
          display: "flex",
          gap: "4px",
        }}>
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
              {`author by ${getUserDevice}`}
            </Txt>
          </div>
        </div>
        <div>
          <IconButton
            type="close"
            width="24px"
            height="24px"
            color={colors.textWeak}
          />
          <IconButton
            type="edit"
            width="24px"
            height="24px"
            color={colors.textWeak}
          />
        </div>
      </div>
    </div>
  );
}
