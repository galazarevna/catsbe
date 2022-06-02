function UserProfile() {

    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [image_file, setImageFile] = React.useState("static/img/default.jpg");
    const [breed, setBreed] = React.useState("");
    const [city, setCity] = React.useState("");
    const [file, setFile] = React.useState("");
    const [uploadStatus, setUploadStatus] = React.useState(false);
    const [button, setButton] = React.useState(false);
    const [display, setDisplay] = React.useState("none");
    const [status, setStatus] = React.useState("");
    const [transition, setTransition] = React.useState("hide");


    React.useEffect(() => {
        fetch("/current-user.json")
            .then(response => response.json())
            .then((result) => {
                setTransition("show")
                setStatus(result.status);
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

    const handleStatus = (e) => {
        setStatus(e.target.value);
        setDisplay("none");
        const data = new FormData();
        data.append("status", e.target.value);
        fetch("/update-status", {
            method: "POST",
            body: data
        })
            .catch((err) => console.log(err));
    };

    return (
        <div className="profile">
            <div><h4>About me: {about_me}</h4></div>
            <div>
                <input type="file" id="upload" accept="image/*" style={{ display: "none" }} onChange={fileHandler}></input>
                <label htmlFor="upload">
                    <img className="profile-img" class={transition} src={image_file} alt="profile picture" />
                </label>
                {button ? <button onClick={uploadNewPhoto}>Apply changes</button> : ""}
                {uploadStatus ? <p>Photo updated!</p> : ""}
            </div>
            <div><h7 className={transition}>Breed: {breed} </h7></div>
            <div><h7 className={transition}>From: <a href={location}> {city}</a></h7></div>

            <div>
                <label htmlFor="status">
                    <h5 className={transition}>Status: {status} </h5>
                </label>
                <div>
                    <input type="text" placeholder="What's on your mind?" style={{ display }} onClick={() => setDisplay("")} id="status" name="status" onBlur={handleStatus} />
                </div>
            </div>
        </div>
    );
}