import AlbumsList from "@/components/albumList";
import CustomBreadcrumb from "@/components/customBreadcrumb";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Album } from "@/domain/types";
import albumService from "@/services/albumService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/shared/redux/store";
import { mergeApiAndLocalAlbums } from "@/shared/utils/mergeApiAndLocalAlbums";

const AlbumsPage = () => {
  const [apiAlbums, setApiAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userId = Number(useParams<{ userId: string }>().userId);
  const navigate = useNavigate();

  const localAlbums = useSelector((state: RootState) => state.albums.albums);

  useEffect(() => {
    if (isNaN(userId)) {
      navigate("/");
    }

    fetchAlbums(userId);
  }, [userId, navigate]);

  const fetchAlbums = async (userId: number) => {
    setLoading(true);
    try {
      const response = await albumService.getAlbumsByUserId(userId);
      setApiAlbums(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message as string);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForm = () => {
    navigate(`/manager/${userId}`);
  };

  const handleDelete = (albumId: number) => {
    const updatedAlbums = localAlbums.filter((album) => album.id !== albumId);
    albumService.deleteAlbum(albumId).then(() => {
      setApiAlbums(updatedAlbums);
    });
    navigate(0);
  };

  const mergedAlbums = mergeApiAndLocalAlbums(apiAlbums, localAlbums).filter(
    (album: Album) => album.userId === userId
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <CustomBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: `Albums`, href: `/${userId}/albums/` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-4">Album List</h1>

        {userId === Number(import.meta.env.VITE_USER_ID) && (
          <Button onClick={handleForm} variant="default" className="mb-4">
            Add or update photo
          </Button>
        )}

        {loading && <p>Loading...</p>}
        {error && <Alert message={error} variant="error" className="mb-4" />}

        <AlbumsList
          canManager={userId === Number(import.meta.env.VITE_USER_ID)}
          albums={mergedAlbums}
          onDeleteAlbum={handleDelete}
        />
      </div>
    </div>
  );
};

export default AlbumsPage;
