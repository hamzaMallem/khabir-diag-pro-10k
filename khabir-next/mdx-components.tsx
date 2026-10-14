import type { MDXComponents } from "mdx/types";

// Required by @next/mdx. Article typography is styled by components/blog/Prose.module.css,
// so the default HTML elements are used as they are.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
