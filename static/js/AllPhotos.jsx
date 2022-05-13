function Photo(props) {
  return (
    <div className="photo">
      <img src={props.imgUrl} alt="user-photos" />
      <h4>Description: {props.description}</h4>
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
      <h2>Add New Photo</h2>
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
        <input type="file" onChange={(e) => setImage(e.target.files[0])} id="photoUpload" />
      </label>
      <button type="button" style={{ marginLeft: '10px' }} onClick={uploadNewPhoto} >
        Add Photo!
      </button>
    </React.Fragment>
  );
}

function AllPhotosContainer() {
  const [photos, setPhotos] = React.useState([]);

  function getPhotos() {
    fetch('/photos.json')
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
    console.log(photo);
    all_photos.push(
      <Photo
        description={photo.description}
        imgUrl={photo.img_url}
        key={photo.image_id}
      />,
    );
  }

  return (
    <React.Fragment>
      <AddPhoto addPhoto={addPhoto} />
      <h2>All Photos</h2>
      <div className="grid">{all_photos}</div>
    </React.Fragment>
  );
}