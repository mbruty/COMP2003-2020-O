import React from "react";
import renderer from "react-test-renderer";
import { CircleBtnView } from "./CircleBtnView";

test("Renders Circle Button List", () => {
  const circleBtnList = renderer
    .create(
      <CircleBtnView
        options={["Option One", "Option Two"]}
        touchedArray={[true, false]}
        setTouched={(value: boolean, index: number) => {}}
      />
    )
    .toJSON();
  expect(circleBtnList).toMatchSnapshot();
});
