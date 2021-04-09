import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants";
import { email, SignIn } from "./utils";
import { saveAuth } from "../includeAuth";

const validate = async (values: SignIn, submit: () => void) => {
  // Validate the fields before sending the request!
  let hasErrors = false;
  let errors: SignIn = {
    email: "",
    password: "",
  };
  if (values.email.trim() === "") {
    errors = { ...errors, email: "Email cannot be empty" };
    hasErrors = true;
  } else {
    try {
      await email.validate(values.email);
    } catch (e) {
      errors = { ...errors, email: "Please enter a valid email" };
      hasErrors = true;
    }
  }
  if (values.password === "") {
    errors = { ...errors, password: "Password cannot be empty" };
    hasErrors = true;
  }

  if (hasErrors) {
    return errors;
  }
  // Valid fields, let's try and log in
  fetch(API_URL + "/user/login", {
    method: "POST",
    body: JSON.stringify({
      email: values.email,
      password: values.password,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message === "Logged in") {
        // Save the token to local storage
        saveAuth(response).then(() => {
          // It was a valid log in! Send the event to the props!
          submit();
        });
      } else {
        // Failed log in, display an error

        return { ...errors, logInFailed: true };
      }
    })
    .catch((e) => alert("There was an error signing in"));
};

export default validate;
