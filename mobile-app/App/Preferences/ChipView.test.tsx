import React from "react";
import renderer from "react-test-renderer";
import { ChipView } from "./ChipView";

test("Renders Chip List", () => {
  const chipList = renderer
    .create(<ChipView chipNameList={["Chip One", "Chip Two"]} />)
    .toJSON();
  expect(chipList).toMatchSnapshot();
});
