import React from "react";
import { Pagination } from "antd";
import { PaginationProps } from "@/app/lib/type";

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize = 10,
  onChange,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onChange}
      />
    </div>
  );
};

export default PaginationComponent;
