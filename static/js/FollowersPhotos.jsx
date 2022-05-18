const Router = ReactRouterDOM.BrowserRouter;
const { useParams } = ReactRouterDOM;


function Photo(props) {
  return (
    <div className="photo">
      <img src={props.imgUrl} alt="user-photos" />
      <h4>Description: {props.description}</h4>
    </div>
  );
}

function FollowersPhotosContainer() {
  let { userId } = useParams();
  const [photos, setPhotos] = React.useState([]);

  React.useEffect(() => {
    const data = new FormData();
    data.append("user_id", userId);
    fetch("followers_photos.json", {
      method: "POST",
      body: data
    })
      .then((response) => response.json())
      .then((data) => setPhotos(data.images))
  }, []);

  
  const all_photos = [];

  for (const photo of photos) {
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
      <h2>All Photos</h2>
      <div className="grid">{all_photos}</div>
    </React.Fragment>
  );
}