import React from "react";
import renderer from "react-test-renderer";
import { ChipView } from "./ChipView";

test("Renders Chip List", () => {
  const chipList = renderer
    .create(
      <ChipView
        setTouched={(value: boolean, index: number) => {}}
        chipNameList={["Chip One", "Chip Two"]}
        enabledArray={[true, false]}
      />
    )
    .toJSON();
  expect(chipList).toMatchSnapshot();
});
