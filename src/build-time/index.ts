import { resolve } from "node:path";
import shikiTwoslash from "remark-shiki-twoslash";
import remarkSupersub from "remark-supersub";
import type { Pluggable, PluggableList } from "unified";

import { titleCase } from "../lib/titleCase";

import { asidesPlugin } from "./asidesPlugin";
import { defaultLayoutPlugin } from "./defaultLayoutPlugin";
import { derivedTitleAndDatePlugin } from "./derivedTitleAndDatePlugin";
import {
  readingTimePlugin,
  remarkMdxReadingTimePlugin,
} from "./readingTimePlugin";
import { urlOutsideOfPagesDirPlugin } from "./urlOutsideOfPagesDirPlugin";

export const remarkPlugins = (projectDir: string): PluggableList => {
  return checkOptions(
    [
      defaultLayoutPlugin,
      {
        postLayoutPath: resolve(projectDir, "./src/layouts/PostLayout.astro"),
        talkLayoutPath: resolve(projectDir, "./src/layouts/TalkLayout.astro"),
      },
    ],
    [
      urlOutsideOfPagesDirPlugin,
      { absoluteDirPath: resolve(projectDir, "./posts") },
    ],
    [derivedTitleAndDatePlugin, { title: titleCase }],
    remarkSupersub,
    [shikiTwoslash, { themes: ["github-light", "github-dark"] }],
    readingTimePlugin,
    remarkMdxReadingTimePlugin
  );
};

export const rehypePlugins: PluggableList = checkOptions([asidesPlugin, {}]);

/**
 * Adds autocomplete and typechecking to plugin tuples.
 */
function checkOptions<TPlugins extends Pluggable[]>(
  ...p: {
    [I in keyof TPlugins]: TPlugins[I] extends [
      infer TPlugin extends (...args: never[]) => unknown,
      unknown
    ]
      ? [TPlugin, ...Parameters<TPlugin>]
      : TPlugins[I];
  }
) {
  return p;
}
