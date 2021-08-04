import React, { useRef, useState, useEffect, Fragment } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchStatus,
  useGetAlbums,
  // SaveStatus,
  useCreateAlbum,
  useGetAlbumJson,
} from "../hooks/server";

import {
  Link,
  useRouteMatch,
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";

/* This example requires Tailwind CSS v2.0+ */
import { PlusIcon as PlusIconSolid } from "@heroicons/react/solid";
import {
  CloudUploadIcon,
  PhotographIcon,
  ClockIcon,
} from "@heroicons/react/outline";

import { Dialog, Transition } from "@headlessui/react";
import {
  UserIcon,
  CollectionIcon,
  MenuAlt2Icon,
  XIcon,
} from "@heroicons/react/outline";

import Pig from "pig-react";
import UpdateProfile from "./UpdateProfile";

import Upload from "./Upload";
import Profile from "./Profile";
import _ from "lodash";

import "./base.css";

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

function AlbumNameGrid({ albums, setSelectedAlbum }) {
  const history = useHistory();
  function handleAlbumView(albumName) {
    setSelectedAlbum(albumName);
    history.push("/app/photos");
  }
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
                <button
                  onClick={(_) => handleAlbumView(album)}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  <PhotographIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="ml-3">View</span>
                </button>
              </div>
              <div className="-ml-px w-0 flex-1 flex">
                <Link
                  to={`/app/upload/${album}`}
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

function TableComponent({ getAlbumsStatus, albums, setSelectedAlbum }) {
  switch (getAlbumsStatus) {
    case FetchStatus.FetchSuccess:
      return (
        <AlbumNameGrid albums={albums} setSelectedAlbum={setSelectedAlbum} />
      );
    default:
      return (
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <div className="text-center lg:w-2/3 w-full">
              <p className="mb-8 leading-relaxed">
                You may need to select an album to view photos
              </p>
              <div className="flex justify-center">
                <ClockIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <span className="ml-3">Loading Please Wait</span>
            </div>
          </div>
        </section>
      );
  }
}

function LoginSection() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      // await login("cd@e.com", "ffffff"); // TODO
      history.push("/app");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {/* <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            start your 14-day free trial
          </a>
        </p> */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SearchBar({ handleCreateAlbum }) {
  const [albumName, setAlbumName] = useState("");

  const handleSubmit = () => {
    handleCreateAlbum(albumName);
    setAlbumName("");
  };

  return (
    <div className="flex-1 flex justify-between px-4 pt-4 sm:px-6">
      <div className="flex-1 flex">
        <form className="w-full flex md:ml-0" action="#" method="GET">
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <label
              htmlFor="name"
              className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
            >
              Create New Album
            </label>
            <input
              name="name"
              id="name"
              className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:hidden"
              placeholder="New Album Name"
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
            <input
              name="name"
              id="name"
              className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
              placeholder="New Album Name"
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
        <CreateAlbumButton onClick={handleSubmit} />
      </div>
    </div>
  );
}

function MainContentHeader({ setMobileMenuOpen, children }) {
  return (
    <header className="w-full">
      <div className="relative z-10 flex-shrink-0 h-20 bg-white border-b border-gray-200 shadow-sm flex">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        {children ? children : React.null}
      </div>
    </header>
  );
}

function MainContentBody({ getAlbumsStatus, albums, setSelectedAlbum }) {
  return (
    <div className="flex-1 flex items-stretch overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <h1 className="flex-1 text-2xl font-bold text-gray-900">Albums</h1>
          </div>

          <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
            <TableComponent
              getAlbumsStatus={getAlbumsStatus}
              albums={albums}
              setSelectedAlbum={setSelectedAlbum}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function MainContentSection({ setMobileMenuOpen, setSelectedAlbum }) {
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
      <MainContentHeader setMobileMenuOpen={setMobileMenuOpen}>
        <SearchBar handleCreateAlbum={handleCreateAlbum} />
      </MainContentHeader>
      <MainContentBody
        getAlbumsStatus={getAlbumsStatus}
        albums={albums}
        setSelectedAlbum={setSelectedAlbum}
      />
    </>
  );
}

function EmptyPhotosCard() {
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <div className="text-center lg:w-2/3 w-full">
          <p className="mb-8 leading-relaxed">
            You may need to select an album to view photos
          </p>
          <div className="flex justify-center">
            <Link
              to="/app/albums"
              className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Choose Album
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PigSection({ setMobileMenuOpen, selectedAlbum }) {
  const { currentUser } = useAuth();
  const [getAlbumJson, getAlbumJsonStatus, albumJson] =
    useGetAlbumJson(currentUser);
  const [selectedUserId, _setSelectedUserId] = useState(0);

  // const { album_name } = useParams();

  useEffect(() => {
    if (getAlbumJsonStatus == FetchStatus.FetchNotCalled) {
      getAlbumJson(selectedAlbum);
    }
  }, []);

  const recommendedPhotos = (selectedUserId) => {
    const recommendations = albumJson.recommendations;
    const photos = _.find(recommendations, function (o) {
      return o.label == selectedUserId;
    }).photos;
    const imageData = photos.map((photo) => {
      return {
        dominantColor: "#0C0E14",
        url: `http://192.168.1.13:8081/static_sm/${selectedAlbum}/${photo}`,
        date: "22 October 2017",
        aspectRatio: 1.5,
      };
    });
    return imageData;
  };

  const rederPig = (getAlbumJsonStatus) => {
    switch (getAlbumJsonStatus) {
      case FetchStatus.FetchSuccess:
        return (
          <Pig
            imageData={recommendedPhotos(selectedUserId)}
            gridGap={2}
            bgColor="hsla(211, 50%, 98%)"
            groupGapLg={50}
            groupGapSm={20}
            breakpoint={800}
            // sortByDate
            // groupByDate
          />
        );
      default:
        return (
          <>
            <ClockIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            <span className="ml-3">Loading Please Wait</span>
          </>
        );
    }
  };

  return (
    <>
      <MainContentHeader setMobileMenuOpen={setMobileMenuOpen} />
      {selectedAlbum ? rederPig(getAlbumJsonStatus) : <EmptyPhotosCard />}
    </>
  );
}

function Sidebar({ url, navigation }) {
  return (
    <div className="hidden w-28 bg-indigo-700 overflow-y-auto md:block">
      <div className="w-full py-6 flex flex-col items-center">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
              alt="Workflow"
            />
          </Link>
        </div>
        <div className="flex-1 mt-6 w-full px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={`${url}/${item.href}`}
              className={classNames(
                item.current
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-white"
                    : "text-indigo-300 group-hover:text-white",
                  "h-6 w-6"
                )}
                aria-hidden="true"
              />
              <span className="mt-2">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ url, navigation, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <Transition.Root show={mobileMenuOpen} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-40 flex md:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative max-w-xs w-full bg-indigo-700 pt-5 pb-4 flex-1 flex flex-col">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-1 right-0 -mr-14 p-1">
                <button
                  type="button"
                  className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  <span className="sr-only">Close sidebar</span>
                </button>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 px-4 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                alt="Workflow"
              />
            </div>
            <div className="mt-5 flex-1 h-0 px-2 overflow-y-auto">
              <nav className="h-full flex flex-col">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={`${url}/${item.href}`}
                      className={classNames(
                        item.current
                          ? "bg-indigo-800 text-white"
                          : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                        "group py-2 px-3 rounded-md flex items-center text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-white"
                            : "text-indigo-300 group-hover:text-white",
                          "mr-3 h-6 w-6"
                        )}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </Transition.Child>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default function AppPage({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  let { path, url } = useRouteMatch();
  let location = useLocation();

  const navigation = [
    // { name: "Home", href: "", icon: HomeIcon, current: false },
    {
      name: "Albums",
      href: "albums",
      icon: CollectionIcon,
      current: location.pathname === "/app/albums",
    },
    {
      name: "Photos",
      href: "photos",
      icon: PhotographIcon,
      current: location.pathname === "/app/photos",
    },
    {
      name: "Profile",
      href: "profile",
      icon: UserIcon,
      current: location.pathname === "/app/prifile",
    }, // TODO:
    // { name: "Logout", href: "", icon: LogoutIcon, current: false },
  ];
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Narrow sidebar */}
      <Sidebar url={url} navigation={navigation} />
      <MobileMenu
        url={url}
        navigation={navigation}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        <Switch>
          <Route exact path={path}>
            <MainContentSection setMobileMenuOpen={setMobileMenuOpen} />
          </Route>
          <Route exact path={`${path}/photos`}>
            <PigSection
              setMobileMenuOpen={setMobileMenuOpen}
              selectedAlbum={selectedAlbum}
            />
          </Route>
          <Route path={`${path}/albums`}>
            <MainContentSection
              setMobileMenuOpen={setMobileMenuOpen}
              setSelectedAlbum={setSelectedAlbum}
            />
          </Route>
          <Route path={`${path}/upload/:album_name`}>
            <MainContentHeader setMobileMenuOpen={setMobileMenuOpen} />
            <Upload />
          </Route>
          <Route path={`${path}/profile`}>
            <MainContentHeader setMobileMenuOpen={setMobileMenuOpen} />
            <Profile />
          </Route>
          <Route path={`${path}/login`}>
            <MainContentHeader setMobileMenuOpen={setMobileMenuOpen} />
            <LoginSection />
          </Route>
        </Switch>
        {children}
      </div>
    </div>
  );
}
