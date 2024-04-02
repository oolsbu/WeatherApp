import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  display: string;
  grid: boolean;
  flexDirection?: string;
}

function Card({ children, flexDirection, display, grid }: Props) {
  const style = {
    display: display,
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    gridTemplateRows: grid ? "repeat(2, 1fr)" : "none",
    gridTemplateColumns: grid ? "repeat(2, 1fr)" : "none",
    gap: "1.25rem",
    padding: "1.25rem",
    backgroundColor: "rgba(240, 240, 240, 0.8)",
    borderRadius: "30px",
    margin: "1rem",
    "flex-direction": flexDirection,
  };

  return <div style={style}>{children}</div>;
}

export default Card;
