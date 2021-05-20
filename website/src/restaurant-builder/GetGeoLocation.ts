export const API_KEY = "AIzaSyDYX6GcvJQUqzO_mUTBYh-nVyhXYoReKXM";

export type address = {
  Street1: string;
  Town: string;
  County: string;
  Country: string;
  Postcode: string;
};

export default async function (name: string) {
  const data = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${name.replaceAll(
      " ",
      "%20"
    )}&key=${API_KEY}`
  );
  const body = await data.json();
  const location = body.results[0];
  let address: address = {
    Street1: "",
    Town: "",
    County: "",
    Country: "",
    Postcode: "",
  };
  location.address_components.forEach((element: any) => {
    if (element.types.includes("street_number")) {
      address.Street1 = element.long_name + " ";
    }
    if (element.types.includes("route")) {
      address.Street1 += element.long_name;
    }
    if (element.types.includes("postal_town")) {
      address.Town = element.long_name;
    }
    if (element.types.includes("administrative_area_level_1")) {
      address.County = element.long_name;
    }
    if (element.types.includes("country")) {
      address.Country = element.long_name;
    }
    if (element.types.includes("postal_code")) {
      address.Postcode = element.long_name;
    }
  });

  console.log(address);

  return {
    address,
    geo: location.geometry.location,
  };
}
