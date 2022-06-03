function UserPhoto(props) {

  const [activeLike, setActiveLike] = React.useState(props.activeLike);
  const [numLikes, setNumLikes] = React.useState(props.numLikes);


  function HandleLike() {
    const data = JSON.stringify({ "user_id": props.userId, "image_id": props.imageId });

    if (activeLike) {
      setActiveLike(false);
      setNumLikes(numLikes - 1);

    } else {
      setActiveLike(true);
      setNumLikes(numLikes + 1);
    }

    fetch("/update-like", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
      .catch((err) => console.log(err));
  }

  return (
    <div className="user-photo-wrapper">
      <div>
        <img className="user-photo" src={props.imgUrl} alt="user-photos" />
      </div>
      <div>
        <h5>{props.description}</h5>
      </div>
      <section className="likes-comments">
        <span className="heart">
          <button className="heart-button" onClick={HandleLike}>
            <div>
              <span>
                {activeLike ?
                  <svg viewBox="0 0 277.363 277.363" shapeRendering="geometricPrecision" textRendering="geometricPrecision" width="30" height="30" fill="#1e81b0">
                    <path d="M138.685196,149.806361C124.748144,128.831067,97.89839,119.131542,72.786,148.583c-15.631936,28.002221,2.349981,61.791067,17.424,75.178399c11.07095,13.565817,35.343294,31.329442,48.461,36.029378c15.207266-8.189829,38.829363-22.855409,44.782-30.972623c20.45889-17.707745,39.273642-54.262521,21.125-79.531154-14.875175-25.956095-46.26721-25.207862-65.892804.519361Z" stroke="#000" strokeWidth="4" /><path d="M15.423102,84.42C1.103012,90.018323,1.813192,119.170978,10.452,130.190613c10.817034,18.31563,26.706258,12.897412,27.784,13.374387c11.516962-3.610829,19.671633-21.627151,13.848574-38.046C45.302831,85.63861,28.448082,75.105545,15.423102,84.42Z" transform="translate(10.745604-.088881)" stroke="#000" strokeWidth="4" /><path d="M83.689292,17.066547C68.468973,23.003333,62.964394,47.232177,67.083,64.333c5.227493,28.610051,25.81537,46.802594,45.682632,33.388999c14.322874-9.47451,17.274198-33.630444,13.962368-47.786546-4.907599-26.024944-30.868624-40.387376-43.038708-32.868906Z" transform="translate(.310478 12.976175)" stroke="#000" strokeWidth="4" /><path d="M187.17,17.066548c-22.065715-2.08086-33.077635,17.836231-36.517,32.868906-3.630943,29.548533,9.037602,42.642193,12.68018,46.026546c22.248388,15.198574,44.194098-5.295653,48.571147-31.628999c5.604677-20.235343-9.904228-46.260982-24.734327-47.266453Z" transform="translate(-1.16742 11.344612)" stroke="#000" strokeWidth="4" /><path d="M257.613,81.042358c-20.592627-3.482311-29.287574,14.161918-32.334574,26.748642-3.186202,17.461745,5.285675,34.859135,16.142574,35.774c11.364534,2.379994,26.42001-9.493305,30.000313-23.99c6.741411-20.32076-3.794178-34.866218-13.808313-38.532642Z" transform="translate(-8.217224 0.168629)" stroke="#000" strokeWidth="4" /><path d="" stroke="#000" strokeWidth="0.554726" /><path d="" stroke="#000" strokeWidth="4" /><path d="" stroke="#000" strokeWidth="0.554726" /></svg> :
                  <svg viewBox="0 0 277.363 277.363" shapeRendering="geometricPrecision" textRendering="geometricPrecision" width="30" height="30" fill="#FFFFFF">
                    <path d="M138.685196,149.806361C124.748144,128.831067,97.89839,119.131542,72.786,148.583c-15.631936,28.002221,2.349981,61.791067,17.424,75.178399c11.07095,13.565817,35.343294,31.329442,48.461,36.029378c15.207266-8.189829,38.829363-22.855409,44.782-30.972623c20.45889-17.707745,39.273642-54.262521,21.125-79.531154-14.875175-25.956095-46.26721-25.207862-65.892804.519361Z" stroke="#000" strokeWidth="4" /><path d="M15.423102,84.42C1.103012,90.018323,1.813192,119.170978,10.452,130.190613c10.817034,18.31563,26.706258,12.897412,27.784,13.374387c11.516962-3.610829,19.671633-21.627151,13.848574-38.046C45.302831,85.63861,28.448082,75.105545,15.423102,84.42Z" transform="translate(10.745604-.088881)" stroke="#000" strokeWidth="4" /><path d="M83.689292,17.066547C68.468973,23.003333,62.964394,47.232177,67.083,64.333c5.227493,28.610051,25.81537,46.802594,45.682632,33.388999c14.322874-9.47451,17.274198-33.630444,13.962368-47.786546-4.907599-26.024944-30.868624-40.387376-43.038708-32.868906Z" transform="translate(.310478 12.976175)" stroke="#000" strokeWidth="4" /><path d="M187.17,17.066548c-22.065715-2.08086-33.077635,17.836231-36.517,32.868906-3.630943,29.548533,9.037602,42.642193,12.68018,46.026546c22.248388,15.198574,44.194098-5.295653,48.571147-31.628999c5.604677-20.235343-9.904228-46.260982-24.734327-47.266453Z" transform="translate(-1.16742 11.344612)" stroke="#000" strokeWidth="4" /><path d="M257.613,81.042358c-20.592627-3.482311-29.287574,14.161918-32.334574,26.748642-3.186202,17.461745,5.285675,34.859135,16.142574,35.774c11.364534,2.379994,26.42001-9.493305,30.000313-23.99c6.741411-20.32076-3.794178-34.866218-13.808313-38.532642Z" transform="translate(-8.217224 0.168629)" stroke="#000" strokeWidth="4" /><path d="" stroke="#000" strokeWidth="0.554726" /><path d="" stroke="#000" strokeWidth="4" /><path d="" stroke="#000" strokeWidth="0.554726" /></svg>}
              </span>
            </div>
          </button>
          {numLikes > 0 ? <span> Likes: {numLikes}</span> : ""}
          <span></span>
        </span>
      </section>
    </div>
  );
}

function AddPhoto(props) {
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  function uploadNewPhoto() {
    const data = new FormData();
    data.append("file", image);
    data.append("description", description);
    fetch('/add-photo', {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then((data) => {
        const photoAdded = data.photoAdded;
        const { image_id: imageId, description: description, img_url: imgUrl } = photoAdded;
        props.addPhoto(imageId, description, imgUrl);
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className="add-photo">
        <h4>The World Is Waiting for Your New Photo!</h4>
        <p></p>
        <label htmlFor="descriptionInput">
          Description
          <input
            value={description}
            onChange={event => setDescription(event.target.value)}
            id="descriptionInput"
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label htmlFor="photoUpload" style={{ marginLeft: '10px', marginRight: '5px' }}>
          <input type="file" accept="image/jpeg" onChange={(e) => setImage(e.target.files[0])} id="photoUpload" />
        </label>
        <button type="button" style={{ marginLeft: '10px', borderRadius: '12px' }} onClick={uploadNewPhoto} >
          Add Photo
        </button>
      </div >
    </React.Fragment>
  );
}

function UserPhotosContainer() {
  const [photos, setPhotos] = React.useState([]);

  function getPhotos() {
    fetch("/photos.json")
      .then((response) => response.json())
      .then((data) => setPhotos(data.images))
  }

  function addPhoto() {
    getPhotos();
  }

  React.useEffect(() => {
    getPhotos()
  }, [])

  const all_photos = [];

  for (const photo of photos) {
    all_photos.push(
      <UserPhoto
        description={photo.description}
        imgUrl={photo.img_url}
        imageId={photo.image_id}
        key={photo.image_id}
        userId={photo.user_id}
        activeLike={photo.active_like}
        numLikes={photo.num_of_likes}
      />,
    );
  }

  return (
    <React.Fragment>
      <div>
        <AddPhoto addPhoto={addPhoto} />
      </div>
      <div className="all-photos">
        <h4>Your Photos</h4>
        <div className="grid">{all_photos}</div>
      </div>
    </React.Fragment>
  );
}