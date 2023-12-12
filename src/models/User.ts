export interface UserList {
  user_id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: number;
  created_at: string;
  updated_at: string;
}
