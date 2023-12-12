export default interface updateUserResponse {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  role?: "admin";
  avatar?: string;
}
