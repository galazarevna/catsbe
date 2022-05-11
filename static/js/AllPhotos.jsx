function Photo(props) {
  return (
    <div className="photo">
      <img src={props.imgUrl} alt="user-photos" />
      <h4>Description: {props.description}</h4>
    </div>
  );
}

function AllPhotosContainer() {
  const [photos, setPhotos] = React.useState([]);

  React.useEffect(() => {
    fetch('/photos.json')
    .then((response) => response.json())
    .then((data) => setPhotos(data.images))
  }, [])

  const all_photos = [];

  for (const photo of photos) {
    all_photos.push(
      <Photo
        description={photo.description}
        imgUrl={photo.img_url}
        dateUploaded={photo.date_uploaded}
        userId={photo.user_id}
        key={photo.image_id}
      />,
    );
  }

  return (
    <React.Fragment>
      <h2>All Photos</h2>
      <div className="grid">{all_photos}</div>
    </React.Fragment>
  );
}