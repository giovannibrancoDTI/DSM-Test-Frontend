import { Album } from "@/domain/types";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CustomAlertDialog from "./CustomAlertDialog";
import { Card } from "./ui/card";

interface IAlbumsListProps {
  albums: Album[];
  canManager: boolean;
  onDeleteAlbum: (albumId: number) => void;
}

const AlbumsList = ({
  albums,
  canManager,
  onDeleteAlbum,
}: IAlbumsListProps) => {
  const navigate = useNavigate();
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedAlbums, setDeletedAlbums] = useState<number[]>(() => {
    const storedDeletedAlbums = localStorage.getItem("deletedAlbums");
    return storedDeletedAlbums ? JSON.parse(storedDeletedAlbums) : [];
  });

  const handleClick = (album: Album) => {
    if (!isDeleting) {
      navigate(`${album.id}/photos`);
    }
  };

  const handleEdit = (album: Album) => {
    navigate(`/albums/edit/${album.id}`);
  };

  const handleDeleteClick = (album: Album, event: React.MouseEvent) => {
    event.stopPropagation();
    setAlbumToDelete(album);
    setIsDeleting(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setAlbumToDelete(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = () => {
    if (albumToDelete) {
      setIsDeleting(true);
      onDeleteAlbum(albumToDelete.id);
      const updatedDeletedAlbums = [...deletedAlbums, albumToDelete.id];
      setDeletedAlbums(updatedDeletedAlbums);
      localStorage.setItem(
        "deletedAlbums",
        JSON.stringify(updatedDeletedAlbums)
      );
      setIsDeleting(false);
      setAlbumToDelete(null);
    }
  };

  const albumsFiltered = albums.filter(
    (album) => !deletedAlbums.includes(album.id)
  );

  return (
    <div className="max-w-4xl mx-auto">
      {albumsFiltered.length === 0 ? (
        <p className="text-center text-gray-500">No albums available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albumsFiltered.map((album) => (
            <Card
              key={album.id}
              onClick={() => handleClick(album)}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-40 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <h2 className="text-xl font-semibold">{album.title}</h2>
              {canManager && (
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(album)}
                    className="hover:text-blue-700"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(album, e)}
                    className="hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {showModal && albumToDelete && (
        <CustomAlertDialog
          open={showModal}
          title="Delete Album"
          description="Are you sure you want to delete this album? This action cannot be undone."
          onCancel={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AlbumsList;
