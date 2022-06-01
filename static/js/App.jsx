function App() {
  React.useEffect(() => {
    try {
      const script = document.querySelector("#google-map");
      document.body.removeChild(script);
    } catch (error) {};
    try {
      const el = document.querySelector("#map");
      document.body.removeChild(el);
    } catch (error) {};
  });

  return (
    <React.Fragment>
      <UserProfile />
      <UserPhotosContainer />
      {/* <AllPhotosContainer /> */}
      <UsersToFollowContainer />
      {/* <AllUsersContainer /> */}
      <AdoptCatNearMe />
      <Footer />
    </React.Fragment>
  );
}