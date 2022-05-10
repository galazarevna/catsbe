function UserProfile() {

    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [image_file, setImageFile] = React.useState("");
    const [city, setCity] = React.useState("");


    React.useEffect(() => {
        fetch("/user.json")
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            setZipCode(result.zip_code);
            setAboutMe(result.about_me);
            setImageFile(result.image_file);
            setCity(result.city);
        });
      }, []);

    let location = `http://maps.google.com/?q=${zip_code}`

    return (
        <div className="profile">
        <img src={image_file} alt="profile" />
        <p>About me: {about_me}</p>
        <p>From: <a href={location}> {city}</a></p>
        </div>
    );
}

function AddImage() {
  const [image, setImage] = React.useState("");
  const [url, setUrl] = React.useState("");
  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    fetch("/upload_file", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        ></input>
        <button onClick={uploadImage}>Upload</button>
      </div>
      <div>
        <h1>Uploaded image will be displayed here</h1>
        <img src={url} />
      </div>
    </div>
  );
};


function App() {
   return (
    <React.Fragment>
      <Header />
      <UserProfile />
      <AddImage />
      <AllUsersContainer />
      <AdoptCatNearMe />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.querySelector('#container'));
