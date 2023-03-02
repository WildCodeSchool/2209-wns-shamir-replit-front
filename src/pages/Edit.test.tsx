/**
 * @jest-environment jsdom
 */

import React from "react";
import Edit from "./Edit";
import { render } from "@testing-library/react";

describe("test of Edit page", () => {
  test("basic render", () => {
    render(<Edit />);
  });
});
