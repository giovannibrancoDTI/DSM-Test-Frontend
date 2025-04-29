const useManagerAlbumAndPhotos = (userId: string) => {
  function canManager() {
    return userId === import.meta.env.VITE_USER_ID;
  }

  return {
    canManager,
  };
};

export default useManagerAlbumAndPhotos;
