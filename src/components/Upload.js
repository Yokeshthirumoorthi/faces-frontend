import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";
import { useProcessAlbum } from "../hooks/server";

import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImagePreview);

function ProcessAlbumButton({ albumName }) {
  const { currentUser } = useAuth();
  const [processAlbum, processAlbumStatus] = useProcessAlbum(currentUser);

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

export default function Filepond() {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const { album_name } = useParams();

  return (
    <div className="App">
      <ProcessAlbumButton albumName={album_name} />
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxParallelUploads={25}
        name="file"
        server={{
          process: async (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort,
            transfer,
            options
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
