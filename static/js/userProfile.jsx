function UserProfile() {

    const [user, setUser] = React.useState("");
    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [last_seen, setLastSeen] = React.useState("");


    React.useEffect(() => {
        fetch("/user.json")
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            setUser(result.username);
            setZipCode(result.zip_code);
            setAboutMe(result.about_me);
            setLastSeen(result.last_seen);
        });
      }, []);

    let location = `http://maps.google.com/?q=${zip_code}`

    return (
        <div className="profile">
        <img src="/static/img/default.jpg" alt="profile" />
        <p>Name: {user}</p>
        <p>About me: {about_me}</p>
        <p>From: <a href={location}> {zip_code}</a></p>
        <p>Last seen: {last_seen}</p>

        </div>
    );
}

ReactDOM.render(<UserProfile />, document.querySelector('#container'));
