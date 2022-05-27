const Router = ReactRouterDOM.BrowserRouter;
const { useParams } = ReactRouterDOM;

function FollowProfile() {

    let { followerId } = useParams();

    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [image_file, setImageFile] = React.useState("");
    const [city, setCity] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [last_seen, setLastSeen] = React.useState("");
    const [breed, setBreed] = React.useState("");

    React.useEffect(() => {
        const data = new FormData();
        data.append("user_id", followerId);
        fetch("/user.json", {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then((result) => {
                setZipCode(result.zip_code);
                setAboutMe(result.about_me);
                setBreed(result.breed);
                setImageFile(result.image_file);
                setCity(result.city);
                let date = new Date(result.last_seen);
                date = date.toLocaleString();
                setLastSeen(date);
                setStatus(result.status);
            });
    }, []);

    let location = `http://maps.google.com/?q=${zip_code}`

    return (
        <div className="profile">
            <img className="profile-img" src={image_file} alt="profile picture" />
            <p>About me: {about_me}</p>
            <p>Last seen: {last_seen}</p>
            <p>Status: {status} </p>
            <p>Breed: {breed} </p>
            {/* <p>From: <a href={location}> {city}</a></p> */}

        </div>
    );

}