function Header() {

    const [username, setUsername] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [last_seen, setLastSeen] = React.useState("");

    React.useEffect(() => {
        fetch("/current-user.json")
            .then(response => response.json())
            .then((result) => {
                setUsername(result.username);
                setStatus(result.status);
                setLastSeen(result.last_seen);
            });
    }, []);

    return (
        <header className="page-header">
            <h1>Hi {username}!</h1>
            <main>
                <p>Last seen: {last_seen}</p>
                <p>Status: {status}</p>
            </main>
        </header>
    );
}