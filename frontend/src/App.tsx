import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Catalog from "./pages/Catalog";
import styled from "styled-components";
import NavBar from "./components/NavBar";
import Cart, { OrderDetails } from "./pages/Cart";
import AdminSettings from "./pages/AdminSettings/AdminSettings";
import { StoreProvider, useStore } from "./stores/StoreContext";
import dayjs from "dayjs";
import { AppApiService } from "./services/app-api.service";
import { BackOfficeLogin } from "./pages/backOfficeLogin/BackOfficeLogin";
import SiteDetailsModal from "./components/SiteDetailsModal";
import { AuthProvider } from "./context/AuthContext";
import Registration from "./pages/backOfficeLogin/BackOfficeSignin";
import SelectDistributionPointModal from "./components/SelectDistributionPointModal";
import { Button } from "@mui/material";
import "./types/variables.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotFound } from "./components/NotFound";
import { Store } from "./components/DistributionPointsTable";
import CheckoutSummary from "./components/CheckoutSummery";
const App: React.FC = () => {
  const apiService = new AppApiService();
  const [name, setName] = useState<string | undefined>(undefined);
  const location = useLocation();
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [freeTextModal, setFreeTextModal] = useState<string>("");
  const [freeTextIsOpen, setFreeTextIsOpen] = useState<boolean>(false);
  const accountUrl = location.pathname.split("/")[1];
  const isBackOffice = location.pathname === `/${accountUrl}/admin-settings`;
  const [showDistributionPointButton, setShowDistributionPointButton] =
    useState(false);
  const [showDistributionPointModal, setShowDistributionPointModal] =
    useState(false);
  const [distributionPoints, setDistributionPoints] = useState<Store[]>([]);
  const [checkoutDetails, setCheckoutDetails] = useState<OrderDetails>();
  const [accountHeadImg, setAccountHeadImg] = useState<string>("");

  const { productStore } = useStore();
  useEffect(() => {
    if (location.pathname !== "/login") getSiteDetailsSettings();

    setShowDistributionPointButton(
      ![`/${accountUrl}/admin-settings`, "/login"].includes(location.pathname)
    );
  }, [location.pathname]);

  useEffect(() => {
    handelDistributionPoint();
  }, []);

  const handelDistributionPoint = async () => {
    const distributionPoint = JSON.parse(
      localStorage.getItem("distributionPoint") || "{}"
    );
    const activePoints = await apiService.stores.getStores(accountUrl)
    const activePointsIds = activePoints.map((point) => point.id);
    setDistributionPoints(activePoints);
    if (isBackOffice) {
      setShowDistributionPointModal(false);
    } else if (
      !activePointsIds.includes(distributionPoint.id) ||
      !distributionPoint.status
    ) {
      localStorage.removeItem("distributionPoint")  
      setShowDistributionPointModal(true);
    } else {
      const showDistributionPointModal =
        Object.keys(localStorage.getItem("distributionPoint") || {}).length ===
          0 && !isBackOffice;
      setShowDistributionPointModal(showDistributionPointModal);
    }
    if (!showDistributionPointModal || location.pathname !== "/login") {
      productStore?.removeAllProductsFromCart();
    }
  };

  const getSiteDetailsSettings = async () => {
    const { settings, headImg } =
      (await apiService.account.getAccountByUrl(accountUrl)) || {};
    const a = (await apiService.account.getAccountByUrl(accountUrl))
    console.log(a, 'a');
    
    const today = dayjs();
    const todayHour = today.hour();
    const isClosed =
      !isBackOffice &&
      today.isAfter(dayjs(settings?.closingDate)) &&
      todayHour > +settings?.closingHour;
    setIsClosed(isClosed);
    setFreeTextModal(settings?.freeText || "");
    setFreeTextIsOpen(!!settings?.freeText);    
    setAccountHeadImg(headImg || "");
    const isApp = !isBackOffice;
    setName(settings?.name);
    if (
      settings?.closingDate &&
      today > dayjs(settings?.closingDate) &&
      todayHour > +settings?.closingHour &&
      isApp
    ) {
      return;
    }
  };

  const onChangeDistributionPoint = () => {
    productStore?.removeAllProductsFromCart();
  };

  return (
    <AuthProvider>
      <StoreProvider>
        <PageWrapper>
          <NavBar accountUrl={accountUrl} />
          <SiteHeader />
          <ImageWrapper>
            <img
              src={accountHeadImg || require("./assets/images/main.jpg")}
              className="top-image"
              alt="Main"
            />
            <h2>{name}</h2>
          </ImageWrapper>
          {showDistributionPointButton && (
            <Button onClick={() => setShowDistributionPointModal(true)}>
              שנה נקודת חלוקה
            </Button>
          )}

          <SiteDetailsModal
            isOpen={freeTextIsOpen && !isBackOffice}
            onClose={() => setFreeTextIsOpen(false)}
            modalText={freeTextModal}
          />

          <SelectDistributionPointModal
            hasDistributionPoint={showDistributionPointModal}
            isOpen={showDistributionPointModal}
            onClose={() => setShowDistributionPointModal(false)}
            onChangeDistributionPoint={onChangeDistributionPoint}
            distributionPoints={distributionPoints}
          />

          <Overlay isOpen={isClosed}>
            {isClosed && "האתר סגור כעת, אנא נסו שנית במועד מאוחר יותר"}
          </Overlay>

          <Routes>
            <Route path="/login" element={<BackOfficeLogin />} />
            <Route path="/register" element={<Registration />} />
            <Route
              path={`/${accountUrl}/cart`}
              element={<Cart handelOnCheckout={setCheckoutDetails}/>}
            />
            <Route
              path={`/${accountUrl}/checkout-summary`}
              element={
                <CheckoutSummary
                checkoutDetails={checkoutDetails || {} as OrderDetails}                />
              }
            />
            <Route path={`/${accountUrl}`} element={<Catalog />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path={`${accountUrl}/admin-settings`}
                element={<AdminSettings />}
              />
            </Route>
            <Route path="*" element={<NotFound />} /> {/* Add a fallback */}
          </Routes>
        </PageWrapper>
      </StoreProvider>
    </AuthProvider>
  );
};

const PageWrapper = styled.div`
  background-color: #837e7241;
  position: relative;
  h3,
  h2,
  p,
  label,
  text {
    color: var(--text-color);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  text-align: center;

  .top-image {
    height: 300px;
    width: 100%;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }

  h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 2rem;
    z-index: 2;
  }
`;

const SiteHeader = styled.div``;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  text-align: center;
`;

export default App;
