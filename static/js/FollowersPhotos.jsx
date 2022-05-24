const Router = ReactRouterDOM.BrowserRouter;
const { useParams } = ReactRouterDOM;


function FollowersPhotosContainer() {
  let { followerId } = useParams();
  const [photos, setPhotos] = React.useState([]);

  React.useEffect(() => {
    const data = JSON.stringify({ "user_id": followerId });
    fetch("followers_photos.json", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
      .then((response) => response.json())
      .then((data) => setPhotos(data.images))
  }, []);


  const all_photos = [];

  for (const photo of photos) {
    all_photos.push(
      <UserPhoto
        description={photo.description}
        imgUrl={photo.img_url}
        imageId={photo.image_id}
        key={photo.image_id}
        userId={photo.curr_user_id}
        followerId={photo.user_id}
        activeLike={photo.active_like}
        numLikes={photo.num_of_likes}
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