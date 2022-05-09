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

function Cat(props) {
  return (
    <div className="cat">
      <h2>Name: {props.name}</h2>
{/*       <div dangerouslySetInnerHTML={ {__html: 'relationships, I&amp;#39;m very level-headed.'} }></div> */}
      <h3>{props.description}</h3>
      <h3>{props.gender}, {props.age}, {props.color}</h3>
      <h3>City: {props.city}</h3>
      <a href={props.url}><img src={props.img} alt="cat's image" /></a>
    </div>
  );
}

function AdoptCatNearMe(props) {
  const [cats, setCats] = React.useState([]);

  React.useEffect(() => {
    fetch('/cats.json')
    .then((response) => response.json())
    .then((data) => setCats(data.cats))
  }, [])

  const all_cats = [];

  for (const cat of cats) {
    all_cats.push(
      <Cat
        name={cat.name}
        description={cat.description}
        img={cat.img}
        url={cat.url}
        color={cat.color}
        age={cat.age}
        gender={cat.gender}
        city={cat.city}
        key={cat.name}
      />,
    );
  }

  return (
    <React.Fragment>
      <h2>Adopt a cat near me</h2>
      <div className="grid">{all_cats}</div>
    </React.Fragment>
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
      <AdoptCatNearMe />
    </React.Fragment>
  );
}


ReactDOM.render(<AllUsersContainer />, document.querySelector('#container'));
