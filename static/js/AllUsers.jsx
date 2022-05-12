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

function AllUsersContainer() {
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
      <h2>All Users</h2>
      <div className="grid">{all_users}</div>
    </React.Fragment>
  );
}

function AllUsersOnMap() {
   return (
    <React.Fragment>
      <Header />
      <AllUsersContainer />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(<AllUsersOnMap />, document.querySelector('#container'));