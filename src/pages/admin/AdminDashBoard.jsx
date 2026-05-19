import { useEffect, useState } from "react";
import { Card, Select, Row, Col, Statistic, Spin } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  TrophyOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import {
  getDashboard,
  getBestselling,
  // getProductInventoryReport,
  getTotalUser,
} from "../../api/dashboard";

const AdminDashboard = () => {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardUser, setDashboardUser] = useState(null);
  const [bestSellingData, setBestSellingData] = useState(null);
  const [productInventoryReport, setProductInventoryReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (selectedYear) queryParams.append("year", selectedYear.toString());
      if (selectedMonth) queryParams.append("month", selectedMonth.toString());

      const [
        dashboardResponse,
        bestSellingResponse,
        // inventoryReportResponse,
        totalUserRes,
      ] = await Promise.all([
        getDashboard(queryParams.toString()),
        getBestselling(),
        // getProductInventoryReport(queryParams.toString()),
        getTotalUser(),
      ]);

      setDashboardData(dashboardResponse);
      setBestSellingData(bestSellingResponse);
      // setProductInventoryReport(inventoryReportResponse);
      setDashboardUser(totalUserRes);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear, selectedMonth]);

  const transformDataForCharts = () => {
    if (!dashboardData?.revenueStats) return [];

    return dashboardData.revenueStats.map((item) => {
      if (selectedMonth) {
        // Daily data
        return {
          day: new Date(item.date).getDate(),
          revenue: Number.parseFloat(item.dailyRevenue || 0),
          orders: Number.parseInt(item.dailyOrders || 0),
        };
      } else {
        // Monthly data
        const monthNames = [
          "T1",
          "T2",
          "T3",
          "T4",
          "T5",
          "T6",
          "T7",
          "T8",
          "T9",
          "T10",
          "T11",
          "T12",
        ];
        return {
          day: monthNames[item.month - 1],
          revenue: Number.parseFloat(item.monthlyRevenue || 0),
          orders: Number.parseInt(item.monthlyOrders || 0),
        };
      }
    });
  };

  const transformBestSellingData = () => {
    if (!bestSellingData?.topProducts) return [];

    return bestSellingData.topProducts.slice(0, 8).map((product, index) => ({
      name: product.productName,
      code: product.productCode,
      totalSold: product.totalSold,
      fill: `hsl(${(index * 45) % 360}, 70%, 50%)`,
    }));
  };

  const chartData = transformDataForCharts();
  const bestSellingChartData = transformBestSellingData();

  const totalRevenue = dashboardData?.totalRevenue || 0;
  const totalOrders = dashboardData?.totalOrders || 0;
  const avgRevenue = dashboardData?.averageMonthlyRevenue || 0;

  const totalProductsRemaining =
    productInventoryReport?.totalRemainingProducts ??
    productInventoryReport?.remainingStock ??
    productInventoryReport?.availableQuantity ??
    0;
  const totalProductsSold =
    productInventoryReport?.totalSoldProducts ??
    productInventoryReport?.soldQuantity ??
    productInventoryReport?.totalSold ??
    0;

  const monthOptions = [
    { value: null, label: "Tất cả tháng" },
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i;
    return { value: year, label: `Năm ${year}` };
  });

  const CustomRevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "12px",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
            {selectedMonth ? `Ngày ${label}` : `${label}`}
          </p>
          <p style={{ margin: "0", color: "#1890ff" }}>
            Doanh thu: {data.revenue?.toLocaleString("vi-VN")} ₫
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomOrdersTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "12px",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
            {selectedMonth ? `Ngày ${label}` : `${label}`}
          </p>
          <p style={{ margin: "0", color: "#52c41a" }}>
            Đơn hàng: {data.orders?.toLocaleString("vi-VN")}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomCombinedTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "12px",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
            {selectedMonth ? `Ngày ${label}` : `${label}`}
          </p>
          <p style={{ margin: "0 0 4px 0", color: "#1890ff" }}>
            Doanh thu: {data.revenue?.toLocaleString("vi-VN")} ₫
          </p>
          <p style={{ margin: "0", color: "#52c41a" }}>
            Đơn hàng: {data.orders?.toLocaleString("vi-VN")}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBestSellingTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "12px",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>{data.name}</p>
          <p
            style={{ margin: "0 0 4px 0", color: "#8c8c8c", fontSize: "12px" }}
          >
            Mã: {data.code}
          </p>
          <p style={{ margin: "0", color: "#1890ff" }}>
            Đã bán: {data.totalSold?.toLocaleString("vi-VN")} sản phẩm
          </p>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            textAlign: "center",
            paddingTop: "100px",
          }}
        >
          <Card>
            <p style={{ color: "#ff4d4f", fontSize: "16px" }}>{error}</p>
            <button onClick={fetchDashboardData} style={{ marginTop: "16px" }}>
              Thử lại
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#262626",
                }}
              >
                Dashboard Quản Trị
              </h1>
              <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
                Theo dõi doanh thu và sản phẩm bán chạy
              </p>
            </Col>

            <Col>
              <div style={{ display: "flex", gap: "12px" }}>
                <Select
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  options={monthOptions}
                  style={{ width: 140 }}
                  placeholder="Chọn tháng"
                />
                <Select
                  value={selectedYear}
                  onChange={setSelectedYear}
                  options={yearOptions}
                  style={{ width: 120 }}
                  placeholder="Chọn năm"
                />
              </div>
            </Col>
          </Row>
        </div>

        <Spin spinning={loading}>
          <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
            <Col xs={24} md={6}>
              <Card>
                <Statistic
                  title="Tổng Doanh Thu"
                  value={totalRevenue}
                  formatter={(value) => `${value?.toLocaleString("vi-VN")} ₫`}
                  prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                />
              </Card>
            </Col>

            <Col xs={24} md={6}>
              <Card>
                <Statistic
                  title="Tổng Đơn Hàng"
                  value={totalOrders}
                  formatter={(value) => value?.toLocaleString("vi-VN")}
                  prefix={<ShoppingOutlined style={{ color: "#1890ff" }} />}
                />
              </Card>
            </Col>

            <Col xs={24} md={6}>
              <Card>
                <Statistic
                  title={
                    selectedMonth ? "Doanh Thu TB/Ngày" : "Doanh Thu TB/Tháng"
                  }
                  value={avgRevenue}
                  formatter={(value) => `${value?.toLocaleString("vi-VN")} ₫`}
                  prefix={<BarChartOutlined style={{ color: "#722ed1" }} />}
                />
              </Card>
            </Col>

            <Col xs={24} md={6}>
              <Card>
                <Statistic
                  title="Tổng người dùng"
                  value={dashboardUser?.total}
                  prefix={
                    <UsergroupDeleteOutlined style={{ color: "#1890ff" }} />
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="Số sản phẩm còn lại"
                  value={totalProductsRemaining}
                  formatter={(value) => value?.toLocaleString("vi-VN")}
                  prefix={<TrophyOutlined style={{ color: "#fa8c16" }} />}
                />
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="Tổng sản phẩm đã bán"
                  value={totalProductsSold}
                  formatter={(value) => value?.toLocaleString("vi-VN")}
                  prefix={<ShoppingOutlined style={{ color: "#eb2f96" }} />}
                />
              </Card>
            </Col>
          </Row> */}

          <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  selectedMonth ? "Doanh Thu Theo Ngày" : "Doanh Thu Theo Tháng"
                }
                extra={
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    {selectedMonth
                      ? `Biểu đồ cột doanh thu hàng ngày trong tháng ${selectedMonth}/${selectedYear}`
                      : `Biểu đồ cột doanh thu theo tháng trong năm ${selectedYear}`}
                  </span>
                }
              >
                <div style={{ height: "320px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip content={<CustomRevenueTooltip />} />
                      <Bar
                        dataKey="revenue"
                        fill="#1890ff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  selectedMonth
                    ? "Số Đơn Hàng Theo Ngày"
                    : "Số Đơn Hàng Theo Tháng"
                }
                extra={
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    {selectedMonth
                      ? `Biểu đồ đường số lượng đơn hàng hàng ngày trong tháng ${selectedMonth}/${selectedYear}`
                      : `Biểu đồ đường số lượng đơn hàng theo tháng trong năm ${selectedYear}`}
                  </span>
                }
              >
                <div style={{ height: "320px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomOrdersTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#52c41a"
                        strokeWidth={3}
                        dot={{ fill: "#52c41a", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title="Top Sản Phẩm Bán Chạy"
                extra={
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    Biểu đồ cột các sản phẩm bán chạy nhất - Dễ nhìn và trực
                    quan
                  </span>
                }
              >
                <div style={{ height: "450px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bestSellingChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, angle: -45, textAnchor: "end" }}
                        height={80}
                        interval={0}
                        tickFormatter={(value) =>
                          value.length > 12
                            ? `${value.substring(0, 12)}...`
                            : value
                        }
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.toLocaleString("vi-VN")}
                      />
                      <Tooltip content={<CustomBestSellingTooltip />} />
                      <Bar
                        dataKey="totalSold"
                        radius={[8, 8, 0, 0]}
                        fill="url(#colorGradient)"
                      />
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#fa8c16"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ffd666"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default AdminDashboard;
