import { Widgets } from "../Home";

const codes =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
export const encode = (data: Widgets[]): string => {
  return data.reduce((string, widget) => {
    if (!widget) return "";
    return `${string}${codes.charAt(widget)}`;
  }, "");
};

export const decode = (data: string): Widgets[] => {
  return data.split("").map((char) => codes.indexOf(char));
};
