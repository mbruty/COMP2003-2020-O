import { API_URL } from "../../constants";
import { email, isToday, Values } from "./utils";
const pwRegex = RegExp(
  /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~])[a-zA-Z0-9!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~]{8,}$/
);

export interface Params {
  values: Values;
  date: Date;
  next?: (value: string, userid: string, authtoken: string) => void;
  setErrors?: React.Dispatch<React.SetStateAction<Values>>;
  submit?: boolean;
}

const validate = async ({ values, date, next, setErrors, submit }: Params) => {
  let hasErrors = false;
  let currentErrors: Values = {
    username: "",
    email: "",
    dob: "",
    password: "",
    confPassword: "",
  };
  if (submit) {
    if (values.username === "") {
      currentErrors.username = "Username is required!";
      hasErrors = true;
    }
    if (values.password === "" || values.confPassword === "") {
      currentErrors.confPassword = "Password is required!";
      hasErrors = true;
    }
    // date is initalised to today, so if it's today the haven't changed it
    if (isToday(date) && submit) {
      currentErrors.dob = "Date of Birth is required";
      hasErrors = true;
    }
    if (values.email === "") {
      currentErrors.email = "Email is required!";
      hasErrors = true;
    }
    if (values.confPassword !== values.password) {
      currentErrors.confPassword += "The passwords do not match";
      hasErrors = true;
    }
  }
  if (values.email !== "") {
    try {
      // Validate the email using Yup
      await email.validate(values.email);
    } catch (e) {
      currentErrors.email = "Please enter a valid email";
      hasErrors = true;
    }
  }
  if (
    values.confPassword !== "" &&
    values.password !== "" &&
    values.confPassword !== values.password
  ) {
    currentErrors.confPassword = "The passwords do not match!";
  }
  if (values.password !== "" && !pwRegex.test(values.password)) {
    currentErrors.confPassword +=
      "Please enter a strong password\n8 Characters in length; Atleast:\n\t1 Number,\n\t1 Symbol,\n\t1 Uppercase Character,\n\t1 Lowercase Character";
    hasErrors = true;
  }

  // Date isn't in the future
  if (date > new Date()) {
    currentErrors.dob += "Date of Birth cannot be in the future";
    hasErrors = true;
  }
  // No errors occurred... Time to send it to the api
  if (!hasErrors && submit) {
    // Try and post the sign-up info
    fetch(API_URL + "/signup", {
      method: "POST",
      headers: {
        email: values.email,
        password: values.password,
        yearOfBirth: date.getFullYear().toString(),
        nickname: values.username,
      },
    })
      // Convert the response to json
      .then((response) => response.json())
      .then((response) => {
        if (response.error === "Email is in use") {
          // The email is already in use
          currentErrors.email = "Email is in use";
        } else if (response.message === "Signed Up") {
          // Go to the next bit
          next(values.username, response.userid, response.authtoken);
        } else {
          alert("An unexpected error has happened");
        }
      })
      .catch((e) => alert("There was an error creating your account"));
  }
  if (setErrors) setErrors(currentErrors);
  else return currentErrors;
};

export default validate;
