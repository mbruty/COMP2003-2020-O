import React from "react";
import renderer from "react-test-renderer";
import { CircleBtn } from "./CircleBtn";

test("Renders Enabled Circle Button", () => {
  const circleBtn = renderer
    .create(
      <CircleBtn
        name="TestBtn"
        selected={true}
        index={0}
        setTouched={(value: boolean, index: number) => {}}
      />
    )
    .toJSON();
  expect(circleBtn).toMatchSnapshot();
});

test("Renders Disabled Circle Button", () => {
  const circleBtn = renderer
    .create(
      <CircleBtn
        name="TestBtn"
        selected={false}
        index={0}
        setTouched={(value: boolean, index: number) => {}}
      />
    )
    .toJSON();
  expect(circleBtn).toMatchSnapshot();
});
