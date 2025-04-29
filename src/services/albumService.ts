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
      userId,
      title,
    });

    if (response.status !== 201) throw new Error("Failed to create album");

    return response.data as Album;
  }

  async updateAlbum(albumId: number, title: string): Promise<Album> {
    const response = await client.put(`/albums/${albumId}`, {
      title,
    });

    if (response.status !== 200) throw new Error("Failed to update album");

    return response.data as Album;
  }
  async deleteAlbum(albumId: number): Promise<void> {
    const response = await client.delete(`/albums/${albumId}`);

    if (response.status !== 204) throw new Error("Failed to delete album");
  }
}

export default new AlbumService();
