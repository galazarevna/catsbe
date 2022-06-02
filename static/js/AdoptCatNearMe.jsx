function Cat(props) {
  return (
    <div className="cat">
      <div>
        <h5 style={{ fontWeight: 'bold' }}>Name: {props.name}</h5>
      </div>
      <div>
        <p>City: {props.city}</p>
      </div>
      <div>
        <p>{props.gender} {props.age} {props.color}</p>
      </div>
      <div>
        <p dangerouslySetInnerHTML={{ __html: props.description }}></p>
      </div>
      <div className="cat-photo-wrapper">
        <a href={props.url}><img src={props.img} alt="cat's image" className="cat-photo" /></a>
      </div>
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
      <div className="adopt-box">
        <h4 style={{ paddingBottom: '1em' }}>Adopt a cat nearby!</h4>
        <div className="adopt-grid">
          {all_cats}
        </div>
      </div>
    </React.Fragment>
  );
}