import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchStatus,
  useProcessAlbum,
  getAlbumUploadStatus,
} from "../hooks/server";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileSizeValidation from "filepond-plugin-file-validate-size";
// import "filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.css";
import "./filepond.css";

// Register the plugins
registerPlugin(FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileSizeValidation);

// function ProcessAlbumButton({ albumName }) {
//   const { currentUser } = useAuth();
//   const [processAlbum, _processAlbumStatus] = useProcessAlbum(currentUser);

//   function handleProcessAlbum() {
//     console.log("Processing Album");
//     processAlbum(albumName);
//   }

//   return (
//     <Button variant="link" onClick={handleProcessAlbum}>
//       Process Album
//     </Button>
//   );
// }

function UploadStat({ uploadStat }) {
  return (
    <div>
      <dl className="m-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {uploadStat.map((item) => (
          <div
            key={item.name}
            className="px-4 py-1 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt className="text-sm font-medium text-gray-500 truncate">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ProgressBar({ stat }) {
  const imageProcessingPercentComplete = Math.round(
    ((stat.success + stat.failure) * 100) / stat.uploaded
  );
  const imageUploadPercentComplete = Math.round(
    (stat.pending * 100) / stat.uploaded
  );
  return (
    <div className="relative pl-5 pr-5">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
            Task in progress
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-green-600">
            {`${imageProcessingPercentComplete}%`}
          </span>
        </div>
      </div>

      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
        <div
          style={{ width: `${imageProcessingPercentComplete}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
        ></div>
        <div
          style={{ width: `${imageUploadPercentComplete}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
        ></div>
      </div>
    </div>
  );
}

export default function Filepond() {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [processAlbum, processAlbumStatus] = useProcessAlbum(currentUser);
  const initialStat = {
    uploaded: 0,
    pending: 0,
    success: 0,
    failure: 0,
  };
  const [stat, setStat] = useState(initialStat);
  const taskIdsRef = useRef([]);

  const { album_name } = useParams();

  async function trackUploadStatus(stat, taskIds) {
    const uploadStatus = await getAlbumUploadStatus(currentUser, taskIds);
    if (uploadStatus.is_all_tasks_done) {
      setShowProgressBar(false);
      setStat({
        ...stat,
        pending: taskIdsRef.current.length,
        success: uploadStatus.success,
        failure: uploadStatus.failure,
      });
      processAlbum(album_name);
      return false;
    }
    setStat({
      ...stat,
      pending: taskIdsRef.current.length,
      success: uploadStatus.success,
      failure: uploadStatus.failure,
    });
    setTimeout(function () {
      trackUploadStatus(stat, taskIdsRef.current);
    }, 2000);
  }

  function uploadAndTrackStatus(files) {
    setFiles(files);
    const newStat = {
      ...stat,
      uploaded: files.length,
    };
    setStat(newStat);
    setShowProgressBar(true);
    trackUploadStatus(newStat, taskIdsRef.current);
  }

  function formatUploadStat(stats) {
    return [
      { name: "Files Uploaded", stat: stats.uploaded },
      { name: "Total Pending", stat: stats.pending },
      { name: "Total Success", stat: stats.success },
      { name: "Total Failure", stat: stats.failure },
    ];
  }

  function renderProcessAlbumSpinner(processAlbumStatus) {
    console.log(processAlbumStatus);
    switch (processAlbumStatus) {
      case FetchStatus.Fetching:
        return (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Processing Your Album
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please Wait and donot close this page
            </p>
          </div>
        );
      default:
        return React.null;
    }
  }

  return (
    <div className="App">
      {/* <ProcessAlbumButton albumName={album_name} /> */}
      <UploadStat uploadStat={formatUploadStat(stat)} />
      {showProgressBar && <ProgressBar stat={stat} />}
      {renderProcessAlbumSpinner(processAlbumStatus)}
      <FilePond
        files={files}
        onupdatefiles={uploadAndTrackStatus}
        allowMultiple={true}
        allowFileSizeValidation={true}
        maxFileSize={"5MB"}
        maxParallelUploads={25}
        name="file"
        instantUpload={true}
        chunkUploads={true}
        chunkSize={10000}
        allowRevert={false}
        server={{
          process: async (
            fieldName,
            file,
            _metadata,
            load,
            error,
            progress,
            _abort,
            _transfer,
            _options
          ) => {
            const idToken = await currentUser.getIdToken(
              /* forceRefresh */ true
            );

            // fieldName is the name of the input field
            // file is the actual file object to send
            const formData = new FormData();
            formData.append(fieldName, file, file.name);

            const request = new XMLHttpRequest();
            request.open(
              "POST",
              `http://192.168.1.13:8081/api/v1/upload/${currentUser.uid}/${album_name}`
            );

            request.setRequestHeader("Authorization", "Bearer " + idToken);

            // Should call the progress method to update the progress to 100% before calling load
            // Setting computable to false switches the loading indicator to infinite mode
            request.upload.onprogress = (e) => {
              progress(e.lengthComputable, e.loaded, e.total);
            };

            // Should call the load method when done and pass the returned server file id
            // this server file id is then used later on when reverting or restoring a file
            // so your server knows which file to return without exposing that info to the client
            request.onload = function () {
              if (request.status >= 200 && request.status < 300) {
                // the load method accepts either a string (id) or an object
                load(request.responseText);

                const taskID = JSON.parse(request.responseText)["task_id"];

                taskIdsRef.current = [...taskIdsRef.current, taskID];
                // setStat({
                //   ...stat,
                //   pending: taskIdsRef.current.length,
                // });
              } else {
                // Can call the error method if something is wrong, should exit after
                error("oh no");
              }
            };

            request.send(formData);
          },
        }}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
}
