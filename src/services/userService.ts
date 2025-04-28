import { client } from "../api/axiosConfig";
import { User } from "../domain/types";

class UserService {
  async getAllUsers(): Promise<User[]> {
    const response = await client.get("/users");

    if (response.status !== 200) throw new Error("Failed to fetch users");

    return response.data as User[];
  }
}

export default new UserService();
