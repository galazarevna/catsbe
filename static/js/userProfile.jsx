function UserProfile() {

    const [user, setUser] = React.useState("");
    const [about_me, setAboutMe] = React.useState("");
    const [zip_code, setZipCode] = React.useState(0);
    const [last_seen, setLastSeen] = React.useState("");
    const [city, setCity] = React.useState("");


    React.useEffect(() => {
        fetch("/user.json")
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            setUser(result.username);
            setZipCode(result.zip_code);
            setAboutMe(result.about_me);
            setLastSeen(result.last_seen);
            setCity(result.city);
        });
      }, []);

    let location = `http://maps.google.com/?q=${zip_code}`

    return (
        <div className="profile">
        <img src="/static/img/default.jpg" alt="profile" />
        <p>Name: {user}</p>
        <p>About me: {about_me}</p>
        <p>From: <a href={location}> {city}</a></p>
        <p>Last seen: {last_seen}</p>

        </div>
    );
}


function User(props) {
  return (
    <div className="user">
      <h2>Name: {props.username}</h2>
      <img src="/static/img/default.jpg" alt="profile" />
      <h2>About me: {props.about_me}</h2>
      <h2>From: {props.zip_code}</h2>
      <h2>Last seen: {props.last_seen}</h2>
    </div>
  );
}

function AllUsersContainer(props) {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch('/users.json')
    .then((response) => response.json())
    .then((data) => setUsers(data.users))
  }, [])

  const all_users = [];

  for (const user of users) {
    all_users.push(
      <User
        username={user.username}
        about_me={user.about_me}
        zip_code={user.zip_code}
        last_seen={user.last_seen}
        imgUrl="/static/img/default.jpg"
        key={user.user_id}
      />,
    );
  }

  return (
    <React.Fragment>
      <UserProfile />
      <h2>All Users</h2>
      <div className="grid">{all_users}</div>
    </React.Fragment>
  );
}


ReactDOM.render(<AllUsersContainer />, document.querySelector('#container'));
