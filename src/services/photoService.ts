import { PhotoFormValues } from "@/domain/types/photo";
import { client } from "../api/axiosConfig";
import { Photo } from "../domain/types";

class PhotoService {
  async getPhotosByAlbumId(albumId: number): Promise<Photo[]> {
    const response = await client.get(`/albums/${albumId}/photos`);

    if (response.status !== 200) throw new Error("Failed to fetch photos");

    return response.data as Photo[];
  }

  async createPhoto(photo: PhotoFormValues): Promise<Photo> {
    console.log(photo);
    const response = await client.post(`/photos`, photo, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 201) throw new Error("Failed to create photo");

    return response.data as Photo;
  }

  async deletePhoto(photoId: number): Promise<void> {
    const response = await client.delete(`/photos/${photoId}`);

    if (response.status !== 200) throw new Error("Failed to delete photo");
  }

  async updatePhoto(photo: Photo): Promise<Photo> {
    const response = await client.put(`/photos/${photo.id}`, {
      photo: {
        albumId: photo.albumId,
        title: photo.title,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
      },
    });

    if (response.status !== 200) throw new Error("Failed to update photo");

    return response.data as Photo;
  }
}

export default new PhotoService();
