export interface User {
  id?: number;
  created_at?: string;
  email: string;
  password?: string; // For signup/login only
  display_name?: string;
  token?: string; // Optional, if your backend returns auth token
}
