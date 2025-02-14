/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnType } from "antd/es/table";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserData = {
  data: User[];
  totalItems: number;
};

export type FarmalkesType = {
  code: string | null;
  name: string | null;
  group: string | null;
};

export type DosageForm = {
  code: string | null;
  name: string | null;
};

export type UOM = {
  name: string | null;
};

export type ProductTemplate = {
  name: string | null;
  state: string | null;
  bmhp: string | null;
  active: boolean;
  kfa_code: string | null;
  updated_at: string | null;
  display_name: string | null;
};

export type ActiveIngredient = {
  state: string | null;
  active: boolean;
  kfa_code: string | null;
  zat_aktif: string | null;
  updated_at: string | null;
  kekuatan_zat_aktif: string | null;
};

export type Tag = {
  code: string | null;
  name: string | null;
};

export type Replacement = {
  product: {
    name: string | null;
    reason: string | null;
    kfa_code: string | null;
  };
  template: {
    name: string | null;
    reason: string | null;
    kfa_code: string | null;
  };
};

export type Product = {
  id: string;
  name: string;
  kfa_code: string;
  active: boolean;
  state: string;
  image: string | null;
  updated_at: string;
  farmalkes_type: FarmalkesType;
  dosage_form: DosageForm;
  produksi_buatan: string | null;
  nie: string | null;
  nama_dagang: string;
  manufacturer: string;
  registrar: string;
  generik: string | null;
  rxterm: string | null;
  dose_per_unit: number;
  fix_price: number | null;
  het_price: number | null;
  farmalkes_hscode: string | null;
  tayang_lkpp: string | null;
  kode_lkpp: string;
  net_weight: number;
  net_weight_uom_name: string;
  volume: number | null;
  volume_uom_name: string | null;
  med_dev_jenis: string | null;
  med_dev_subkategori: string | null;
  med_dev_kategori: string | null;
  med_dev_kelas_risiko: string | null;
  klasifikasi_izin: string | null;
  uom: UOM;
  product_template: ProductTemplate;
  active_ingredients: ActiveIngredient[];
  tags: Tag[];
  replacement: Replacement;
  total_data: number;
};

export type ProductData = {
  data: Product[];
  totalItems: number;
};

export type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onChange: (page: number, limit: number) => void;
};

export type DataType = {
  key: React.Key;
  [key: string]: any;
};

export type TableComponentProps = {
  data: any[];
  columns: ColumnType<DataType>[];
  isLoading: boolean;
};

export type ProductFormData = {
  price: any | null;
  name: string | null;
  category: FarmalkesType | string | null;
  manufacturer: string | null;
  registrar: string | null;
  net_weight: number | null;
  dosage_form: string | null;
  state: string | null;
};
