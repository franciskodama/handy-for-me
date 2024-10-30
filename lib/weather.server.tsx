export const getWeather = async (city: string) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}&units=metric`
    ).then((res) => res.json());
    return response;
  } catch (error) {
    console.error(error);
  }
};
