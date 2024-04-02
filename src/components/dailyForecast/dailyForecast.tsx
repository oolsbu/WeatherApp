import Icons from "../../elements/icons/icons";
import Classes from "./dailyForecast.module.css";

interface Props {
  time: string | undefined;
  weatherCode: string  | undefined;
  temp: number | undefined;
}

function DailyForecast({ time, weatherCode, temp }: Props) {
  return (
    <div>
      <p className={Classes.time}>{time}</p>
      <Icons weatherCode={weatherCode} size="10rem" />
      <p className={Classes.temp}>{temp}°C</p>
    </div>
  );
}

export default DailyForecast;
