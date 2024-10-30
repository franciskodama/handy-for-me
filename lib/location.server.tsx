export const getUserLocation = async () => {
  try {
    const response = await fetch('https://ipinfo.io/json');
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    const { city, region, country } = data;
    return { city, region, country };
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};
