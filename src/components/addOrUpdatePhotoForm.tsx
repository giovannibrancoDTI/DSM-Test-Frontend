import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Album } from "@/domain/types";
import albumService from "@/services/albumService";
import photoService from "@/services/photoService";
import { addAlbum } from "@/shared/redux/slices/albumSlice";
import { addPhoto } from "@/shared/redux/slices/photoSlice";
import { AppDispatch, RootState } from "@/shared/redux/store";
import { mergeApiAndLocalAlbums } from "@/shared/utils/mergeApiAndLocalAlbums";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const AddPhotoForm = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState<string>("");
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const localAlbums = useSelector((state: RootState) => state.albums.albums);

  useEffect(() => {
    const fetchAlbums = async (userId: number) => {
      try {
        const response = await albumService.getAlbumsByUserId(userId);
        const mergedAlbums = mergeApiAndLocalAlbums(
          response,
          localAlbums
        ).filter((album: Album) => album.userId === userId);
        setAlbums(mergedAlbums);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    if (userId) {
      fetchAlbums(Number(userId));
    }
  }, [userId, localAlbums]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors = !title || (!albumId && !newAlbumTitle) || !file;

    if (hasErrors) {
      setTouchedFields({
        title: true,
        album: true,
        newAlbumTitle: true,
        file: true,
      });
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError(null);

      let finalAlbumId = Number(albumId);

      if (!albumId && newAlbumTitle) {
        const newAlbum = await albumService.createAlbum(
          Number(userId),
          newAlbumTitle
        );

        finalAlbumId = Date.now(); // Use a unique ID for the new album

        dispatch(addAlbum({ ...newAlbum, id: finalAlbumId }));
      }

      const newPhoto = {
        albumId: finalAlbumId,
        title,
        url: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
      };

      const createdPhoto = await photoService.createPhoto(newPhoto);
      dispatch(addPhoto({ ...createdPhoto, id: Date.now() })); // Use a unique ID for the new photo

      setSuccess(true);
      setTimeout(
        () =>
          navigate(`/${userId}/albums/`, {
            replace: true,
          }),
        1500
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Add New Photo</h1>

      {error && <Alert variant="error" className="mb-4" message={error} />}
      {success && (
        <Alert
          variant="success"
          className="mb-4"
          message="Photo added successfully!"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter photo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() =>
              setTouchedFields((prev) => ({ ...prev, title: true }))
            }
            className={clsx(
              touchedFields.title && !title && "border-destructive"
            )}
          />
          {touchedFields.title && !title && (
            <p className="text-destructive text-sm mt-1">Title is required.</p>
          )}
        </div>

        <div>
          <Label>Choose Existing Album *</Label>
          <Select
            onValueChange={(value) => {
              setAlbumId(value);
              setTouchedFields((prev) => ({ ...prev, album: true }));
            }}
          >
            <SelectTrigger
              className={clsx(
                touchedFields.album &&
                  !albumId &&
                  !newAlbumTitle &&
                  "border-destructive"
              )}
            >
              <SelectValue placeholder="Select an album" />
            </SelectTrigger>
            <SelectContent>
              {albums.map((album) => (
                <SelectItem key={album.id} value={album.id.toString()}>
                  {album.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touchedFields.album && !albumId && !newAlbumTitle && (
            <p className="text-destructive text-sm mt-1">
              Album selection is required.
            </p>
          )}
        </div>

        <div className="flex items-center justify-center my-2 text-gray-500">
          OR
        </div>

        <div>
          <Label htmlFor="new-album">Create New Album *</Label>
          <Input
            id="new-album"
            placeholder="New album title"
            value={newAlbumTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAlbumTitle(e.target.value)
            }
            onBlur={() =>
              setTouchedFields((prev: Record<string, boolean>) => ({
                ...prev,
                newAlbumTitle: true,
              }))
            }
            className={clsx(
              touchedFields.newAlbumTitle &&
                !albumId &&
                !newAlbumTitle &&
                "border-destructive"
            )}
          />
          {touchedFields.newAlbumTitle && !albumId && !newAlbumTitle && (
            <p className="text-destructive text-sm mt-1">
              New album title is required if no existing album is selected.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="file">Upload Photo *</Label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
            onBlur={() => setTouchedFields((prev) => ({ ...prev, file: true }))}
            className={clsx(
              touchedFields.file && !file && "border-destructive"
            )}
          />
          {touchedFields.file && !file && (
            <p className="text-destructive text-sm mt-1">
              Photo upload is required.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Add Photo
        </Button>
      </form>
    </div>
  );
};

export default AddPhotoForm;
