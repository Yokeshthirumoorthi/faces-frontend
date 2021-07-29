import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Spinner, Table } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FetchStatus, useGetAlbums } from "../hooks/server";
import { Link, useHistory } from "react-router-dom";

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
              <Link to="/update-profile" className="btn btn-primary">
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

  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Albums</h2>
        <TableComponent getAlbumsStatus={getAlbumsStatus} albums={albums} />
      </Card.Body>
    </Card>
  );
}
