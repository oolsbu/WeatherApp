import Classes from "./button.module.css";

interface Props {
  handleClick: () => void;
  possition: string;
  name: string;
}

function Button({ handleClick, possition, name }: Props) {
  const classes = [
    Classes.ButtonWrapper,
    possition === "onForm" ? Classes.onForm : " ",
  ];

  return (
    <div className={classes.join(" ")}>
      <button name={name} onClick={handleClick}>
        Submit
      </button>
    </div>
  );
}

export default Button;
