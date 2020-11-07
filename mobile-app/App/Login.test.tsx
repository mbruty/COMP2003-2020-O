import React from "react";
import renderer from "react-test-renderer";
import { LogIn } from "./LogIn";

test("Renders Circle Button List", () => {
  const logInPage = renderer.create(<LogIn />).toJSON();
  expect(logInPage).toMatchSnapshot();
});
