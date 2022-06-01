const Router = ReactRouterDOM.BrowserRouter;
const { Link, Switch, Route } = ReactRouterDOM;

function Root() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          {/* <Route path="/logout" exact>
            <LoginPage />
          </Route> */}
          <Route path="/users-nearby" >
            <GoogleMaps />
          </Route>
          <Route path="/:followerId">
            {/* <Route path="/user/:followerId"> */}
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