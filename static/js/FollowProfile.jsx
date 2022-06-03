const Router = ReactRouterDOM.BrowserRouter;
const { useParams } = ReactRouterDOM;

function FollowProfile() {

    let { followerId } = useParams();

    const [username, setUsername] = React.useState("");
    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [image_file, setImageFile] = React.useState("");
    const [city, setCity] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [last_seen, setLastSeen] = React.useState("");
    const [breed, setBreed] = React.useState("");
    const [transition, setTransition] = React.useState("hide");


    React.useEffect(() => {
        const data = new FormData();
        data.append("user_id", followerId);
        fetch("/user.json", {
            method: "POST",
            body: data
        })
            .then(response => response.json())
            .then((result) => {
                setTransition("show")
                setUsername(result.username);
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
            <div>
                <h4>About {username}: {about_me}</h4>
            </div>
            <div>
                <img className={transition} src={image_file} alt="profile picture" />
            </div>
            <p></p>
            <div><p>Last seen: {last_seen}</p></div>
            <div><h6 className={transition}>Breed: {breed} </h6></div>
            <div><h6 className={transition}>From: <a href={location}> {city}</a></h6></div>
            <div><h6 className={transition}>Status: {status} </h6></div>
        </div>
    );

}