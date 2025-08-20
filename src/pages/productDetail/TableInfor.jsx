import React from "react";

const TableInfor = ({ data }) => {
  if (!data) return <p>Không có dữ liệu hiển thị.</p>;

  return (
    <table className="table-infor">
      <tbody>
        {data?.map((item, index) => (
          <tr className="table-row" key={index}>
            <td className="characteristic">{item.label}:</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableInfor;
