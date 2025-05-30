import React from "react";

const TableInfor = ({ data }) => {
  if (!data) return <p>Không có dữ liệu hiển thị.</p>;

  return (
    <table className="table-infor">
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr className="table-row" key={key}>
            <td className="characteristic">{key.replaceAll("_", " ")}:</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableInfor;
