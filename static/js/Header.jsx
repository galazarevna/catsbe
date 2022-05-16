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
                setLastSeen(result.last_seen);
            });
    }, []);

    const handleStatus = (e) => {
        setStatus(e.target.value);
        setDisplay("none");
        // fetch('/update-status', {
        //     method: "POST", PUT?
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({"status": status})
        // })
        //     .catch((err) => console.log(err));
        // update status in DB!
    };

    return (
        <header className="page-header">
            <h1>Hi {username}!</h1>
            <main>
                <p>Last seen: {last_seen}</p>
                <label htmlFor="status">
                    <p>Status: {status} </p>
                </label>
                <input type="text" placeholder="What's on your mind?" style={{ display }} onClick={() => setDisplay("")} id="status" name="status" onBlur={handleStatus} />
            </main>
        </header>
    );
}