import { css } from "@emotion/react";
import styled from "@emotion/styled";
import hljs from "highlight.js";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { borderRadiusConstants } from "../../Styles/constants";

export const MarkdownOuterContainer = styled.div(
  ({ theme }) => css`
    padding: 30px;
    * {
      margin: revert;
      padding: revert;
      font-family: revert;
      font-weight: revert;
    }
    blockquote p {
      color: ${theme.augustGrey};
    }
    pre:has(code) {
      padding: 1rem 2rem;
      border-radius: ${borderRadiusConstants.small};
      width: 100%;
      background-color: #1c1b1b;
    }
    em {
      font-style: italic;
    }
    a {
      text-decoration: underline;
    }
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1.7rem;
    }
    h3 {
      font-size: 1.5rem;
    }
    h4 {
      font-size: 1.2rem;
    }
    h5 {
      font-size: 1rem;
    }
  `
);

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  const mdContainerRef = useRef<HTMLDivElement | null>(null);

  // Highlight the content when it's rendered.
  useEffect(() => {
    if (!markdown || !mdContainerRef.current) {
      return;
    }
    // Highlight each code element.
    // This is faster than doing `hljs.highlightAll()`.
    const codeElements = mdContainerRef.current.querySelectorAll("code");
    for (let i = 0; i < codeElements.length; i++) {
      hljs.highlightElement(codeElements[i]);
    }
    return () => {
      // If this "data-highlighted" attribute isn't reset, it may not
      // highlight the code correctly when the page is revisited.
      for (let i = 0; i < codeElements.length; i++) {
        codeElements[i]?.removeAttribute("data-highlighted");
      }
    };
  }, [markdown, mdContainerRef.current]);

  return (
    <MarkdownOuterContainer ref={mdContainerRef}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </MarkdownOuterContainer>
  );
};

export default MarkdownRenderer;
