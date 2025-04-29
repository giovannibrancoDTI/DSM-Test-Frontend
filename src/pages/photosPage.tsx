import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPhotosByAlbumId } from "@/shared/redux/slices/photoSlice";
import { RootState, AppDispatch } from "@/shared/redux/store";
import CustomBreadcrumb from "@/components/customBreadcrumb";
import PhotoList from "@/components/photoList";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useManagerAlbumAndPhotos from "@/hooks/useManagerAlbumAndPhotos";

const PhotosPage = () => {
  const { userId, albumId } = useParams<{ userId: string; albumId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { canManager } = useManagerAlbumAndPhotos(userId as string);

  const { photos, loading, error } = useSelector(
    (state: RootState) => state.photos
  );

  useEffect(() => {
    if (
      !userId ||
      !albumId ||
      isNaN(Number(userId)) ||
      isNaN(Number(albumId))
    ) {
      navigate("/");
    }

    dispatch(fetchPhotosByAlbumId(Number(albumId)));
  }, [userId, albumId, dispatch, navigate]);

  const filteredPhotos = photos.filter(
    (photo) => photo.albumId === Number(albumId)
  );

  const handleForm = () => {
    navigate(`/manager/${userId}`);
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

        {canManager() && (
          <Button onClick={handleForm} variant="default" className="mb-4">
            Add or update photo
          </Button>
        )}

        <PhotoList canManager={canManager()} photos={filteredPhotos} />
      </div>
    </div>
  );
};

export default PhotosPage;
