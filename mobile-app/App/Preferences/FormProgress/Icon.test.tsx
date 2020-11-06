import React from "react";
import renderer from "react-test-renderer";
import { Icon } from "./Icon";

test("Renders Icon from form progress", () => {
  const circleBtnList = renderer
    .create(<Icon text="test" image={require("./account_circle_active.png")} />)
    .toJSON();
  expect(circleBtnList).toMatchSnapshot();
});
