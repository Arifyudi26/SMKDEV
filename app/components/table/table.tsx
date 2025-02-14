import React from "react";
import { Table, Skeleton } from "antd";
import { DataType, TableComponentProps } from "@/app/lib/type";

const { Column } = Table;

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  columns,
  isLoading,
}) => {
  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  const dataWithKey = data.map((item, index) => ({
    ...item,
    key: item.key || index,
  }));

  return (
    <Table<DataType> dataSource={dataWithKey} pagination={false}>
      {columns.map((col, i) => (
        <Column
          key={i}
          title={col.title}
          dataIndex={col.dataIndex}
          render={col.render}
        />
      ))}
    </Table>
  );
};

export default TableComponent;
