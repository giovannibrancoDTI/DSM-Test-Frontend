import { Photo } from "@/domain/types";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomAlertDialog from "./CustomAlertDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface IPhotosListProps {
  canManager: boolean;
  photos: Photo[];
  onDeletePhoto?: (photoId: number) => void;
  onEditPhoto?: (photo: Photo) => void;
}

const PhotoList = ({
  canManager,
  photos,
  onDeletePhoto,
  onEditPhoto,
}: IPhotosListProps) => {
  const [showModal, setShowModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [deletedPhotos, setDeletedPhotos] = useState<number[]>([]);

  useEffect(() => {
    const storedDeletedPhotos = localStorage.getItem("deletedPhotos");
    if (storedDeletedPhotos) {
      setDeletedPhotos(JSON.parse(storedDeletedPhotos));
    }
  }, []);

  const handleDeleteClick = (photo: Photo, event: React.MouseEvent) => {
    event.stopPropagation();
    setPhotoToDelete(photo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPhotoToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (photoToDelete) {
      const updatedDeletedPhotos = [...deletedPhotos, photoToDelete.id];
      setDeletedPhotos(updatedDeletedPhotos);
      localStorage.setItem(
        "deletedPhotos",
        JSON.stringify(updatedDeletedPhotos)
      );

      if (onDeletePhoto) {
        onDeletePhoto(photoToDelete.id);
      }

      setShowModal(false);
      setPhotoToDelete(null);
    }
  };

  const handleEditClick = (photo: Photo, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEditPhoto) {
      onEditPhoto(photo);
    }
  };

  const filteredPhotos = photos.filter(
    (photo) => !deletedPhotos.includes(photo.id)
  );

  return (
    <div className="max-w-4xl mx-auto">
      {filteredPhotos.length === 0 ? (
        <p className="text-center text-gray-500">No photos available.</p>
      ) : (
        <section aria-label="Photo Carousel">
          <Carousel className="w-full">
            <CarouselContent className="flex items-center">
              {filteredPhotos.map((photo) => (
                <CarouselItem
                  key={photo.id}
                  className="basis-full flex flex-col items-center justify-center p-4 relative"
                >
                  <figure className="flex flex-col items-center">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-96 object-cover rounded-lg shadow-md"
                    />
                    <figcaption className="hidden mt-4 text-center text-lg font-medium">
                      {photo.title}
                    </figcaption>
                  </figure>
                  {canManager && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => handleEditClick(photo, e)}
                        className="hover:text-blue-700"
                        title="Edit photo"
                      >
                        <FaEdit size={20} />
                      </button>

                      <button
                        onClick={(e) => handleDeleteClick(photo, e)}
                        className="hover:text-red-700"
                        title="Delete photo"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious aria-label="Previous Photo" />
            <CarouselNext aria-label="Next Photo" />
          </Carousel>
        </section>
      )}

      {showModal && photoToDelete && (
        <CustomAlertDialog
          open={showModal}
          title="Delete Photo"
          description="This will permanently delete the selected photo."
          onCancel={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default PhotoList;
