import Classes from "./inputField.module.css";

interface Props {
  type: string;
  name: string;
  value: string;
  placeholder: string;

  handleSearch: (value: string) => void;
}

function InputField({ handleSearch, type, name, value, placeholder }: Props) {
  return (
    <div className={Classes.InputField_wrapper}>
      <input
        type={type}
        id={name}
        value={value}
        className={Classes.inputField}
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
      ></input>
    </div>
  );
}

export default InputField;
