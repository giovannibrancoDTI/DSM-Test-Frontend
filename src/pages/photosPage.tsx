import CustomBreadcrumb from "@/components/customBreadcrumb";
import PhotoList from "@/components/photoList";
import { Alert } from "@/components/ui/alert";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/shared/redux/store";
import { fetchPhotosByAlbumId } from "@/shared/redux/slices/photoSlice";

const PhotosPage = () => {
  const { userId, albumId } = useParams<{ userId: string; albumId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
      return;
    }

    dispatch(fetchPhotosByAlbumId(Number(albumId)));
  }, [userId, albumId, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <CustomBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Albums", href: `/${userId}/albums/` },
            { label: "Photos", href: `/${userId}/albums/${albumId}/photos/` },
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
