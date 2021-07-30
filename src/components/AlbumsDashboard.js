import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchStatus,
  useGetAlbums,
  // SaveStatus,
  useCreateAlbum,
} from "../hooks/server";
import { Link } from "react-router-dom";

/* This example requires Tailwind CSS v2.0+ */
import { PlusIcon as PlusIconSolid } from "@heroicons/react/solid";
import {
  CloudUploadIcon,
  PhotographIcon,
  ClockIcon,
} from "@heroicons/react/outline";

function CreateAlbumButton({ onClick }) {
  return (
    <button
      type="button"
      className="mx-8 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={onClick}
    >
      <PlusIconSolid className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

function CreateAlbumForm({ handleCreateAlbum }) {
  const [albumName, setAlbumName] = useState("");

  const handleSubmit = () => {
    handleCreateAlbum(albumName);
    setAlbumName("");
  };

  return (
    <div className="flex flex-row my-8">
      <div className="flex-auto relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
        <label
          htmlFor="Create New Album"
          className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
        >
          Create New Album
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          // placeholder="Create New Album"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
      </div>
      <CreateAlbumButton onClick={handleSubmit} />
    </div>
  );
}

/* This example requires Tailwind CSS v2.0+ */
function Divider({ centerText }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-3 bg-white text-lg font-medium text-gray-900">
          {centerText}
        </span>
      </div>
    </div>
  );
}

function AlbumNameGrid({ albums }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => (
        <li
          key={album}
          className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <div className="w-full flex items-center justify-between p-6 space-x-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="text-gray-900 text-sm font-medium truncate">
                  {album}
                </h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  {"Ready"}
                </span>
              </div>
              <p className="mt-1 text-gray-500 text-sm truncate">
                {"Number of Photos in album: -"}
              </p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="w-0 flex-1 flex">
                <Link
                  to={`/gallery/${album}`}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  <PhotographIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">View</span>
                </Link>
              </div>
              <div className="-ml-px w-0 flex-1 flex">
                <Link
                  to={`/upload/${album}`}
                  className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                >
                  <CloudUploadIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">Upload</span>
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function TableComponent({ getAlbumsStatus, albums }) {
  switch (getAlbumsStatus) {
    case FetchStatus.FetchSuccess:
      return <AlbumNameGrid albums={albums} />;
    default:
      return (
        <>
          <ClockIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="ml-3">Loading Please Wait</span>
        </>
      );
  }
}

export default function AlbumsDashboard() {
  const { currentUser } = useAuth();
  const [getAlbums, getAlbumsStatus, albums] = useGetAlbums(currentUser);
  const [createAlbum, _createAlbumStatus] = useCreateAlbum(currentUser);

  useEffect(() => {
    getAlbums();
  }, []);

  let handleCreateAlbum = (albumName) => {
    createAlbum(albumName, getAlbums);
  };

  return (
    <>
      <CreateAlbumForm handleCreateAlbum={handleCreateAlbum} />
      <Divider centerText={"Albums"} />
      <TableComponent getAlbumsStatus={getAlbumsStatus} albums={albums} />
    </>
  );
}
