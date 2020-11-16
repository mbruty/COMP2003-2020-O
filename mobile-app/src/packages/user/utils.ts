import * as yup from "yup";

export interface SignIn {
  email: string;
  password: string;
  logInFailed?: boolean;
}

export interface Values {
  username: string;
  email: string;
  dob: Date | string;
  password: string;
  confPassword: string;
}

export const email = yup.string().email().required();

export const isToday = (someDate): boolean => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};