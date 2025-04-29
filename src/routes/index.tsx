import AddOrUpdatePhotoPage from "@/pages/addPhotoPage";
import AlbumsPage from "@/pages/albumsPage";
import PhotosPage from "@/pages/photosPage";
import UsersPage from "@/pages/usersPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/:userId/albums" element={<AlbumsPage />} />
        <Route
          path="/:userId/albums/:albumId/photos"
          element={<PhotosPage />}
        />
        <Route path="/manager/:userId" element={<AddOrUpdatePhotoPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
