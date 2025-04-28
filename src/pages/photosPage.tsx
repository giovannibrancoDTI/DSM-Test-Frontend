import CustomBreadcrumb from "@/components/customBreadcrumb";
import PhotoList from "@/components/photoList";
import { Alert } from "@/components/ui/alert";
import { Photo } from "@/domain/types";
import photoService from "@/services/photoService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { userId, albumId } = useParams<{
    userId: string;
    albumId: string;
  }>();

  const navigate = useNavigate();

  useEffect(() => {
    if (isNaN(Number(userId)) || isNaN(Number(albumId))) {
      navigate("/");
    }

    fetchPhotos(Number(albumId));
  }, [userId, albumId, navigate]);

  const fetchPhotos = async (albumId: number) => {
    setLoading(true);
    try {
      const response = await photoService.getPhotosByAlbumId(albumId);
      setPhotos(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message as string);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <CustomBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: `Albums`, href: `/${userId}/albums/` },
            { label: `Photos`, href: `/${userId}/albums/${albumId}/photos/` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">Photos List</h1>

        {loading && <p>Loading...</p>}
        {error && <Alert message={error} variant="error" className="mb-4" />}

        <PhotoList photos={photos} />
      </div>
    </div>
  );
};

export default PhotosPage;
