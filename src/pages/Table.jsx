import React, { useState, useEffect } from "react";

const Table = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/data/Xiaomi_Redmi_K70_Ultra_5G.json");
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Product Table</h1>
      <table border="1" cellPadding="10">
        <tbody>
          <tr>
            <td className="title">Thông số chi tiết</td>
            <td> info</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
