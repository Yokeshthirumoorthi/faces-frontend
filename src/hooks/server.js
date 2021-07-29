import React from "react";
import axios from 'axios';

const FetchStatus = {
    FetchNotCalled: 'FetchNotCalled',
    Fetching: 'Fetching',
    FetchError: 'FetchError',
    FetchSuccess: 'FetchSuccess',
};

let useGetAlbums = (currentUser) => {
    const [getAlbumsStatus, dispatch] = React.useState(FetchStatus.FetchNotCalled)
    const [albums, setAlbums] = React.useState([])

    let getAlbums = async () => {
        dispatch(FetchStatus.Fetching);
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true)
        const headers = {
            'Authorization': `Bearer ${idToken}`,
        };
        const url = `http://192.168.1.13:8081/api/v1/gallery/${currentUser.uid}`
        const getAlbumsResponse  = await axios.get(url, { headers });

        setAlbums(getAlbumsResponse.data.gallery_list)

        dispatch(FetchStatus.FetchSuccess)
    }

    return [getAlbums, getAlbumsStatus, albums]
}

export {FetchStatus, useGetAlbums}