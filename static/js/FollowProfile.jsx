const Router = ReactRouterDOM.BrowserRouter;
const { useParams } = ReactRouterDOM;

function FollowProfile() {

    let { userId } = useParams();

    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [image_file, setImageFile] = React.useState("");
    const [city, setCity] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [last_seen, setLastSeen] = React.useState("");

    React.useEffect(() => {
        const data = new FormData();
        data.append("user_id", userId);
        fetch('/user.json', {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then((result) => {
                setZipCode(result.zip_code);
                setAboutMe(result.about_me);
                setImageFile(result.image_file);
                setCity(result.city);
                setLastSeen(result.last_seen);
                setStatus(result.status);
            });
    }, []);

    let location = `http://maps.google.com/?q=${zip_code}`

    return (
        <div className="profile">
            <img className="profile-img" src={image_file} alt="profile picture" />
            <p>About me: {about_me}</p>
            <p>From: <a href={location}> {zip_code}</a></p>
            <p>Last seen: {last_seen}</p>
            <p>Status: {status} </p>
            {/* <p>From: <a href={location}> {city}</a></p> */}

        </div>
    );

}