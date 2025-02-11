import { colors } from "../../constants/colors";
import { Txt } from "../Txt";

export function Badge({ cardsCount }: { cardsCount: number }) {
  const isTwoDigits = cardsCount < 10 ? "false" : "true";

  return (
    <div
      css={{
        ...twoDigitsOption[isTwoDigits],
        ...badgeWrapper,
      }}>
      <Txt typography="displayMedium12" color={colors.textWeak}>
        {cardsCount}
        {isTwoDigits === "true" && "+"}
      </Txt>
    </div>
  );
}

const badgeWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  border: `1px solid ${colors.borderDefault}`,
};

const twoDigitsOption = {
  false: {
    width: "24px",
    height: "24px",
  },
  true: {
    width: "40px",
    height: "24px",
  },
};
