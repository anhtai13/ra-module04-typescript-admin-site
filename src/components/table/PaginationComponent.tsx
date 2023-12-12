import React, { useState } from "react";
import { Pagination } from "react-bootstrap";

export const NUMBER_RECORDS_PER_PAGE = 5;

interface PaginationProps {
  total: number;
  setPage: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ total, setPage }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPage: number = Math.ceil(total / NUMBER_RECORDS_PER_PAGE);

  const handleChangePage = (pageNumber: number): void => {
    const page: number = parseInt(pageNumber.toString());

    setCurrentPage(page);
    setPage(page);
  };

  const items: JSX.Element[] = [];

  for (let pageNumber = 1; pageNumber <= totalPage; pageNumber++) {
    const item: JSX.Element = (
      <Pagination.Item
        key={pageNumber}
        onClick={() => handleChangePage(pageNumber)}
        active={pageNumber === currentPage}
      >
        {pageNumber}
      </Pagination.Item>
    );

    items.push(item);
  }

  return (
    <>
      <Pagination className="float-end">
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => handleChangePage(1)}
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handleChangePage(currentPage - 1)}
        />

        {items.map((item) => item)}

        <Pagination.Next
          disabled={currentPage === totalPage}
          onClick={() => handleChangePage(currentPage + 1)}
        />
        <Pagination.Last
          disabled={currentPage === totalPage}
          onClick={() => handleChangePage(totalPage)}
        />
      </Pagination>
      <p className="float-end mx-3">
        <strong>Tổng số bản ghi:</strong> {total}
      </p>
    </>
  );
};

export default PaginationComponent;
