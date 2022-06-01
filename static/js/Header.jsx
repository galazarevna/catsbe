function Header() {

    const [username, setUsername] = React.useState("");
    const [last_seen, setLastSeen] = React.useState("");
    const [explore, setExplore] = React.useState("none");
    const [welcome, setWelcome] = React.useState("");
    const [transition, setTransition] = React.useState("hide");

    React.useEffect(() => {
        fetch("/current-user.json")
            .then(response => response.json())
            .then((result) => {
                setUsername(result.username);
                let date = new Date(result.last_seen);
                date = date.toLocaleString();
                setLastSeen(date);
                setTransition("show")
            });
    }, []);

    return (
        <header className="page-header">
            <div></div>
            <h1>Catsbe</h1>
            <Link className="home" id="home" to="/"> <img onClick={() => { setExplore("none"); setWelcome("") }} className="logo" src="static/img/home_icon.jpeg" alt="home" /></Link>
            <Link className="home" id="explore" to="/users-nearby"> <img onClick={() => { setExplore(""); setWelcome("none") }} className="logo" src="static/img/globe.webp" alt="explore" data-bs-toggle="tooltip" title="Explore users nearby!" /></Link>
            <div>
                <h1 style={{ display: welcome }} className={transition} >Hi {username}!</h1>
                <h1 style={{ display: explore }} className={transition} >{username}, explore users nearby!</h1>
            </div>
            <div className="last-seen"><h1></h1>Last seen: {last_seen}</div>
            <Link className="home" id="settings" to="/settings"> <img className="logo" src="static/img/settings_icon.png" alt="settings" /></Link>
            <Link className="home" id="logout" to="/logout"> <img className="logo" src="static/img/logout_icon.png" alt="logout" /></Link>
            <div></div>
        </header>
    );
}