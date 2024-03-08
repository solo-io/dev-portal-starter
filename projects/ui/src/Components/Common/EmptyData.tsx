import { css } from "@emotion/react";
import styled from "@emotion/styled";

const LoadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-bottom: 30px;

    // A pretty spinner while they wait...
    // .inner and .outer define the two circling balls, and
    //   their 'color's can be changed here.
    .loadingSpinner,
    .emptyCircle {
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 180px;
      height: 180px;

      .chasePlate {
        position: absolute;
        border-radius: 50%;
        border-style: solid;
        animation: animateCircles 3s linear infinite;

        &.outer {
          width: 100%;
          height: 100%;
          color: ${theme.primary};
          border-color: currentColor transparent transparent currentColor;
          border-width: 0.2em 0.2em 0em 0em;
          --deg: -45deg;
          animation-direction: normal;
        }

        &.inner {
          width: 65%;
          height: 65%;
          color: ${theme.secondary};
          border-color: currentColor currentColor transparent transparent;
          border-width: 0.2em 0em 0em 0.2em;
          --deg: -135deg;
          animation-direction: reverse;
        }

        .circle {
          position: absolute;
          width: 50%;
          height: 0.1em;
          top: 50%;
          left: 50%;
          background-color: transparent;
          transform: rotate(var(--deg));
          transform-origin: left;
        }

        .circle::before {
          position: absolute;
          top: -0.5em;
          right: -0.5em;
          content: "";
          width: 1em;
          height: 1em;
          background-color: currentColor;
          border-radius: 50%;
          box-shadow: 0 0 2em, 0 0 4em, 0 0 6em, 0 0 8em, 0 0 10em,
            0 0 0 0.5em rgba(255, 255, 0, 0.1);
        }
      }
    }
    .emptyCircle {
      .chasePlate {
        animation: animateCircles 1.3s linear;

        &.inner,
        &.outer {
          border-width: 0.2em;
          border-color: currentColor;
        }
        &.inner {
          --deg: -90deg;
        }
        &.outer {
          --deg: -90deg;
        }

        .circle::before {
          animation: shadowFade 1.5s ease-in;
          animation-fill-mode: forwards;
        }
      }
    }

    .loadingMessage,
    .emptyMainMessage,
    .emptyDetailsMessage {
      padding-top: 20px;
      text-align: center;
      font-size: 18px;
      font-weight: 500;

      color: ${theme.defaultColoredText};
    }
    .emptyDetailsMessage {
      padding-top: 8px;
      font-size: 16px;
      line-height: 20px;
      font-weight: 400;
    }
  `
);

export function EmptyData(
  props:
    | (
        | {
            topic: string;
          }
        | {
            topicMessageOverride: string;
          }
      ) & {
        message?: string;
      }
) {
  return (
    <LoadingContainer aria-hidden="true">
      <div className="emptyCircle">
        <div className="chasePlate outer">
          <div className="circle"></div>
        </div>
        <div className="chasePlate inner">
          <div className="circle"></div>
        </div>
      </div>
      {"topicMessageOverride" in props ? (
        <div className="emptyMainMessage">{props.topicMessageOverride}</div>
      ) : (
        <div className="emptyMainMessage">
          No {props.topic} results were found
        </div>
      )}
      {!!props.message && (
        <div className="emptyDetailsMessage">{props.message}</div>
      )}
    </LoadingContainer>
  );
}
