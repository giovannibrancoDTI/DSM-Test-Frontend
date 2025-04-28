import { Album } from "@/domain/types";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";

interface IAlbumsListProps {
  albums: Album[];
}

const AlbumsList = ({ albums }: IAlbumsListProps) => {
  const navigate = useNavigate();

  const handleClick = (album: Album) => {
    navigate(`${album.id}/photos`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {albums.length === 0 ? (
        <p className="text-center text-gray-500">No albums available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.map((album) => (
            <Card
              key={album.id}
              onClick={() => handleClick(album)}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-40 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <h2 className="text-xl font-semibold ">{album.title}</h2>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsList;
