import { Store } from "../components/DistributionPointsTable";

export type DropDownSelectOption = {
  value: string;
  name: string;
};

type Settings = {
  closingDate: string;
  closingHour: string;
  freeText: string;
  name: string;
};

export type Account = {
  id?: number;
  email?: string;
  settings: Settings;
  headImg: string;
  siteUrl: string
};

export enum CompanyType {
  Generic = "generic",
  Internal = "internal",
  Unmanaged = "unmanaged",
}

export enum Units {
  kg = "קג",
  unit = "יחידה",
}
export type Product = {
  id: number;
  name: string;
  price: number;
  image: any;
  status: boolean;
  description?: string;
  unit: Units;
  imageFile?: any;
  imagePreviewUrl?: any;
  disabledStoresIds: number[];
};
export type DropDownOptionListType = {
  value: number | string;
  label: string;
};

export type Cart = { product: Product; quantity: number }[];

export enum CompanyPackage {
  All = "all",
  CashPosition = "cash_position",
}

export enum Currency {
  ILS = "₪",
}



export const BUTTON_TYPE_STYLE: any = {
  primary: {
    backgroundColor: "#9696859f",
    hoverBackgroundColor: "var(--btn-bg-hover)",
    fontColor: "var(--fg-white)",
    activeBackgroundColor: "#9696859f",
    disabledBackgroundColor: "var(--neutral-100)",
    minWidth: 120,
  },
  transparent: {
    backgroundColor: "transparent",
    hoverBackgroundColor: "transparent",
    fontColor: "black",
    activeBackgroundColor: "transparent",
    disabledFontColor: "grey",
    minWidth: 120,
  },
};

export const BUTTON_SIZE_STYLE: any = {
  large: {
    fontSize: "1.15rem",
    iconSize: 24,
    height: 48,
    padding: "12px 16px",
  },
  medium: {
    fontSize: "1rem",
    iconSize: 24,
    height: 40,
    padding: "8px 12px",
  },
  small: {
    fontSize: "1rem",
    iconSize: 16,
    height: 32,
    padding: "4px 8px",
  },
};


