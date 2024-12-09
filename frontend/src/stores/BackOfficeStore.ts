import { useState } from "react";
import { Product } from "../types/Catalog";
import { Store } from "../components/DistributionPointsTable";
import { BackOfficeApiService } from "../services/back-office-api.service";
import { useLocation } from "react-router-dom";

export class BackOfficeStore {
  private _products: Product[];
  private _setProducts: React.Dispatch<React.SetStateAction<Product[]>>;

  private _distributionPoints: Store[];
  private _setDistributionPoints: React.Dispatch<React.SetStateAction<Store[]>>;

  private _openDistributionPoints: Store[];
  private _setOpenDistributionPoints: React.Dispatch<
    React.SetStateAction<Store[]>
  >;
  private apiService: BackOfficeApiService;
  constructor(
    products: Product[],
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
    distributionPoints: Store[],
    setDistributionPoints: React.Dispatch<React.SetStateAction<Store[]>>,

    openDistributionPoints: Store[],
    setOpenDistributionPoints: React.Dispatch<React.SetStateAction<Store[]>>
  ) {
    this.apiService = new BackOfficeApiService();
    this._products = products;
    this._setProducts = setProducts;
    this._distributionPoints = distributionPoints;
    this._setOpenDistributionPoints = setOpenDistributionPoints;
    this._setDistributionPoints = setDistributionPoints;
    this._openDistributionPoints = openDistributionPoints;
  }

  async fetchProducts(accountUrl: string) {
    try {
      const products = await this.apiService.products.getProducts(accountUrl);
      this._setProducts(products);
      this._products = products;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async fetchDistributionPoints() {
    try {
      const distributionPoints = await this.apiService.stores.getStores();
      this._setDistributionPoints(distributionPoints);
      this._distributionPoints = distributionPoints;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async fetchOpenDistributionPoints() {
    try {
      const openDistributionPoints =
        await this.apiService.stores.getStoresOfOpenedOrders();
      this._setOpenDistributionPoints(openDistributionPoints);
      this._openDistributionPoints = openDistributionPoints;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  get products() {
    return this._products;
  }

  set cartProducts(products: Product[]) {
    this._products = products;
    this._setProducts(products);
  }

  get distributionPoints() {
    return this._distributionPoints;
  }

  get openDistributionPoints() {
    return this._openDistributionPoints;
  }

  set selectedDistributionPoint(distributionPoint: Store[]) {
    this._distributionPoints = distributionPoint;
    this._setDistributionPoints(distributionPoint);
  }
}
