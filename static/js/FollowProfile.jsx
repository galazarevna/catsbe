function FollowProfile() {

    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [image_file, setImageFile] = React.useState("");
    const [city, setCity] = React.useState("");

    React.useEffect(() => {
        fetch("/user.json")
            .then(response => response.json())
            .then((result) => {
                setZipCode(result.zip_code);
                setAboutMe(result.about_me);
                setImageFile(result.image_file);
                setCity(result.city);
            });
    }, []);

    let location = `http://maps.google.com/?q=${zip_code}`

    return (
        <div className="profile">
            <img className="profile-img" src={image_file} alt="profile picture" />
            <p>About me: {about_me}</p>
            <p>From: <a href={location}> {city}</a></p>
        </div>
    );
}