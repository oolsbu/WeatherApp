import Classes from "./inputField.module.css";

interface Props {
  type: string;
  name: string;
  value: string;
  placeholder: string;

  handleSearch: (value: string) => void;
  changeLatLon: (value: string) => void;
}

function InputField({ handleSearch, changeLatLon, type, name, value, placeholder }: Props) {
  return (
    <div className={Classes.InputField_wrapper}>
      <form onSubmit={(e) => {
        e.preventDefault(); 
        changeLatLon(value); // Use the current value directly, no need to access the target
        console.log("Submitted");
      }}>
        <input
          type={type}
          id={name}
          value={value}
          className={Classes.inputField}
          placeholder={placeholder}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </form>
    </div>
  );
}


export default InputField;
