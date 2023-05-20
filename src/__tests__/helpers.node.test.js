import { expect, describe, test } from "bun:test";

import { guessMaxImageWidth, fallbackParams } from "components/helpers";

describe("guessMaxImageWidth", () => {
  const expected = 0;
  test(`Should return ${expected} when run in the node environment`, () => {
    const result = guessMaxImageWidth({ width: 100 });
    expect(result).toEqual(expected);
  });
});

describe("FallbackParams", () => {
  const props = {
    srcSet: [
      {
        format: "webp",
      },
      {
        format: "jpeg",
      },
      {
        format: "png",
      },
    ],
    getUrl: () => "",
  };

  test("Should return an object when run in the node environment", () => {
    const result = fallbackParams(props);
    expect(result).not.toEqual({});
    // expect(props.getUrl).toHaveBeenCalled() TODO(noah): @see https://bun.sh/docs/test/writing#matchers
    expect(result.ssr).toEqual(true);
  });
});
