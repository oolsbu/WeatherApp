import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import Error from "./components/error/error";
import Card from "./elements/card/card";
import SearchBar from "./components/searchBar/searchBar"; 
import DailyForecast from "./components/dailyForecast/dailyForecast";
import WeeklyForecast from "./components/weeklyForecast/weeklyForecast";
import Icons from "./elements/icons/icons";

interface WeatherData {
  time: string; 
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number;
        air_temperature: number;
        cloud_area_fraction: number;
        relative_humidity: number;
        wind_from_direction: number;
        wind_speed: number;
      };
    };
    next_12_hours?: {
      summary: {
        symbol_code: string;
      };
      details?: any; // You can define a more specific interface if needed
    };
    next_1_hours?: {
      summary: {
        symbol_code: string;
      };
      details?: {
        precipitation_amount: number;
      };
    };
    next_6_hours?: {
      summary: {
        symbol_code: string;
      };
      details?: {
        precipitation_amount: number;
      };
    };
  };
}

interface WeatherForecast {
  location: {
    type: string;
    coordinates: [number, number, number];
  };
  properties: {
    meta: {
      updated_at: string;
      units: {
        air_pressure_at_sea_level: string;
        air_temperature: string;
        cloud_area_fraction: string;
        precipitation_amount: string;
        relative_humidity: string;
        wind_from_direction: string;
        wind_speed: string;
      };
    };
    timeseries: WeatherData[];
  };
}


function App() {
  const [searchValue, setSearchValue] = useState("");
  const [lat, setLat] = useState<number>(60);
  const [lon, setLon] = useState<number>(11);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`)
        if(!response.ok){
          console.error("Failed to fetch")
        }
        const data: WeatherForecast = await response.json();
        setWeatherForecast(data)
        localStorage.setItem("data", JSON.stringify(data))
        localStorage.setItem("lastUpdate", Date.now().toString())
        localStorage.setItem("lat", lat.toString())
        localStorage.setItem("lon", lon.toString())
        console.log(data)
        console.log(weatherForecast?.properties.timeseries[0].data.instant.details.air_temperature)
      }
      catch (error){
        console.error("Failed", error)
      }
    }
    
    const lastUpdate: string = localStorage.getItem("lastUpdate") ?? "";
    
    if(!localStorage.getItem("data")){
      fetchWeather();
    }
    else if(parseInt(lastUpdate ,10) + 3600000 <= Date.now() ){
      localStorage.setItem("lastUpdate", Date.now().toString())
      fetchWeather();
    }
    else if(parseInt(localStorage.getItem("lat") ?? "",10) !== lat || parseInt(localStorage.getItem("lon") ?? "",10) !== lon){
      fetchWeather();
    }
    else{
      setWeatherForecast(JSON.parse(localStorage.getItem("data") ?? ""))
    }
    
  }, [lat, lon]);

  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="main">
      <SearchBar onSearchHandler={setSearchValue} value={searchValue} />

      <div className="dailyForecast">
        <Card display="flex" grid={false}>

          <DailyForecast
           time={formatTime(weatherForecast?.properties.timeseries[1]?.time ?? " ")} 
           temp={weatherForecast?.properties.timeseries[1].data.instant.details.air_temperature} 
           weatherCode={weatherForecast?.properties.timeseries[1].data.next_1_hours?.summary.symbol_code}
           />
          <DailyForecast
            time={formatTime(weatherForecast?.properties.timeseries[2]?.time ?? " ")}
            temp={weatherForecast?.properties.timeseries[2].data.instant.details.air_temperature}
            weatherCode={weatherForecast?.properties.timeseries[2].data.next_1_hours?.summary.symbol_code}
          />
          <DailyForecast
            time={formatTime(weatherForecast?.properties.timeseries[3]?.time ?? " ")}
            temp={weatherForecast?.properties.timeseries[3].data.instant.details.air_temperature}
            weatherCode={weatherForecast?.properties.timeseries[3].data.next_1_hours?.summary.symbol_code}
          />
          <DailyForecast
            time={formatTime(weatherForecast?.properties.timeseries[4]?.time ?? " ")}
            temp={weatherForecast?.properties.timeseries[4].data.instant.details.air_temperature}
            weatherCode={weatherForecast?.properties.timeseries[4].data.next_1_hours?.summary.symbol_code}
          />
          <DailyForecast
            time={formatTime(weatherForecast?.properties.timeseries[5]?.time ?? " ")}
            temp={weatherForecast?.properties.timeseries[5].data.instant.details.air_temperature}
            weatherCode={weatherForecast?.properties.timeseries[5].data.next_1_hours?.summary.symbol_code}
          />
          <DailyForecast
            time={formatTime(weatherForecast?.properties.timeseries[6]?.time ?? " ")}
            temp={weatherForecast?.properties.timeseries[6].data.instant.details.air_temperature}
            weatherCode={weatherForecast?.properties.timeseries[6].data.next_1_hours?.summary.symbol_code}
          />
        </Card>
        <Card display="grid" grid={true}>
          <div><div>
          <Icons weatherCode="cloudy" size="24px"></Icons>
            <p>Feels like</p>
          </div>
            <h3>27C</h3>
          </div>
          <div>
          <Icons weatherCode="wind" size="18px"></Icons>
            <p>Wind speed</p>
            <h3>24/32m/s</h3>
          </div>
          <div>
          <Icons weatherCode="clearsky_day" size="24px"></Icons>
            <p>UV Index</p>
            <h3>4</h3>
          </div>
          <div>
            <p>wind direction</p>
            <Icons weatherCode="arrow" size="24px"></Icons>
            <p>North</p>
            </div>
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
