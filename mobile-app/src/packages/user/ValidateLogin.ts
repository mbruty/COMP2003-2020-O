import * as yup from "yup";
import { API_URL } from "../../constants";
import { email, SignIn } from "./utils";


const validate = async (
  values: SignIn,
  setValidated: React.Dispatch<React.SetStateAction<SignIn>>,
  submit: (token: string) => void
) => {
  // Validate the fields before sending the request!

  if (values.email.trim() === "") {
    setValidated({ password: "", email: "Email cannot be empty" });
    return;
  } else if (values.password === "") {
    setValidated({ email: "", password: "Password cannot be empty" });
    return;
  } else {
    try {
      await email.validate(values.email);
    } catch (e) {
      setValidated({ password: "", email: "Please enter a valid email" });
      return;
    }
  }
  // Valid fields, let's try and log in
  fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      email: values.email,
      password: values.password,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message === "Logged in") {
        // It was a valid log in! Send the event to the props!
        submit(response.authtoken);
      } else {
        // Failed log in, display an error

        setValidated({ email: "", password: "", logInFailed: true });
      }
    })
    .catch((e) => alert("There was an error signing in"));
};

export default validate;