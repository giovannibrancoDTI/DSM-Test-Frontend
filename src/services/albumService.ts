import { client } from "../api/axiosConfig";
import { Album } from "../domain/types";

class AlbumService {
  async getAlbumsByUserId(userId: number): Promise<Album[]> {
    const response = await client.get(`/users/${userId}/albums`);

    if (response.status !== 200) throw new Error("Failed to fetch albums");

    return response.data as Album[];
  }

  async createAlbum(userId: number, title: string): Promise<Album> {
    const response = await client.post(`/albums`, {
      album: {
        userId,
        title,
      },
    });

    if (response.status !== 201) throw new Error("Failed to create album");

    return response.data as Album;
  }
}

export default new AlbumService();
