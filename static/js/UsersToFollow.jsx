const Router = ReactRouterDOM.BrowserRouter;
const { Link, Switch, Route } = ReactRouterDOM;

function UserToFollow(props) {

  return (
    <div className="user">
      <Link
        // to={`/user/${props.userId}`}
        to={`/${props.userId}`}
      >{props.username}</Link>
      <h2>Name: {props.username} </h2>
      <button type="button" style={{ marginLeft: '10px' }} >
        {/* <button type="button" style={{ marginLeft: '10px' }} onClick={followUser} > */}
        Follow!
      </button>
      <img src={props.imgUrl} />
    </div>
  );
}



function UsersToFollowContainer() {
  const [users, setUsers] = React.useState([]);


  React.useEffect(() => {
    fetch('/random-users.json')
      .then((response) => response.json())
      .then((data) => setUsers(data.users))
  }, [])

  const all_users = [];

  for (const user of users) {
    all_users.push(
      <UserToFollow
        username={user.username}
        zip_code={user.zip_code}
        imgUrl={user.image_file}
        key={user.user_id}
        userId={user.user_id}
      />,
    );
  }

  return (
    <React.Fragment>
      <h3>Users to follow:</h3>
      <div className="grid">{all_users}</div>
    </React.Fragment>
  );
}