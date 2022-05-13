function Cat(props) {
  return (
    <div className="cat">
      <h2>Name: {props.name}</h2>
      <h3 dangerouslySetInnerHTML={ {__html: props.description } }></h3>
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