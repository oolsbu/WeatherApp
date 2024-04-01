import { useState } from "react";
import "./App.css";
import "./index.css";
import Error from "./components/error/error";
import Card from "./elements/card/card";
import SearchBar from "./components/searchBar/searchBar"; 
import DailyForecast from "./components/dailyForecast/dailyForecast";
import WeeklyForecast from "./components/weeklyForecast/weeklyForecast";
import Icons from "./elements/icons/icons";

function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="main">
      <SearchBar onSearchHandler={setSearchValue} value={searchValue} />

      <div className="dailyForecast">
        <Card display="flex" grid={false}>
          <DailyForecast time="12:00" temp={24} weatherCode="clearsky_day" />
          <DailyForecast
            time="13:00"
            temp={24}
            weatherCode="partlycloudy_night"
          />
          <DailyForecast
            time="14:00"
            temp={24}
            weatherCode="partlycloudy_night"
          />
          <DailyForecast
            time="15:00"
            temp={24}
            weatherCode="partlycloudy_night"
          />
          <DailyForecast
            time="15:00"
            temp={24}
            weatherCode="partlycloudy_night"
          />
          <DailyForecast
            time="15:00"
            temp={24}
            weatherCode="partlycloudy_night"
          />
        </Card>
        <Card display="grid" grid={true}>
          <div>
            <Icons weatherCode="cloudy" size="24px"></Icons>
            <p>Feels like</p>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </Card>
      </div>
      <div className="weekly">
        <Card display="column" grid={false}>
          <h4>Weekly forecast</h4>
          <WeeklyForecast
            day="Monday"
            weatherCode="clearsky_day"
            tempMax={24}
            tempMin={12}
          />
          <WeeklyForecast
            day="Monday"
            weatherCode="clearsky_day"
            tempMax={24}
            tempMin={12}
          />
          <WeeklyForecast
            day="Monday"
            weatherCode="clearsky_day"
            tempMax={24}
            tempMin={12}
          />
          <WeeklyForecast
            day="Monday"
            weatherCode="clearsky_day"
            tempMax={24}
            tempMin={12}
          />
          <WeeklyForecast
            day="Monday"
            weatherCode="clearsky_day"
            tempMax={24}
            tempMin={12}
          />
          <WeeklyForecast
            day="Monday"
            weatherCode="clearsky_day"
            tempMax={24}
            tempMin={12}
          />
          <WeeklyForecast
            day="Monday"
            weatherCode="clearsky_day"
            tempMax={24}
            tempMin={12}
          />
        </Card>
      </div>
    </div>
  );
}

export default App;
