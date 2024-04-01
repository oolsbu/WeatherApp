import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  display: string;
  grid: boolean;
}

function Card({ children, display, grid }: Props) {
  const style = {
    display: display,
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    gridTemplateRows: grid ? "repeat(2, 1fr)" : "none",
    gridTemplateColumns: grid ? "repeat(2, 1fr)" : "none",
    gap: "1.25rem",
    padding: "1.25rem",
    backgroundColor: "#f0f0f0",
    borderRadius: "30px",
  };

  return <div style={style}>{children}</div>;
}

export default Card;
