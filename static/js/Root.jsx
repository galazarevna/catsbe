const Router = ReactRouterDOM.BrowserRouter;
const { Link, Switch, Route } = ReactRouterDOM;

function Root() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact>
            <BodyUser />
          </Route>
          <Route path="/users-nearby" >
            <GoogleMaps />
          </Route>
          <Route path="/:followerId" exact>
            <BodyFollower />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<Root />, document.querySelector('#root'));