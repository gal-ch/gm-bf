import { useState } from "react";
import { Product } from "../types/Catalog";
import { Store } from "../components/DistributionPointsTable";

export interface CartItem {
  product: Product;
  quantity: number;
}

export class ProductStore {
  private _cartProducts: CartItem[];
  private _setCartProducts: React.Dispatch<React.SetStateAction<CartItem[]>>;
  private _selectedDistributionPoint: Store | null;
  private _setSelectedDistributionPoint: React.Dispatch<
    React.SetStateAction<Store | null>
  >;

  constructor(
    cartProducts: CartItem[],
    setCartProducts: React.Dispatch<React.SetStateAction<CartItem[]>>,
    selectedDistributionPoint: Store | null,
    setSelectedDistributionPoint: React.Dispatch<
      React.SetStateAction<Store | null>
    >
  ) {
    this._cartProducts = cartProducts;
    this._setCartProducts = setCartProducts;
    this._selectedDistributionPoint = selectedDistributionPoint;
    this._setSelectedDistributionPoint = setSelectedDistributionPoint;
    this.loadFromLocalStorage();
  }

  get cartProducts() {
    return this._cartProducts;
  }

  set cartProducts(products: CartItem[]) {
    this._cartProducts = products;
    this._setCartProducts(products);
    this.saveToLocalStorage(products, "cartProducts");
  }

  get selectedDistributionPoint() {
    return this._selectedDistributionPoint;
  }

  set selectedDistributionPoint(distributionPoint: Store | null) {
    this._selectedDistributionPoint = distributionPoint;
    this._setSelectedDistributionPoint(distributionPoint);
    this.saveToLocalStorage(distributionPoint, "distributionPoint");
  }

  addToCart(product: Product, quantity: number) {
    const existingProductIndex = this._cartProducts.findIndex(
      (item) => item.product.id === product.id
    );

    let newCartProducts = [...this._cartProducts];

    if (existingProductIndex >= 0) {
      if (quantity > 0) {
        newCartProducts[existingProductIndex].quantity = quantity;
      } else {
        newCartProducts.splice(existingProductIndex, 1);
      }
    } else if (quantity > 0) {
      newCartProducts.push({ product, quantity });
    }

    this.cartProducts = newCartProducts;
  }

  removeFromCart(product: Product) {
    const newCartProducts = this._cartProducts.filter(
      (item) => item.product.id !== product.id
    );
    this.cartProducts = newCartProducts;
  }

  removeAllProductsFromCart() {
    this.cartProducts = [];
  }

  private saveToLocalStorage(data: any, key: string) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadFromLocalStorage() {
    const storedCartProducts = localStorage.getItem("cartProducts");
    if (storedCartProducts !== "undefined" && storedCartProducts) {
      this._cartProducts = JSON.parse(storedCartProducts);
    }
    const storedDistributionPoint = localStorage.getItem("distributionPoint");
    if (storedDistributionPoint) {
      this._selectedDistributionPoint = JSON.parse(
        storedDistributionPoint || "{}"
      );
    }
  }
}
