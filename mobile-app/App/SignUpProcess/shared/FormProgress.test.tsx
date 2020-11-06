import React from "react";
import renderer from "react-test-renderer";
import { FormProgress } from "./FormProgress";

test("Renders first item in form progress", () => {
  const circleBtnList = renderer
    .create(<FormProgress selectedIdx={0} />)
    .toJSON();
  expect(circleBtnList).toMatchSnapshot();
});

test("Renders second item in form progress", () => {
  const circleBtnList = renderer
    .create(<FormProgress selectedIdx={1} />)
    .toJSON();
  expect(circleBtnList).toMatchSnapshot();
});

test("Renders third item in form progress", () => {
  const circleBtnList = renderer
    .create(<FormProgress selectedIdx={2} />)
    .toJSON();
  expect(circleBtnList).toMatchSnapshot();
});
