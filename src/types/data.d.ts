import { Supplier } from "./../components/icon/icon";
import { ButtonProps } from "@heroui/react";
import {
  Gender,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from "./enum";

export type Office = {
  id: string;
  name: string;
  nameEn?: string;
  shortName: string;
  taxCode: string;
  address?: string;
};

export type Department = {
  id: string;
  name: string;
};
export type DeviceModel = {
  id: string;
  name: string;
};
export type DeviceType = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  gender?: Gender;
  dob: Date;
  address?: string;
  avatar?: string;
  office?: Office;
  department?: Department;
};

export type Asset = {
  id: string;
  internalCode: string;
  serialNumber: string;
  purchaseDate: string;
  warranty: number;
  deviceType?: DeviceType;
  deviceModel?: DeviceModel;
  customProperties?: {
    cpu?: string;
    ram?: string;
    osType?: string;
    hardDrive?: string;
    macAddress?: string;
  };
  assetTransactions?: AssetTransaction[];
};

export type AssetTransferBatch = {
  id: string;
  note?: string;
  assetTransactions: AssetTransaction[];
  handover: File;
  createdAt: Date;
};

export type File = {
  filePath: string;
};

export type AssetTransaction = {
  id: string;
  note?: string;

  signature?: string;
  signedAt?: Date;

  direction?: TransactionDirection;
  type?: TransactionType;
  status?: TransactionStatus;

  user?: User;
  fromUser?: User;
  toUser?: User;

  asset?: Asset;
  department?: Department;
  office?: Office;

  handoverFilePath?: string;

  createdAt?: Date;
};

export type ParamsWithId = {
  params: Promise<{
    id: string;
  }>;
};

export type ChartData = {
  name: string;
  value: number;
  [key: string]: string | number;
};

export type CircleChartProps = {
  title: string;
  color: ButtonProps["color"];
  chartData: ChartData[];
  total: number;
};

export type Supplier = {
  id: string;
  name: string;
  internationalName?: string;
  shortName?: string;
  address?: string;
  taxCode: string;
  phone?: string;
};
