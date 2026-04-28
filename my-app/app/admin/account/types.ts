export interface UserProfile {
  id_user: number;
  tenant_id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileForm {
  full_name: string;
  email: string;
}