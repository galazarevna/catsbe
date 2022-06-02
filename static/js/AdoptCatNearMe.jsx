function Cat(props) {
  return (
    <div className="cat">
      <div><h2>Name: {props.name}</h2></div>
      <div><h3 dangerouslySetInnerHTML={{ __html: props.description }}></h3></div>
      <div><h3>{props.gender} {props.age} {props.color}</h3></div>
      <div><h3>City: {props.city}</h3></div>
      <div><a href={props.url}><img src={props.img} alt="cat's image" className="cat-photo"/></a></div>
    </div>
  );
}

function AdoptCatNearMe() {
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
      <h1 className="adopt-box">Adopt a cat nearby</h1>
      <div className="adopt"><div></div>{all_cats}<div></div>
      </div>
    </React.Fragment>
  );
}