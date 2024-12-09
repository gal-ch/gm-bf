import React, { useEffect, useState } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Tab,
  Tabs,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import IPageWrapper from "./IPageWrapper";
import styled from "styled-components";
import { Store } from "./DistributionPointsTable";
import Icon from "./Icon";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { BackOfficeApiService } from "../services/back-office-api.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "./DateRangePicker";

export type Order = {
  id: number | null;
  client: string;
  details: { productName: string; amount: number; price: number }[];
  store: Store | null;
  createAt: string;
  clientPhoneNumber: number;
};

type OrderRow = {
  total: number;
  id: number | null;
  client: string;
  phone: number;
  date: string;
};

const OrdersTable = () => {
  const [orders, setOrders] = useState<Record<number, Order[]>>({});
  const [distributionPoints, setDistributionPoints] = useState<Store[]>([]);
  const apiService = new BackOfficeApiService();
  const [selectedTab, setSelectedTab] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    getStores();
    getOrdersByStore();
  }, [selectedTab, startDate, endDate]); // Re-fetch orders when the tab or date range changes

  const getStores = async () => {
    const points = await apiService.stores.getStores();
    setDistributionPoints(points);
  };

  const getOrdersByStore = async () => {
    setIsLoading(true); // Show loading spinner
    try {
      const orders = await apiService.orders.getOrders(
        startDate?.toLocaleDateString() || "",
        endDate?.toLocaleDateString() || "",
        null
      );

      setOrders(orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const onExport = async () => {
    setIsLoading(true);
    try {
      const today = dayjs().format("DD/MM/YYYY");
      const report = await apiService.orders.exportReport(
        startDate?.toLocaleDateString() || "",
        endDate?.toLocaleDateString() || "",
        null,
        selectedTab
      );
      if (typeof report !== "string" || !/^[A-Za-z0-9+/=]+$/.test(report)) {
        throw new Error("Invalid base64 string received");
      }
      const blob = Uint8Array.from(atob(report), (c) => c.charCodeAt(0));
      saveAs(new Blob([blob]), `orders-Cash-${today}.xlsx`);
    } catch (error: any) {
      console.error(`Failed to export report: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTable = (orders: Order[]) => {
    const productNames = Array.from(
      new Set(
        orders.flatMap((order) =>
          order.details.map((detail) => detail.productName)
        )
      )
    );

    const rows: Record<string, any>[] = orders.map((order) => {
      const productData = productNames.reduce((acc, productName) => {
        const product = order.details.find(
          (p) => p.productName === productName
        );
        acc[productName] = product ? product.amount : 0;
        return acc;
      }, {} as Record<string, number>);

      const total = order.details.reduce(
        (sum, product) => sum + product.amount * product.price,
        0
      );

      return {
        id: order.id,
        client: order.client,
        phone: order.clientPhoneNumber,
        date: dayjs(order.createAt).format("DD/MM/YYYY"),
        ...productData,
        total,
      };
    });

    return { productNames, rows };
  };

  const renderContent = () => {
    const { productNames, rows } = generateTable(orders[selectedTab] || []);
    return (
      <TabWrapper>
        <ButtonsNav>
          <Icon
            style={{ icon: { width: "24px", cursor: "pointer" } }}
            type="export"
            onClick={onExport}
          />
        </ButtonsNav>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell>סה"כ</TableCell>
                {productNames.map((productName) => (
                  <TableCell key={productName}>{productName}</TableCell>
                ))}
                <TableCell>טלפון</TableCell>
                <TableCell>לקוח</TableCell>
                <TableCell>תאריך</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.total}</TableCell>

                  {productNames.map((productName) => (
                    <TableCell key={productName}>{row[productName]}</TableCell>
                  ))}
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.client}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabWrapper>
    );
  };

  return (
    <PageWrapper>
      {/* <Icon
        style={{ icon: { width: "24px", cursor: "pointer" } }}
        type="export"
        onClick={onExport}
      /> */}

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="admin settings tabs"
          >
            {distributionPoints?.map((point) => (
              <Tab key={point.id} value={point.id} label={point.name} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>{renderContent()}</Box>
      </Box>
    </PageWrapper>
  );
};

const PageWrapper = styled(IPageWrapper)`
  height: calc(100% - 24px);
  overflow: auto;
  th,
  td {
    text-align: right;
    width: fit-content;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: end;
`;

const ButtonsNav = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

const DateRangePickerWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px; /* Space between date pickers */
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  color: #555;
  display: block;
`;
export default OrdersTable;
