import Button from "../../elements/button/button";
import InputField from "../../elements/inputField/inputField";
import Classes from "./serarchBar.module.css";

interface Props {
  onSearchHandler: (value: string) => void;
  changeLatLon: (value: string) => void;
  value: string;
}

function SearchBar({ onSearchHandler, changeLatLon, value }: Props) {
  return (
    <div className={Classes.search}>
      <InputField
        handleSearch={onSearchHandler}
        changeLatLon={changeLatLon}
        type="text"
        placeholder="Search for locations"
        name="Location"
        value={value}
      />
      <Button
        possition="onForm"
        name="Submit"
        handleClick={() => onSearchHandler}
      ></Button>
    </div>
  );
}

export default SearchBar;
