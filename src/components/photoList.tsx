import { Photo } from "@/domain/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface IPhotosListProps {
  photos: Photo[];
}

const PhotoList = ({ photos }: IPhotosListProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {photos.length === 0 ? (
        <p className="text-center text-gray-500">No photos available.</p>
      ) : (
        <section aria-label="Photo Carousel">
          <Carousel className="w-full">
            <CarouselContent className="flex items-center">
              {photos.map((photo) => (
                <CarouselItem
                  key={photo.id}
                  className="basis-full flex flex-col items-center justify-center p-4"
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
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious aria-label="Previous Photo" />
            <CarouselNext aria-label="Next Photo" />
          </Carousel>
        </section>
      )}
    </div>
  );
};

export default PhotoList;
