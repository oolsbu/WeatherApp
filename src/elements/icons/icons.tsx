import { useEffect, useState } from "react";
import assetMapping from "../../assets/assetMapping.json";

interface Props {
  weatherCode: string  | undefined;
  size: string;
}

function Icons({ weatherCode, size }: Props) {
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);

  useEffect(() => {
    const importWeatherIcon = async () => {
      try {
        const current = weatherCode as keyof typeof assetMapping;
        const { default: icon } = await import(
          `../../assets/icons/${assetMapping[current]}.svg`
        );
        setWeatherIcon(icon);
      } catch (error) {
        console.error("Error loading weather icon:", error);
      }
    };
    importWeatherIcon();
  }, [weatherCode]);

  return (
    <>
      {weatherIcon && (
        <img
          src={weatherIcon}
          alt="Weather icon"
          style={{ width: size, height: size }}
        />
      )}
    </>
  );
}

export default Icons;
