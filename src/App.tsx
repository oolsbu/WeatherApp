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
        wind_speed_of_gust: number;
        ultraviolet_index_clear_sky: number;
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
        wind_speed_of_gust: string;
      };
    };
    timeseries: WeatherData[];
  };
}

interface geo {
  lat: number;
  lon: number;
  display_name: string;
}

function App() {
  const [place, setPlace] = useState<string>("Oslo");
  const [searchValue, setSearchValue] = useState("");
  const [geoLocation, setGeoLocation] = useState<geo | null>(null);
  const [newDayIndex, setNewDayIndex] = useState<number[]>([]);
  const [lat, setLat] = useState<number>(60);
  const [lon, setLon] = useState<number>(11);
  const [weatherForecast, setWeatherForecast] =
    useState<WeatherForecast | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`
        );
        if (!response.ok) {
          console.error("Failed to fetch");
        }
        const data: WeatherForecast = await response.json();
        setWeatherForecast(data);
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("lastUpdate", Date.now().toString());
        localStorage.setItem("lat", lat.toString());
        localStorage.setItem("lon", lon.toString());
        console.log(data);
        console.log(
          weatherForecast?.properties.timeseries[0].data.instant.details
            .air_temperature
        );
      } catch (error) {
        console.error("Failed", error);
      }
    };

    const lastUpdate: string = localStorage.getItem("lastUpdate") ?? "";

    if (!localStorage.getItem("data")) {
      fetchWeather();
    } else if (parseInt(lastUpdate, 10) + 3600000 <= Date.now()) {
      localStorage.setItem("lastUpdate", Date.now().toString());
      fetchWeather();
    } else if (
      parseInt(localStorage.getItem("lat") ?? "", 10) !== lat ||
      parseInt(localStorage.getItem("lon") ?? "", 10) !== lon
    ) {
      fetchWeather();
    } else {
      setWeatherForecast(JSON.parse(localStorage.getItem("data") ?? ""));
    }
  }, [lat, lon]);

  useEffect(() => {
    const changeLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search.php?city="${place}"&format=jsonv2`
        );
        if (!response.ok) {
          console.error("Failed to fetch geolocation");
        }
        const result: geo[] = await response.json();
        setGeoLocation(result[0]);
        setLat(result[0].lat);
        setLon(result[0].lon);
        console.log(geoLocation);
        localStorage.setItem("geoLocation", JSON.stringify(geoLocation));
      } catch (error) {
        console.error("Failed", error);
      }
    };
    changeLocation();
  }, [place]);

  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDate = (isoTime: string) => {
    const date = new Date(isoTime);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};


  const findDayIndexes = (timeseries: WeatherData[]) => {
    const dayIndexes: number[] = [0];

    // Assuming timeseries is sorted by date
    for (let i = 0; i < timeseries.length - 1; i++) {
      const currentDate = new Date(timeseries[i].time);
      const nextDate = new Date(timeseries[i + 1].time);

      // Adjust time zone offset
      const currentUTCTime = Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
      );

      const nextUTCTime = Date.UTC(
        nextDate.getUTCFullYear(),
        nextDate.getUTCMonth(),
        nextDate.getUTCDate()
      );

      // Check if next date is different from current date
      if (currentUTCTime !== nextUTCTime) {
        dayIndexes.push(i + 1);
      }
    }

    setNewDayIndex(dayIndexes);
  };

  useEffect(() => {
    findDayIndexes(weatherForecast?.properties.timeseries ?? []);
  }, [weatherForecast]);

  const findMaxTemperature = (
    timeseries: WeatherData[],
    dayIndexes: number[],
    dayIndex: number
  ): number => {
    const startIndex = dayIndexes[dayIndex];
    const endIndex = dayIndexes[dayIndex + 1] - 1; // Exclude the next day index

    let temps: number[] = [];

    for (let j = startIndex; j <= endIndex; j++) {
      let temperature = timeseries[j].data.instant.details.air_temperature;
      temps.push(temperature);
    }
    const dayMaxTemperature = Math.max(...temps);
    console.log(temps);

    return Math.round(dayMaxTemperature);
  };

  const findMinTemperature = (
    timeseries: WeatherData[],
    dayIndexes: number[],
    dayIndex: number
  ): number => {
    const startIndex = dayIndexes[dayIndex];
    const endIndex = dayIndexes[dayIndex + 1] - 1;

    let temps: number[] = [];

    for (let j = startIndex; j <= endIndex; j++) {
      let temperature = timeseries[j].data.instant.details.air_temperature;
      temps.push(temperature);
    }
    const dayMinTemperature = Math.min(...temps);

    return Math.round(dayMinTemperature);
  };

  return (
    <div className="main">
      <SearchBar
        onSearchHandler={setSearchValue}
        value={searchValue}
        changeLatLon={setPlace}
      />
      <Card display="" grid={false}>
        <h2>Weather for:</h2>
        <h1>{geoLocation?.display_name}</h1>
      </Card>

      <div className="dailyForecast">
        <Card display="grid" grid={true}>
          <div>
            <div>
              <Icons weatherCode="heavy_rain" size="24px"></Icons>
              <p>rain</p>
            </div>
            <h3>
              {
                weatherForecast?.properties.timeseries[0].data.next_1_hours
                  ?.details?.precipitation_amount
              }{" "}
              mm
            </h3>
          </div>
          <div>
            <Icons weatherCode="wind" size="18px"></Icons>
            <p>Wind speed</p>
            <h3>
              {
                weatherForecast?.properties.timeseries[0].data.instant.details
                  .wind_speed
              }
              /
              {
                weatherForecast?.properties.timeseries[0].data.instant.details
                  .wind_speed_of_gust
              }
              m/s
            </h3>
          </div>
          <div>
            <Icons weatherCode="clearsky_day" size="24px"></Icons>
            <p>UV Index</p>
            <h3>
              {
                weatherForecast?.properties.timeseries[0].data.instant.details
                  .ultraviolet_index_clear_sky
              }
            </h3>
          </div>
          <div>
            <p>wind direction</p>
            <Icons
              weatherCode="arrow"
              size="24px"
              rotation={
                weatherForecast?.properties.timeseries[0].data.instant.details
                  .wind_from_direction
              }
            ></Icons>
            <p>North</p>
          </div>
        </Card>
        <Card display="flex" grid={false}>
          <DailyForecast
            time={formatTime(
              weatherForecast?.properties.timeseries[1]?.time ?? " "
            )}
            temp={
              weatherForecast?.properties.timeseries[1].data.instant.details
                .air_temperature
            }
            weatherCode={
              weatherForecast?.properties.timeseries[1].data.next_1_hours
                ?.summary.symbol_code
            }
          />
          <DailyForecast
            time={formatTime(
              weatherForecast?.properties.timeseries[2]?.time ?? " "
            )}
            temp={
              weatherForecast?.properties.timeseries[2].data.instant.details
                .air_temperature
            }
            weatherCode={
              weatherForecast?.properties.timeseries[2].data.next_1_hours
                ?.summary.symbol_code
            }
          />
          <DailyForecast
            time={formatTime(
              weatherForecast?.properties.timeseries[3]?.time ?? " "
            )}
            temp={
              weatherForecast?.properties.timeseries[3].data.instant.details
                .air_temperature
            }
            weatherCode={
              weatherForecast?.properties.timeseries[3].data.next_1_hours
                ?.summary.symbol_code
            }
          />
          <DailyForecast
            time={formatTime(
              weatherForecast?.properties.timeseries[4]?.time ?? " "
            )}
            temp={
              weatherForecast?.properties.timeseries[4].data.instant.details
                .air_temperature
            }
            weatherCode={
              weatherForecast?.properties.timeseries[4].data.next_1_hours
                ?.summary.symbol_code
            }
          />
          <DailyForecast
            time={formatTime(
              weatherForecast?.properties.timeseries[5]?.time ?? " "
            )}
            temp={
              weatherForecast?.properties.timeseries[5].data.instant.details
                .air_temperature
            }
            weatherCode={
              weatherForecast?.properties.timeseries[5].data.next_1_hours
                ?.summary.symbol_code
            }
          />
          <DailyForecast
            time={formatTime(
              weatherForecast?.properties.timeseries[6]?.time ?? " "
            )}
            temp={
              weatherForecast?.properties.timeseries[6].data.instant.details
                .air_temperature
            }
            weatherCode={
              weatherForecast?.properties.timeseries[6].data.next_1_hours
                ?.summary.symbol_code
            }
          />
        </Card>
      </div>
      <div className="weekly">
        <Card display="column" grid={false} flexDirection="column">
          <h4>Weekly forecast</h4>
          <WeeklyForecast
            day={formatDate(weatherForecast?.properties.timeseries[newDayIndex[0]]?.time ?? "")}
            weatherCode={
              weatherForecast?.properties.timeseries[newDayIndex[0]]?.data
                ?.next_12_hours?.summary.symbol_code ?? ""
            }
            tempMax={findMaxTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              0
            )}
            tempMin={findMinTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              0
            )}
          />
          <WeeklyForecast
            day={formatDate(weatherForecast?.properties.timeseries[newDayIndex[1]]?.time ?? "")}
            weatherCode={
              weatherForecast?.properties.timeseries[newDayIndex[1]]?.data
                ?.next_12_hours?.summary.symbol_code ?? ""
            }
            tempMax={findMaxTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              1
            )}
            tempMin={findMinTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              1
            )}
          />
          <WeeklyForecast
            day={formatDate(weatherForecast?.properties.timeseries[newDayIndex[2]]?.time ?? "")}
            weatherCode={
              weatherForecast?.properties.timeseries[newDayIndex[2]]?.data
                ?.next_12_hours?.summary.symbol_code ?? ""
            }
            tempMax={findMaxTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              2
            )}
            tempMin={findMinTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              2
            )}
          />
          <WeeklyForecast
            day={formatDate(weatherForecast?.properties.timeseries[newDayIndex[3]]?.time ?? "")}
            weatherCode={
              weatherForecast?.properties.timeseries[newDayIndex[3]]?.data
                ?.next_12_hours?.summary.symbol_code ?? ""
            }
            tempMax={findMaxTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              3
            )}
            tempMin={findMinTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              3
            )}
          />
          <WeeklyForecast
            day={formatDate(weatherForecast?.properties.timeseries[newDayIndex[4]]?.time ?? "")}
            weatherCode={
              weatherForecast?.properties.timeseries[newDayIndex[4]]?.data
                ?.next_12_hours?.summary.symbol_code ?? ""
            }
            tempMax={findMaxTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              4
            )}
            tempMin={findMinTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              4
            )}
          />
          <WeeklyForecast
            day={formatDate(weatherForecast?.properties.timeseries[newDayIndex[5]]?.time ?? "")}
            weatherCode={
              weatherForecast?.properties.timeseries[newDayIndex[5]]?.data
                ?.next_12_hours?.summary.symbol_code ?? ""
            }
            tempMax={findMaxTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              5
            )}
            tempMin={findMinTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              5
            )}
          />
          <WeeklyForecast
            day={formatDate(weatherForecast?.properties.timeseries[newDayIndex[6]]?.time ?? "")}
            weatherCode={
              weatherForecast?.properties.timeseries[newDayIndex[6]]?.data
                ?.next_12_hours?.summary.symbol_code ?? ""
            }
            tempMax={findMaxTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              6
            )}
            tempMin={findMinTemperature(
              weatherForecast?.properties.timeseries ?? [],
              newDayIndex,
              6
            )}
          />
        </Card>
      </div>
    </div>
  );
}

export default App;
