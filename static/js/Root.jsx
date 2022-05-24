const Router = ReactRouterDOM.BrowserRouter;
const { Link, Switch, Route } = ReactRouterDOM;

function Root() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/users-nearby">Find users nearby</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          <Route path="/users-nearby" >
            <GoogleMaps />
          </Route>
          <Route path="/:followerId">
            {/* <Route path="/user/:followerId"> */}
            <Header />
            <FollowProfile />
            <FollowersPhotosContainer />
            <Footer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<Root />, document.querySelector('#root'));