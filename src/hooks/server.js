import React from "react";
import axios from "axios";

const FetchStatus = {
  FetchNotCalled: "FetchNotCalled",
  Fetching: "Fetching",
  FetchError: "FetchError",
  FetchSuccess: "FetchSuccess",
};

let useGetAlbums = (currentUser) => {
  const [getAlbumsStatus, dispatch] = React.useState(
    FetchStatus.FetchNotCalled
  );
  const [albums, setAlbums] = React.useState([]);

  let getAlbums = async () => {
    dispatch(FetchStatus.Fetching);
    const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const url = `http://192.168.1.13:8081/api/v1/gallery/${currentUser.uid}`;
    const getAlbumsResponse = await axios.get(url, { headers });

    setAlbums(getAlbumsResponse.data.gallery_list);

    dispatch(FetchStatus.FetchSuccess);
  };

  return [getAlbums, getAlbumsStatus, albums];
};

const SaveStatus = {
  SaveNotCalled: "SaveNotCalled",
  Saving: "Saving",
  SaveError: "SaveError",
  SaveSuccess: "SaveSuccess",
};

let useCreateAlbum = (currentUser) => {
  const [createAlbumStatus, dispatch] = React.useState(
    SaveStatus.SaveNotCalled
  );

  let createAlbum = async (albumName, handleSuccess) => {
    dispatch(SaveStatus.Saving);
    const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const payload = { name: albumName };

    const url = `http://192.168.1.13:8081/api/v1/gallery/${currentUser.uid}`;
    await axios.post(url, payload, { headers });

    handleSuccess();

    dispatch(SaveStatus.SaveSuccess);
  };

  return [createAlbum, createAlbumStatus];
};

let useGetAlbumJson = (currentUser) => {
  const [getAlbumJsonStatus, dispatch] = React.useState(
    FetchStatus.FetchNotCalled
  );
  const [albumJson, setAlbumJson] = React.useState({});

  let getAlbumJson = async (albumName) => {
    // albumName = "testalbum"; // TODO: delete this line
    dispatch(FetchStatus.Fetching);
    const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const url = `http://192.168.1.13:8081/api/v1/gallery/album/${albumName}/${currentUser.uid}`;
    const getAlbumJsonResponse = await axios.get(url, { headers });

    console.log(getAlbumJsonResponse);
    setAlbumJson(getAlbumJsonResponse.data);

    dispatch(FetchStatus.FetchSuccess);
  };

  return [getAlbumJson, getAlbumJsonStatus, albumJson];
};

export {
  FetchStatus,
  useGetAlbums,
  SaveStatus,
  useCreateAlbum,
  useGetAlbumJson,
};
