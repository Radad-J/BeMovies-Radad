async function queryMovieDB (url, authToken) {
    const response = await fetch(url, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${authToken}`
        }
    });
    const jsonObject = await response.json().then((data) => {
        return data
    });
    return jsonObject;
}


export default queryMovieDB
