export const API_KEY = "AIzaSyDYX6GcvJQUqzO_mUTBYh-nVyhXYoReKXM";

export default async function (name: string) {
  const data = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${name.replaceAll(
      " ",
      "%20"
    )}&key=${API_KEY}`
  );
  const body = await data.json();
  const location = body.results[0];
  return {
    address: location.formatted_address,
    geo: location.geometry.location,
  };
}
