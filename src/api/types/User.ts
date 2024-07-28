interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
