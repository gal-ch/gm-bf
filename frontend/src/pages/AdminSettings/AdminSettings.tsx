import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProductTable from "../../components/ProductTable";
import Settings from "./Settings";
import DistributionPointsTable, {
  Store,
} from "../../components/DistributionPointsTable";
import OrdersTable from "../../components/OrdersTable";
import CollectionTable from "../../components/CollectionTable";
import { useStore } from "../../stores/StoreContext";
import EndOfDayModal from "../../components/EndOfDayModal";
import { useLocation } from "react-router-dom";

const AdminSettings = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { backOfficeStore } = useStore();
  const [
    isClosingDistributionPointModalOpen,
    setIsClosingDistributionPointModalOpen,
  ] = useState(false);
  const [todayDistributionPoint, setTodayDistributionPoint] = useState<Store[]>(
    []
  );
  const location = useLocation();
  const accountUrl = location.pathname.split("/")[1];

  useEffect(() => {
    getTodayDistributionPoints();
  }, []);

  const getTodayDistributionPoints = async () => {
    await backOfficeStore.fetchOpenDistributionPoints();
    const getDaysMap: Record<string, string> = {
      ראשון: "Sunday",
      שני: "Monday",
      שלישי: "Tuesday",
      רביעי: "Wednesday",
      חמישי: "Thursday",
      שישי: "Friday",
      שבת: "Saturday",
    } as Record<string, string>;
    const openDistributionPoints =
      backOfficeStore.openDistributionPoints?.filter(
        (point) =>
          dayjs().format("dddd") === getDaysMap[point.closingDay] &&
          point.status
      );

    setTodayDistributionPoint(openDistributionPoints || []);
    setIsClosingDistributionPointModalOpen(openDistributionPoints?.length > 0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <Settings />;
      case 1:
        return <ProductTable />;
      case 2:
        return <OrdersTable />;
      case 3:
        return <CollectionTable />;
      case 4:
        return <DistributionPointsTable />;
      default:
        return null;
    }
  };

  return (
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
          <Tab label="הגדרות" />
          <Tab label="מוצרים" />
          <Tab label="הזמנות" />
          <Tab label="ליקוטים" />
          <Tab label="נקודות חלוקה" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>{renderContent()}</Box>

      <EndOfDayModal
        isOpen={isClosingDistributionPointModalOpen}
        onClose={() => setIsClosingDistributionPointModalOpen(false)}
        todayDistributionPoint={todayDistributionPoint}
      />
    </Box>
  );
};

export default AdminSettings;
