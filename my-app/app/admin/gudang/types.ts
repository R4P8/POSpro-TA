export interface WarehouseData {
  id: number;
  tenant_id: number;
  name: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tenant {
  id: number;
  business_name: string;
}

export interface WarehouseForm {
  name: string;
  location: string;
  tenant_id: number;
}