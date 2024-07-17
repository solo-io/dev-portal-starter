import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Flex, Pagination as MantinePagination, Select } from "@mantine/core";
import { useMemo, useState } from "react";

//
// Type
//

export interface CustomPaginationData<T> {
  pageSizeOptions: string[];
  paginatedData: T[];
  onCurPageChange: React.Dispatch<React.SetStateAction<number>>;
  curPage: number;
  pageSize: string;
  onPageSizeChange: (value: string | null) => void;
  totalPages: number;
  totalItems: number;
  pageOptions: PageOptions;
}

interface PageOptions {
  options: number[];
  defaultOptionIndex: number;
}

//
// Options
//

export const pageOptions: {
  fullPage: PageOptions;
  table: PageOptions;
} = {
  fullPage: {
    options: [3, 6, 12, 24],
    defaultOptionIndex: 1,
  },
  table: {
    options: [5, 10, 20],
    defaultOptionIndex: 0,
  },
};

//
// Hook
//

export function useCustomPagination<T>(
  data: T[],
  pageOptions: PageOptions
): CustomPaginationData<T> {
  const perPageText = " / Page";
  const [pageSize, setPageSize] = useState(
    pageOptions.options[pageOptions.defaultOptionIndex]
  );
  const [curPage, setCurPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIdx = (curPage - 1) * pageSize;
    const endIdx = curPage * pageSize;
    if (startIdx > data.length || startIdx < 0) {
      return [];
    }
    return data.slice(startIdx, endIdx);
  }, [data, curPage, pageSize]);

  return {
    pageSizeOptions: pageOptions.options.map((o) => o.toString() + perPageText),
    paginatedData,
    onCurPageChange: setCurPage,
    curPage,
    pageSize: pageSize.toString() + perPageText,
    onPageSizeChange: (value: string | null) => {
      if (!value) {
        return;
      }
      // Reset the cur page, and set the page size.
      setCurPage(1);
      setPageSize(Number.parseInt(value.replace(perPageText, "")));
    },
    totalPages: Math.ceil(data.length / pageSize),
    totalItems: data.length,
    pageOptions: pageOptions,
  };
}

//
// Styles
//

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

//
// Component
//

const CustomPagination = ({
  customPaginationData: {
    totalPages,
    curPage,
    onCurPageChange,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    totalItems,
    pageOptions,
  },
}: {
  customPaginationData: CustomPaginationData<any>;
}) => {
  // If there aren't enough items to be able to use pagination, don't show anything.
  if (pageOptions.options.length > 0 && totalItems <= pageOptions.options[0]) {
    return null;
  }
  return (
    <Flex align="center" justify={"space-between"} gap={"10px"}>
      <TotalText>Total: {totalItems}</TotalText>
      <Flex align="center" gap={"10px"}>
        <StyledMantinePagination
          total={totalPages}
          value={curPage}
          onChange={onCurPageChange}
        />
        <Select
          sx={{ width: "120px" }}
          value={pageSize}
          data={pageSizeOptions}
          onChange={onPageSizeChange}
        />
      </Flex>
    </Flex>
  );
};

export default CustomPagination;
