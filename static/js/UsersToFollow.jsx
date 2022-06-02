const Router = ReactRouterDOM.BrowserRouter;
const { Link, Switch, Route } = ReactRouterDOM;

function UserToFollow(props) {

  return (
    <div>
      <div className="avatar" style={{ alignSelf: 'center' }}>
        <img className="avatar-img" src={props.imgUrl} />
      </div>
      <div><Link to={`/${props.userId}`}>{props.username}</Link></div>
      <p></p>
      <div><button type="button" style={{ borderRadius: '12px', backgroundColor: '#5F0F40', color: '#fff' }} >
        {/* <button type="button" style={{ marginLeft: '10px' }} onClick={followUser} > */}
        Follow!
      </button>
      </div>
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
      <div className="users-to-follow">
        <h4>Users to follow</h4>
        <div className="users-to-follow-grid">{all_users}</div>
      </div>
    </React.Fragment>
  );
}