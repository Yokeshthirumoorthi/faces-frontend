import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import { useProcessAlbum, getAlbumUploadStatus } from "../hooks/server";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "./filepond.css";

// Register the plugins
registerPlugin(FilePondPluginImagePreview);

function ProcessAlbumButton({ albumName }) {
  const { currentUser } = useAuth();
  const [processAlbum, _processAlbumStatus] = useProcessAlbum(currentUser);

  function handleProcessAlbum() {
    console.log("Processing Album");
    processAlbum(albumName);
  }

  return (
    <Button variant="link" onClick={handleProcessAlbum}>
      Process Album
    </Button>
  );
}

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
  const initalState = {
    uploaded: 0,
    pending: 0,
    success: 0,
    failure: 0,
  };
  const [stat, setStat] = useState(initalState);
  const statRef = useRef(initalState);

  const { album_name } = useParams();

  async function getStatus(taskId) {
    const taskStatus = await getAlbumUploadStatus(currentUser, taskId);
    if (
      statRef.current.uploaded ===
      statRef.current.success + statRef.current.failure
    ) {
      setShowProgressBar(false);
      return;
    }
    if (taskStatus === "SUCCESS") {
      statRef.current = {
        ...statRef.current,
        pending: statRef.current.pending - 1,
        success: statRef.current.success + 1,
      };
    }
    if (taskStatus === "FAILURE") {
      statRef.current = {
        ...statRef.current,
        pending: statRef.current.pending - 1,
        failure: statRef.current.failure + 1,
      };
    }

    setStat(statRef.current);

    setTimeout(function () {
      getStatus(taskId);
    }, 2000);
  }

  function uploadAndTrackStatus(files) {
    setFiles(files);
    statRef.current = {
      uploaded: files.length,
      pending: 0,
      success: 0,
      failure: 0,
    };
    setStat(statRef.current);
    setShowProgressBar(true);
  }

  function formatUploadStat(stats) {
    return [
      { name: "Files Uploaded", stat: stats.uploaded },
      { name: "Total Pending", stat: stats.pending },
      { name: "Total Success", stat: stats.success },
      { name: "Total Failure", stat: stats.failure },
    ];
  }

  return (
    <div className="App">
      {/* <ProcessAlbumButton albumName={album_name} /> */}
      <UploadStat uploadStat={formatUploadStat(stat)} />
      {showProgressBar && <ProgressBar stat={stat} />}
      <FilePond
        files={files}
        onupdatefiles={uploadAndTrackStatus}
        allowMultiple={true}
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
                statRef.current = {
                  ...statRef.current,
                  pending: statRef.current.pending + 1,
                };
                const taskID = JSON.parse(request.responseText)["task_id"];
                getStatus(taskID);
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
