import React, { useState } from "react";
import renderer from "react-test-renderer";
import { Preferences } from "./Preferences";

test("Renders Circle Button List", () => {
  const preferecnesPage = renderer
    .create(<Preferences fName="Test" />)
    .toJSON();
  expect(preferecnesPage).toMatchSnapshot();
});
