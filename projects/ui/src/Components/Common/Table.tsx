import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Table as MantineTable,
  TableProps as MantineTableProps,
} from "@mantine/core";
import { borderRadiusConstants } from "../../Styles/constants";

const StyledMantineTable = styled(MantineTable)(
  ({ theme }) => css`
    overflow: auto;
    thead {
      background-color: ${theme.dropBlue};
      tr th {
        border-bottom: 1px solid ${theme.splashBlue};
        padding: 10px;
      }
    }
    tbody {
      background-color: white;
      tr {
        position: relative;
        &:after {
          content: "";
          position: absolute;
          left: 0.6rem;
          right: 0.6rem;
          bottom: -0.5px;
          border-bottom: 1px solid ${theme.splashBlue};
        }
        td {
          text-align: left;
          border-color: transparent;
          padding: 0.4rem 0.6rem;
        }
      }
    }
  `
);

const StyledTableContainer = styled.div(
  ({ theme }) => css`
    border: 1px solid ${theme.splashBlue};
    border-radius: ${borderRadiusConstants.small};
    overflow: hidden;
  `
);

// type TableProps = {};
// const Table = (props: MantineTableProps & TableProps) => {
const Table = (props: MantineTableProps) => {
  return (
    <StyledTableContainer>
      <StyledMantineTable {...props}>{props.children}</StyledMantineTable>
    </StyledTableContainer>
  );
};

export default Table;
