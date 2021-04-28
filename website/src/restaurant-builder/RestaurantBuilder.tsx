import React from "react";
import CSS from "csstype";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import TextField from "@material-ui/core/TextField";
import { Paper } from "@material-ui/core";
import { API_URL } from "../constants";
import MapsAutocomplete from "./MapsAutocomplete";
import { address } from "./GetGeoLocation";

const mainStyle: CSS.Properties = {
  textAlign: "center",
  paddingBottom: "2%",
};

const buttonStyleNext: CSS.Properties = {
  marginTop: "10%",
  width: "40%",
};

const formStyling: CSS.Properties = {
  width: "50vmax",
};

const headingStyle: CSS.Properties = {
  textAlign: "left",
  paddingLeft: "4%",
};

interface Props {
  restaurantId: number;
}

interface Data {
  restaurantname: string;
  restaurantdescription: string;
  phone: string;
  email: string;
  site: string;
  address: address;
  geo: {
    lat: number;
    lng: number;
  };
}

const initialState = {
  restaurantname: "",
  restaurantdescription: "",
  phone: "",
  email: "",
  site: "",
  address: {
    Street1: "",
    Town: "",
    County: "",
    Country: "",
    Postcode: "",
  },
  geo: {
    lat: 0,
    lng: 0,
  },
};

const RestaurantBuilder: React.FC<Props> = () => {
  const [data, setData] = React.useState<Data>({ ...initialState });

  const canVerifyNow = Object.values(data.address).some((v) => !!v);
  return (
    <div className="content" style={mainStyle}>
      <Paper style={{ padding: "2rem" }}>
        <h1>Restaurant Builder</h1>
        <p>
          Ensure valid information inputted... Validation will be done next
          sprint
        </p>

        <div>
          <h2 style={headingStyle}>Name</h2>
          <TextField
            value={data.restaurantname}
            onChange={(e) => {
              setData({ ...data, restaurantname: e.target.value });
            }}
            style={formStyling}
            required
            id="form-name"
            label="Required"
            variant="outlined"
            helperText="Give your restaurant a name. Maximum 60 characters."
          />
        </div>

        <div>
          <h2 style={headingStyle}>Description</h2>
          <TextField
            value={data.restaurantdescription}
            onChange={(e) => {
              setData({ ...data, restaurantdescription: e.target.value });
            }}
            style={formStyling}
            required
            id="form-name"
            label="Required"
            variant="outlined"
            helperText="Give your restaurant a neat description. Maximum 120 characters."
          />
        </div>

        <div>
          <h2 style={headingStyle}>Telephone</h2>
          <TextField
            value={data.phone}
            onChange={(e) => {
              setData({ ...data, phone: e.target.value });
            }}
            style={formStyling}
            id="form-name"
            label="Optional"
            variant="outlined"
            helperText="Make it easier for customers to reach you. Offer your phone number, without spaces."
          />
        </div>

        <div>
          <h2 style={headingStyle}>Email</h2>
          <TextField
            value={data.email}
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
            }}
            style={formStyling}
            id="form-name"
            label="Optional"
            variant="outlined"
            helperText="Does your business have an email address? Enter it here."
          />
        </div>

        <div>
          <h2 style={headingStyle}>Website</h2>
          <TextField
            value={data.site}
            onChange={(e) => {
              setData({ ...data, site: e.target.value });
            }}
            style={formStyling}
            id="form-name"
            label="Optional"
            variant="outlined"
            helperText="Enter your restaurant's web page here."
          />
        </div>

        <div>
          <h2 style={headingStyle}>Restaurant Location</h2>
          <MapsAutocomplete
            onComplete={(geoData) => {
              setData({ ...data, ...geoData });
            }}
          />
        </div>
        <Button
          style={buttonStyleNext}
          variant="contained"
          startIcon={<CheckIcon />}
          color="primary"
          onClick={async () => {
            const result = await fetch(API_URL + "/restaurant/create", {
              method: "POST",
              body: JSON.stringify({
                Longitude: data.geo.lng,
                Latitude: data.geo.lat,
                RestaurantName: data.restaurantname,
                RestaurantDescription: data.restaurantdescription,
                Phone: data.phone,
                Email: data.email,
                Site: data.site,
                Street1: data.address.Street1,
                Town: data.address.Town,
                County: data.address.County,
                Postcode: data.address.Postcode,
              }),
              credentials: "include",
            });

            if (result.status === 200) {
              // We've created it!
              setData({ ...initialState });
            }
            else {
              // Handle errors
            }
          }}
        >
          {canVerifyNow ? "Start Verification" : "Create Now, Verify Later"}
        </Button>
        {!canVerifyNow && (
          <p>
            <strong>Verification Requires an Address</strong>
          </p>
        )}
      </Paper>
    </div>
  );
};

export default RestaurantBuilder;
