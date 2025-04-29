import { Album } from "@/domain/types";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Card } from "./ui/card";

interface IAlbumsListProps {
  canManager: boolean;
  albums: Album[];
  onDeleteAlbum: (albumId: number) => void;
}

const AlbumsList = ({
  canManager,
  albums,
  onDeleteAlbum,
}: IAlbumsListProps) => {
  const navigate = useNavigate();
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
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
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(album);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => handleDeleteClick(album, e)}
                          className="hover:text-red-700 cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your album and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={handleCloseModal}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmDelete}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsList;
