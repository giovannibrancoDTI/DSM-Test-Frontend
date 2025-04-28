export interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface PhotoFormValues {
  title: string;
  albumId: number;
  url: string;
  thumbnailUrl: string;
}
