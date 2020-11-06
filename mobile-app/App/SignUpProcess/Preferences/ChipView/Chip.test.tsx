import React from "react";
import renderer from "react-test-renderer";
import { Chip } from "./Chip";

test("Renders Enabled Chip", () => {
  const chip = renderer
    .create(
      <Chip
        title="Chip"
        enabled={true}
        index={0}
        setTouched={(touched: boolean, index: number) => {}}
      />
    )
    .toJSON();
  expect(chip).toMatchSnapshot();
});

test("Renders Disabled Chip", () => {
  const chip = renderer
    .create(
      <Chip
        title="Chip"
        enabled={false}
        index={0}
        setTouched={(touched: boolean, index: number) => {}}
      />
    )
    .toJSON();
  expect(chip).toMatchSnapshot();
});
