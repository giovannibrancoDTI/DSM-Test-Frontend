import { Album } from "@/domain/types";

export function mergeApiAndLocalAlbums(
  apiAlbums: Album[],
  localAlbums: Album[]
): Album[] {
  const combined = [...apiAlbums, ...localAlbums];

  const uniqueAlbums = combined.reduce((acc: Album[], album) => {
    if (!acc.find((a) => a.id === album.id)) {
      acc.push(album);
    }
    return acc;
  }, []);

  return uniqueAlbums;
}
