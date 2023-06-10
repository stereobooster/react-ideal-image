import { expect, describe, test } from "bun:test";
import renderer from "react-test-renderer";

import IdealImageWithDefaults from "IdealImageWithDefaults";

describe("IdealImageWithDefaults", () => {
  // TODO(noah): @see https://github.com/oven-sh/bun/issues/198
  test.skip("Renders a snapshot that is good", () => {
    const comp = renderer
      .create(
        <IdealImageWithDefaults
          placeholder={{ color: "blue" }}
          srcSet={[
            {
              src: "some-src.jpg",
              width: 3500,
            },
          ]}
          alt="doggo"
          width={3500}
          height={2095}
        />
      )
      .toJSON();

    expect(comp).toMatchSnapshot();
  });
});
