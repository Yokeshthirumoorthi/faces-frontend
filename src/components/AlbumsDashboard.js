import React, { useState, useEffect } from "react";
import { Card, Button, Form, Spinner, Table } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchStatus,
  useGetAlbums,
  SaveStatus,
  useCreateAlbum,
} from "../hooks/server";
import { Link, useHistory } from "react-router-dom";

function CreateAlbumForm({ handleCreateAlbum }) {
  const [albumName, setAlbumName] = useState("");

  const handleSubmit = () => {
    handleCreateAlbum(albumName);
    setAlbumName("");
  };

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group id="albumName">
            <Form.Label>Create New Album</Form.Label>
            <Form.Control
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </Form.Group>
          <Button className="w-100" onClick={handleSubmit}>
            Create
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

function AlbumsListTable({ albums }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Photos (WIP)</th>
          <th>Upload</th>
        </tr>
      </thead>
      <tbody>
        {albums.map((album) => (
          <tr key={album}>
            <td>{album}</td>
            <td>-</td>
            <td>
              <Link to={`/upload/${album}`} className="btn btn-primary">
                Upload
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function TableComponent({ getAlbumsStatus, albums }) {
  switch (getAlbumsStatus) {
    case FetchStatus.FetchSuccess:
      return <AlbumsListTable albums={albums} />;
    default:
      return (
        <Spinner
          animation="border"
          role="status"
          className="text-center mb-4"
        />
      );
  }
}

export default function AlbumsDashboard() {
  const { currentUser } = useAuth();
  const [getAlbums, getAlbumsStatus, albums] = useGetAlbums(currentUser);
  const [createAlbum, createAlbumStatus] = useCreateAlbum(currentUser);

  useEffect(() => {
    getAlbums();
  }, []);

  let handleCreateAlbum = (albumName) => {
    createAlbum(albumName, getAlbums);
  };

  return (
    <>
      <CreateAlbumForm handleCreateAlbum={handleCreateAlbum} />
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Albums</h2>
          <TableComponent getAlbumsStatus={getAlbumsStatus} albums={albums} />
        </Card.Body>
      </Card>
    </>
  );
}
