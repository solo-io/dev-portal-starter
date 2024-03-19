import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Flex, Modal } from "@mantine/core";
import { colors } from "../colors";
import { borderRadiusConstants } from "../constants";
import { svgColorReplace } from "../utils";

// Note: The theme variable doesn't work here because the
// modal is generated outside of the emotion provider.
export namespace FormModalStyles {
  const modalDefaultPadding = "30px";

  export const CustomModal = styled(Modal)`
    // Resets the mantine modal extra styles.
    .mantine-Modal-content {
      border-radius: ${borderRadiusConstants.small};
      overflow: visible;
    }
    .mantine-Modal-body {
      display: contents;
    }
    .mantine-Modal-header {
      display: none;
    }
  `;

  export const HeaderContainer = styled(Flex)`
    padding: ${modalDefaultPadding};
    padding-bottom: 0px;
    gap: 0px;
    justify-content: space-between;
    // The close button
    button {
      margin-top: 10px;
      width: fit-content;
      height: fit-content;
      ${svgColorReplace(colors.aprilGrey)}
    }
  `;

  export const BodyContainerForm = styled.form`
    padding: ${modalDefaultPadding};
    padding-top: 0px;
    flex-direction: column;
    display: flex;
    gap: 20px;
  `;

  export const Title = styled.div`
    font-size: 1.7rem;
    padding-bottom: 3px;
  `;

  export const Subtitle = styled.div`
    font-size: 1rem;
    color: ${colors.septemberGrey};
  `;

  export const HorizLine = styled.div`
    width: 100%;
    height: 0px;
    border-top: 1px solid ${colors.aprilGrey};
    margin: 20px 0px;
  `;

  export const InputContainer = styled.div<{ grow?: boolean }>(
    ({ grow }) => css`
      label {
        font-size: 1.25rem;
        padding-bottom: 8px;
        display: block;
      }
      ${!!grow
        ? css`
            flex-grow: 1;
            select {
              flex-grow: 1;
            }
          `
        : ""}
    `
  );
}
