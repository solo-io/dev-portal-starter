import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Table as MantineTable,
  TableProps as MantineTableProps,
} from "@mantine/core";

const StyledMantineTable = styled(MantineTable)(
  ({ theme }) => css`
    border: 1px solid ${theme.splashBlue};
    tr {
      padding: 0.4rem 0.6rem;
    }
    thead {
      background-color: ${theme.dropBlue};
      tr th {
        border-bottom: 1px solid ${theme.splashBlue};
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

// type TableProps = {};
// const Table = (props: MantineTableProps & TableProps) => {
const Table = (props: MantineTableProps) => {
  return <StyledMantineTable {...props}>{props.children}</StyledMantineTable>;
};

export default Table;
