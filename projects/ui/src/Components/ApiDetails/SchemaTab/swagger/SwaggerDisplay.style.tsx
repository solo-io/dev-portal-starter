import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { contentWidth } from "../../../../Styles/ContentWidthHelpers";
import { borderRadiusConstants } from "../../../../Styles/constants";
import { makeStyledButtonCSS } from "../../../Common/Button";

/*
*   EXPLANATION OF div[id^="display-swagger"]
      First, WHAT IS IT?  Our SwaggerDisplay component relies on
      this ID to both connect and update the component. This is the 
      prefix we provide, where the suffix is based on the schema
      being displayed.


      Second, WHY? Swagger does not currently offer a way to modify 
      their css. Importing their styling means competing 
      specificity, and this makes it easier to do that.

      Alternatives might include seemingly arbitrary swagger classes 
      to bump specifity or throwing !important on to everything.
*/

export const SwaggerDisplayContainer = styled.div(
  ({ theme }) => css`
    display: contents;
    div[id^="display-swagger"] {
      width: 100%;

      .swagger-ui {
        .wrapper {
          max-width: ${contentWidth.wide};

          &.information-container {
            background: white;
            padding: 10px 20px;

            .info {
              margin: 15px 0;
            }
          }
        }

        .btn {
          ${makeStyledButtonCSS(theme)}
          height: 26px;
          line-height: 26px;

          span {
            padding: 0;
          }

          svg {
            display: inline-block;
            width: 14px;
            height: 14px;
            margin-left: 4px;

            * {
              fill: white;
            }
          }
        }

        .parameter__name.required span,
        .parameter__name.required:after {
          font-size: 14px;
          color: ${theme.midRed} !important;
        }
        .parameter__name.required:after {
          top: -3px;
          padding: 0 0 0 2px;
        }

        .opblock {
          background-color: white;
          border-color: ${theme.defaultAction};

          .opblock-summary {
            border-color: ${theme.defaultAction};

            .opblock-summary-method {
              border-radius: ${borderRadiusConstants.small};
              margin-top: 0;
              padding: 0;
              width: 58px;
              min-width: 58px;
              height: 24px;
              font-size: 14px;
              font-weight: 600;

              background-color: ${theme.defaultAction};
            }
          }
          .opblock-body .tab-header .tab-item.active h4 span:after {
            background-color: ${theme.defaultAction};
          }

          &.opblock-delete {
            .opblock-summary {
              border-color: ${theme.deleteAction};
              .opblock-summary-method {
                background-color: ${theme.deleteAction};
              }
            }
            .opblock-body {
              .tab-header .tab-item.active h4 span:after {
                background-color: ${theme.deleteAction};
              }
            }
          }
          &.opblock-get {
            .opblock-summary {
              border-color: ${theme.getAction};
              .opblock-summary-method {
                background-color: ${theme.getAction};
              }
            }
            .opblock-body {
              .tab-header .tab-item.active h4 span:after {
                background-color: ${theme.getAction};
              }
            }
          }
          &.opblock-hook {
            .opblock-summary {
              border-color: ${theme.eventAction};
              .opblock-summary-method {
                background-color: ${theme.eventAction};
              }
            }
            .opblock-body {
              .tab-header .tab-item.active h4 span:after {
                background-color: ${theme.eventAction};
              }
            }
          }
          &.opblock-post {
            .opblock-summary {
              border-color: ${theme.postAction};
              .opblock-summary-method {
                background-color: ${theme.postAction};
              }
            }
            .opblock-body {
              .tab-header .tab-item.active h4 span:after {
                background-color: ${theme.postAction};
              }
            }
          }
          &.opblock-put {
            .opblock-summary {
              border-color: ${theme.putAction};
              .opblock-summary-method {
                background-color: ${theme.putAction};
              }
            }
            .opblock-body {
              .tab-header .tab-item.active h4 span:after {
                background-color: ${theme.putAction};
              }
            }
          }

          &.opblock-deprecated {
            border-color: ${theme.marchGrey};
            background-color: hsla(0, 0%, 92%, 0.1);

            .opblock-summary {
              border-color: black;
              .opblock-summary-method {
                background-color: black;
              }
            }
            .opblock-body .tab-header .tab-item.active h4 span:after {
              background-color: black;
            }
          }
        }

        //
        // Fixes some interaction issues with buttons in the main opblock sections.
        // And makes it clearer when something is a button.
        //
        .opblock-summary {
          padding: 0px;
          > button {
            padding: 5px;
          }
        }
        div.copy-to-clipboard,
        .opblock-tag-section h3.opblock-tag,
        a,
        button:not(:disabled),
        select:not(:disabled) {
          outline-offset: 2px;
          &:hover,
          &:focus,
          &:focus-visible {
            outline: 1px solid ${theme.primary};
          }
          &:active {
            outline: 2px solid ${theme.primary};
            box-shadow: 0 0 5px ${theme.primary};
          }
        }
      }

      //
      // Fixes some of the layout in the Models section.
      // width: 100% makes the expand buttons easier to find.
      //
      section.models {
        position: relative;
        .model-container > .model-box {
          padding: 5px;
        }
        .model-box {
          > button > .model-toggle.collapsed {
            position: absolute;
            top: 30px;
            right: 15px;
            margin-top: -10px;
          }
          width: 100%;
          button.model-box-control {
            width: 100%;
          }
          .model-toggle {
            float: right;
            margin-top: -2px;
          }
        }
      }
    }
  `
);
