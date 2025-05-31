import type { MarkdownToJSX } from "markdown-to-jsx";
import * as blocks from "./blocks";

export const markdownOptions: MarkdownToJSX.Options = {
  overrides: {
    loading: {
      component: blocks.LoadingBlock,
    },
    pass: {
      component: blocks.PasswordBlock,
    },
    think: {
      component: blocks.ThinkBlock,
    },
  },
}
