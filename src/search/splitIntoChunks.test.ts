import { describe, expect, it } from "vitest";

import { splitIntoChunks } from "./splitIntoChunks";

describe("splitIntoChunks", () => {
  // it("should not break words", async () => {
  //   const text =
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  //   const wordsCount = text.replace(",", "").replace(".", "").split(" ").length;

  //   const chunks = splitIntoChunks(text);

  //   let wordsCountInChunks = 0;
  //   for (const chunk of chunks) {
  //     wordsCountInChunks += chunk.text
  //       .replace(",", "")
  //       .replace(".", "")
  //       .split(" ").length;
  //   }

  //   expect(wordsCount).toBe(wordsCountInChunks);
  // });

  it("should break into chunks of 100 tokens or less", async () => {
    const text =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    const chunks = splitIntoChunks(text);

    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(100);
    }
  });

  it("should not lose tokens", async () => {
    const text =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    const chunks = splitIntoChunks(text);

    const textInChunks = chunks.map((chunk) => chunk.text).join(" ");

    expect(text.length).toBe(textInChunks.length);
    expect(text).toBe(textInChunks);
  });
});
