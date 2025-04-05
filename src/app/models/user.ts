export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginInput {
  username?: string;
  email?: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
  token: string;
}
