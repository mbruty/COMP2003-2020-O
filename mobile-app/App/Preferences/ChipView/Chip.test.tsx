import React from "react";
import renderer from "react-test-renderer";
import { Chip } from "./Chip";

test("Renders Enabled Chip", () => {
  const chipList = renderer
    .create(
      <Chip
        title="Chip"
        enabled={true}
        index={0}
        setTouched={(touched: boolean, index: number) => {}}
      />
    )
    .toJSON();
  expect(chipList).toMatchSnapshot();
});

test("Renders Disabled Chip", () => {
  const chipList = renderer
    .create(
      <Chip
        title="Chip"
        enabled={false}
        index={0}
        setTouched={(touched: boolean, index: number) => {}}
      />
    )
    .toJSON();
  expect(chipList).toMatchSnapshot();
});
