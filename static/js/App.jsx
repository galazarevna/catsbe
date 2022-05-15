function App() {
  React.useEffect(() => {
    try {
      const script = document.querySelector("#google-map");
      document.body.removeChild(script);
    } catch (error) {
      console.error(error);};
    try {
      const el = document.querySelector("#map");
      document.body.removeChild(el);
    } catch (error) {
      console.error(error);};
  });

  return (
    <React.Fragment>
      <Header />
      <UserProfile />
      <AllPhotosContainer />
      <AllUsersContainer />
      {/* <AdoptCatNearMe /> */}
      <Footer />
    </React.Fragment>
  );
}