import React, { createContext, useContext, useState } from "react";
import { ProductStore, CartItem } from "./ProductStore";
import { BackOfficeStore } from "./BackOfficeStore";
import { Store } from "../components/DistributionPointsTable";
import { Product } from "../types/Catalog";

interface StoreContextType {
  productStore: ProductStore;
  backOfficeStore: BackOfficeStore;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [selectedDistributionPoint, setSelectedDistributionPoint] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [distributionPoint, setDistributionPoint] = useState<Store[]>([]);
  const [openDistributionPoint, setOpenDistributionPoint] = useState<Store[]>([]);
  const productStore = new ProductStore(
    cartProducts,
    setCartProducts,
    selectedDistributionPoint,
    setSelectedDistributionPoint
  );

  const backOfficeStore = new BackOfficeStore(
    products,
    setProducts,
    distributionPoint,
    setDistributionPoint,
    openDistributionPoint,
    setOpenDistributionPoint
  );

  return (
    <StoreContext.Provider value={{ productStore, backOfficeStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
