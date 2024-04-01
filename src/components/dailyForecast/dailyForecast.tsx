import Icons from "../../elements/icons/icons";
import Classes from "./dailyForecast.module.css";

interface Props {
  time: string;
  weatherCode: string;
  temp: number;
}

function DailyForecast({ time, weatherCode, temp }: Props) {
  return (
    <div>
      <p className={Classes.time}>{time}</p>
      <Icons weatherCode={weatherCode} size="100px" />
      <p className={Classes.temp}>{temp}°C</p>
    </div>
  );
}

export default DailyForecast;
