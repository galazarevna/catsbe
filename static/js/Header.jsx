function Header() {

    const [username, setUsername] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [last_seen, setLastSeen] = React.useState("");
    const [display, setDisplay] = React.useState("none");

    React.useEffect(() => {
        fetch("/current-user.json")
            .then(response => response.json())
            .then((result) => {
                setUsername(result.username);
                setStatus(result.status);
                let date = new Date(result.last_seen);
                date = date.toLocaleString();
                setLastSeen(date);
            });
    }, []);


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
        <header className="page-header">
            <Link className="home" id="home" to="/"> <img className="logo" src="static/img/home_icon.jpeg" alt="home" /></Link>
            <Link className="home" id="explore" to="/users-nearby"> <img className="logo" src="static/img/globe.webp" alt="explore" /></Link>
            <h1>Hi {username}!</h1>
            <main>
                <p>Last seen: {last_seen}</p>
                <label htmlFor="status">
                    <p>Status: {status} </p>
                </label>
                <input type="text" placeholder="What's on your mind?" style={{ display }} onClick={() => setDisplay("")} id="status" name="status" onBlur={handleStatus} />
            </main>
            <Link className="home" id="settings" to="/settings"> <img className="logo" src="static/img/settings_icon.png" alt="settings" /></Link>
            <Link className="home" id="explore" to="/logout"> <img className="logo" src="static/img/logout_icon.png" alt="logout" /></Link>
        </header>
    );
}