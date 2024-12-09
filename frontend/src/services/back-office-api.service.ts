import axios from "axios";
import { Account, Product } from "../types/Catalog";
import { Store } from "../components/DistributionPointsTable";
import { Order } from "../components/OrdersTable";

const API_URL = "http://localhost:3002";
const token = localStorage.getItem("token");
interface LoginResponse {
  access_token: string;
  account: Account;
}
export class BackOfficeApiService {
  constructor() {}
  private get authHeader() {
    return { authorization: `Bearer ${token}` };
  }
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    return { authorization: `Bearer ${token}` };
  }

  get account() {
    return {
      getAccount: async (): Promise<Account> => {
        const response = await axios.get(`${API_URL}/account`, {
          headers: this.getAuthHeader(),
        });
        return response.data;
      },
      updateAccount: async (formData: FormData): Promise<Account> => {
        const response = await axios.put(`${API_URL}/account`, formData, {
          headers: {
            ...this.authHeader,
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        });
        return response.data;
      },
      login: async (
        email: string,
        password: string
      ): Promise<LoginResponse> => {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });
        return response.data;
      },
      register: async (email: string, password: string): Promise<string> => {
        const response = await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
        });
        return response.data.access_token;
      },
    };
  }

  get products() {
    return {
      getProducts: async (accountUrl: string): Promise<Product[]> => {
        const response = await axios.post(
          `${API_URL}/products`,
          { accountUrl },
          {
            headers: this.authHeader,
          }
        );
        return response.data;
      },
      createProduct: async (product: any) => {
        const response = await axios.post(`${API_URL}/products/createProduct`, product, {
          headers: this.authHeader,
        });
        return response.data;
      },
      updateProduct: async (id: number, product: Product) => {
        const response = await axios.put(`${API_URL}/products/${id}`, product, {
          headers: this.authHeader,
        });
        return response.data;
      },

      deleteProduct: async (id: number) => {
        const response = await axios.delete(`${API_URL}/products/${id}`, {
          headers: this.authHeader,
        });
        return response.data;
      },
      checkout: async (order: Order) => {
        const response = await axios.post(`${API_URL}/orders/checkout`, order, {
          headers: this.authHeader,
        });
      },
    };
  }

  get stores() {
    return {
      getStores: async (): Promise<Store[]> => {
        const response = await axios.get(`${API_URL}/stores`, {
          headers: this.authHeader,
        });
        return response.data;
      },
      getStoreById: async (id: number): Promise<Store[]> => {
        const response = await axios.get(`${API_URL}/stores/${id}`, {
          headers: this.authHeader,
        });
        return response.data;
      },

      createStore: async (store: any) => {
        const response = await axios.post(`${API_URL}/stores/`, store, {
          headers: this.authHeader,
        });
        return response.data;
      },
      updateStore: async (id: number, store: Store) => {
        const response = await axios.put(`${API_URL}/stores/${id}`, store, {
          headers: this.authHeader,
        });
        return response.data;
      },
      deleteStore: async (id: number) => {
        const response = await axios.delete(`${API_URL}/stores/${id}`, {
          headers: this.authHeader,
        });
        return response.data;
      },
      updateStores: async (stores: Store[]) => {
        const response = await axios.post(`${API_URL}/stores/`, stores, {
          headers: this.authHeader,
        });
        return response.data;
      },
      getStoresOfOpenedOrders: async (): Promise<Store[]> => {
        const response = await axios.get(
          `${API_URL}/stores/getStoresOfOpenedOrders`,
          { headers: this.authHeader }
        );
        return response.data;
      },
      closeStoreEndOfDayAndSendEmail: async (storesId: number[]) => {
        const response = await axios.post(
          `${API_URL}/stores/closeStoreEndOfDayAndSendEmail`,
          storesId,
          { headers: this.authHeader }
        );
        return response.data;
      },
    };
  }
  get orders() {
    return {
      getOrders: async (
        startDate: string,
        endDate: string,
        filters: Record<string, (number | string)[]> | null
      ): Promise<Record<number, Order[]>> => {
        const response = await axios.post(
          `${API_URL}/orders/getAllOrderByStore`,
          {
            startDate,
            endDate,
            filters,
          },
          {
            headers: this.authHeader,
          }
        );

        return response.data;
      },
      exportReport: async (
        startDate: string,
        endDate: string,
        filters: Record<string, (number | string)[]> | null,
        storeId?: number
      ) => {
        const response = await axios.post(
          `${API_URL}/orders/exportReport/`,
          {
            startDate,
            endDate,
            filters,
            storeId,
          },
          { headers: this.authHeader }
        );
        return response.data;
      },
      checkout: async (order: Order) => {
        const response = await axios.post(`${API_URL}/orders/checkout`, order, {
          headers: this.authHeader,
        });
      },
    };
  }
}
