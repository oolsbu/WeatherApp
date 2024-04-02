import { useEffect, useState } from "react";
import assetMapping from "../../assets/assetMapping.json";

interface Props {
  weatherCode: string  | undefined;
  size: string;
  rotation?: number;
}

function Icons({ weatherCode, size, rotation }: Props) {
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

  const adjustment = rotation ?  rotation + 90 : 0

  return (
    <>
      {weatherIcon && (
        <img
          src={weatherIcon}
          alt="Weather icon"
          style={{ width: size, height: size,  rotate: adjustment + "deg" }}
        />
      )}
    </>
  );
}

export default Icons;
