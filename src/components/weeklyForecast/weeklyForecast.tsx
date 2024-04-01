import Icons from "../../elements/icons/icons";
import Classes from "./weeklyForecast.module.css";

interface Props {
  day: string;
  weatherCode: string;
  tempMax: number;
  tempMin: number;
}

function WeeklyForecast({ day, weatherCode, tempMax, tempMin }: Props) {
  return (
    <div className={Classes.div}>
      <p className={Classes.day}>{day}</p>
      <Icons weatherCode={weatherCode} size="50px" />
      <p className={Classes.temp}>
        <b>{tempMax}</b>/{tempMin}°C
      </p>
    </div>
  );
}

export default WeeklyForecast;
