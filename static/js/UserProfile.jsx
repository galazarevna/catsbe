function UserProfile() {

    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [image_file, setImageFile] = React.useState("static/img/default.jpg");
    const [breed, setBreed] = React.useState("");
    const [city, setCity] = React.useState("");
    const [file, setFile] = React.useState("");
    const [uploadStatus, setUploadStatus] = React.useState(false);
    const [button, setButton] = React.useState(false);


    React.useEffect(() => {
        fetch("/current-user.json")
            .then(response => response.json())
            .then((result) => {
                setZipCode(result.zip_code);
                setAboutMe(result.about_me);
                setImageFile(result.image_file);
                setCity(result.city);
                setBreed(result.breed);
            });
    }, []);

    let location = `http://maps.google.com/?q=${zip_code}`


    function uploadNewPhoto() {
        const data = new FormData();
        data.append("file", file);
        fetch("/update-profile-photo", {
            method: "POST",
            body: data
        })
            .then((resp) => resp.json())
            .then((data) => {
                setImageFile(data.url);
            })
            .catch((err) => console.log(err));
        setUploadStatus(true)
        setButton(false)
    };


    const fileHandler = (e) => {

        const chosenFile = e.target.files[0];
        setFile(chosenFile)

        const reader = new FileReader();
        reader.onload = (e) => {
            const { result } = e.target;
            setImageFile(result)
        }
        reader.readAsDataURL(chosenFile);
        setUploadStatus(false)
        setButton(true)
    }

    return (
        <div className="profile">
            <input type="file" id="upload" accept="image/*" style={{ display: "none" }} onChange={fileHandler}></input>
            <label htmlFor="upload">
                <img className="profile-img" src={image_file} alt="profile picture" />
            </label>
            {button ? <button onClick={uploadNewPhoto}>Apply changes</button> : ""}
            {uploadStatus ? <p>Photo updated!</p> : ""}
            <p>About me: {about_me}</p>
            <p>Breed: {breed} </p>
            {/* <p>From: <a href={location}> {city}</a></p> */}
        </div>
    );
}