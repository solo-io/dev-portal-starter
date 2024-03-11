import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Flex,
  Pagination as MantinePagination,
  PaginationProps as MantinePaginationProps,
} from "@mantine/core";
import { useMemo, useState } from "react";

/**
 * This improves on Mantine's usePagination hook and returns the paginated data slice
 * as well as the props needed for the following `Pagination` component.
 **/
export const usePagination = (data: undefined | any[], pageSize = 5) => {
  const [curPage, setCurPage] = useState(1);
  const totalPages = Math.ceil((data?.length ?? 0) / pageSize);
  // Mantine Pagination starts at 1, so (curPage-1) gets the 0-based page index here.
  const startIdx = (curPage - 1) * pageSize;
  const endIdx = Math.min(data?.length ?? 0, startIdx + pageSize);

  const paginatedDataSlice = useMemo(() => {
    return data?.slice(startIdx, endIdx);
  }, [data, curPage]);

  return {
    paginatedDataSlice,
    curPage,
    onPageChange: setCurPage,
    totalPages,
    startIdx,
    endIdx,
  };
};

const StyledMantinePagination = styled(MantinePagination)(
  ({ theme }) => css`
    * {
      border-color: ${theme.splashBlue};
      color: ${theme.neptuneBlue};
    }
    button[data-active="true"],
    button[data-active="true"]:hover {
      border: 1px solid ${theme.lakeBlue} !important;
      color: ${theme.lakeBlue} !important;
      background-color: white !important;
    }
  `
);

const TotalText = styled.div(
  ({ theme }) => css`
    font-size: 0.9rem;
    color: ${theme.augustGrey};
  `
);

const StyledPaginationContainer = styled(Flex)`
  align-items: center;
  display: flex;
  padding: 0.6rem;
  justify-content: space-between;
`;

type PaginationProps = {
  dataCount: number;
  totalPages: MantinePaginationProps["total"];
  onChange: MantinePaginationProps["onChange"];
};
const Pagination = ({ dataCount, totalPages, onChange }: PaginationProps) => {
  return (
    <StyledPaginationContainer>
      <TotalText>Total: {dataCount}</TotalText>
      <StyledMantinePagination total={totalPages} onChange={onChange} />
    </StyledPaginationContainer>
  );
};

export default Pagination;
