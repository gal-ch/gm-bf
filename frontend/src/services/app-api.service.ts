import axios from "axios";
import { Account, Product } from "../types/Catalog";
import { Store } from "../components/DistributionPointsTable";
import { CartItem } from "../stores/ProductStore";

const API_URL = "http://localhost:3002";
const token = localStorage.getItem("token");

export class AppApiService {
  constructor() {}
  private get authHeader() {
    return { authorization: `Bearer ${token}` };
  }

  private getAuthHeader() {
    const token = localStorage.getItem("token");
    return { authorization: `Bearer ${token}` };
  }

  get stores() {
    return {
      getStores: async (accountUrl: string): Promise<Store[]> => {
        const response = await axios.post(
          `${API_URL}/stores/findAllActive`,
          { accountUrl },
          {
            headers: this.getAuthHeader(),
          }
        );

        return response.data;
      },
      getStoreById: async (id: number): Promise<Store[]> => {
        const response = await axios.get(`${API_URL}/stores/${id}`);
        return response.data;
      },
    };
  }
  get products() {
    return {
      getProducts: async (accountUrl: string): Promise<Product[]> => {
        const response = await axios.post(`${API_URL}/products`, {
          accountUrl,
        });
        return response.data;
      },
      getProductById: async (id: number): Promise<Product[]> => {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
      },
    };
  }
  get account() {
    return {
      getAccountByUrl: async (accountUrl: string): Promise<Account> => {
        const response = await axios.post(`${API_URL}/account/accountByUrl`, {
          accountUrl,
        });
        return response.data;
      },
    };
  }
  get orders() {
    return {
      checkout: async ({
        orderDetails,
        cardDetails,
      }: {
        cardDetails: {
          creditCardNumber: string;
          creditCardCvv: string;
          creditCardExpiration: string;
          citizenID: string;
        };
        orderDetails: {
          clientName: string;
          clientEmail: string;
          clientPhoneNumber: number;
          store: number;
          details: {
            productName: string,
            price: number,
            amount: number,
            productId: number
          }[];
          accountUrl: string;
        };
      }): Promise<any> => {
        const requestBody = {
          orderDetails,
          cardDetails,
        };
        try {
          const response = await axios.post(
            `${API_URL}/orders/create`,
            requestBody
          );

          return response.data;
        } catch (error) {
          throw new Error("Error while creating the order: " + error);
        }
      },
    };
  }
}
