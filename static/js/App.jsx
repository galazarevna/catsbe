function App() {
  return (
    <React.Fragment>
      <Header />
      <UserProfile />
      <AddImage />
      <AllPhotosContainer />
      <AllUsersContainer />
      {/* <AdoptCatNearMe /> */}
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.querySelector('#container'));
