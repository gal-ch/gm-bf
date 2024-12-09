import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Order } from "./OrdersTable";
import Icon from "./Icon";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import styled from "styled-components";
import IPageWrapper from "./IPageWrapper";
import { DropDownOptionListType, DropDownSelectOption } from "../types/Catalog";
import { BackOfficeApiService } from "../services/back-office-api.service";
import MultiSelect from "./MultiSelect";
import { set } from "date-fns";
import { useStore } from "../stores/StoreContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "./DateRangePicker";
import { useLocation } from "react-router-dom";

interface ProductPickup {
  productName: string;
  totalAmount: number;
}

const CollectionTable: React.FC = () => {
  const apiService = new BackOfficeApiService();
  const { backOfficeStore } = useStore();

  const [pickupData, setPickupData] = useState<ProductPickup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDistributionPoints, setSelectedDistributionPoints] = useState<
    DropDownOptionListType[]
  >([]);
  const [selectedProductNames, setSelectedProductNames] = useState<
    DropDownOptionListType[]
  >([]);

  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date() || ""
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date() || "");
  const location = useLocation();
  const accountUrl = location.pathname.split("/")[1];
  useEffect(() => {
    backOfficeStore.fetchProducts(accountUrl);
    backOfficeStore.fetchDistributionPoints();
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate, selectedDistributionPoints, selectedProductNames]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const filters = {
        distributionPoints: selectedDistributionPoints.map(
          (point) => point.value
        ),
        products: selectedProductNames.map((product) => product.value),
      };
      const ordersRecord: Record<number, Order[]> =
        await apiService.orders.getOrders(
          startDate?.toLocaleDateString() || "",
          endDate?.toLocaleDateString() || "",
          filters
        );
      const productPickupMap: { [productName: string]: number } = {};
      const orders: Order[] = Object.values(ordersRecord).flat();
      orders.forEach((order) => {
        order.details.forEach((detail) => {
          if (productPickupMap[detail.productName]) {
            productPickupMap[detail.productName] += detail.amount;
          } else {
            productPickupMap[detail.productName] = detail.amount;
          }
        });
      });

      const aggregatedData = Object.keys(productPickupMap).map(
        (productName) => ({
          productName,
          totalAmount: productPickupMap[productName],
        })
      );

      setPickupData(aggregatedData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onExport = async () => {
    setIsLoading(true);
    try {
      const today = dayjs().format("DD/MM/YYYY");
      const filters = {
        distributionPoints: selectedDistributionPoints.map(
          (point) => point.value
        ),
        products: selectedProductNames.map((product) => product.value),
      };
      const report = await apiService.orders.exportReport(
        startDate?.toLocaleDateString() || "",
        endDate?.toLocaleDateString() || "",
        filters
      );
      if (typeof report !== "string" || !/^[A-Za-z0-9+/=]+$/.test(report)) {
        throw new Error("Invalid base64 string received");
      }
      const blob = Uint8Array.from(atob(report), (c) => c.charCodeAt(0));
      saveAs(new Blob([blob]), `orders-Cash-${today}.xlsx`);
    } catch (error: any) {
      console.error(`failed export report: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Icon
        style={{ icon: { width: "24px", cursor: "pointer" } }}
        type="export"
        onClick={onExport}
      />
      <ButtonsNav>
        <div>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
        <FilterWrapper>
          <MultiSelect
            label="בחר מוצרים"
            selectedOptions={selectedProductNames}
            options={backOfficeStore.products.map((product) => ({
              value: product.id,
              label: product.name,
            }))}
            onChange={(options) => setSelectedProductNames(options)}
          />
          <MultiSelect
            label="בחר נקודות איסוף"
            selectedOptions={selectedDistributionPoints}
            options={backOfficeStore.distributionPoints.map((point) => ({
              value: point.id,
              label: point.name,
            }))}
            onChange={(options) => setSelectedDistributionPoints(options)}
          />
        </FilterWrapper>
      </ButtonsNav>
      <TabWrapper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם מוצר</TableCell>
                <TableCell>כמות כוללת</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                pickupData.map((product) => (
                  <TableRow key={product.productName}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.totalAmount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabWrapper>
    </PageWrapper>
  );
};
const PageWrapper = styled(IPageWrapper)`
  height: calc(100% - 24px);
  min-height: 700px;
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
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 12px 16px;
  border-radius: 8px;
`;

const ExportIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0f7fa;
  cursor: pointer;
`;
const FilterWrapper = styled.label`
  display: flex;
  width: 500px;
  gap: 16px;
`;

export default CollectionTable;
