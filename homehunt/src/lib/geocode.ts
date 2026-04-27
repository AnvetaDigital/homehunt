export async function getCoordinates(city: string) {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        city
      )}&key=${process.env.OPENCAGE_API_KEY}`
    );

    const data = await res.json();

    console.log("Geocode response:", data);

    if (!data.results || data.results.length === 0) {
      console.log("No coordinates found");
      return null;
    }

    const lat = data.results[0].geometry.lat;
    const lng = data.results[0].geometry.lng;

    console.log("Coordinates:", lat, lng);

    return { lat, lng };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}