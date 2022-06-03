function BodyUser() {

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
        <div className="container-fluid">
            <div className="wrapper">
                <div className="item1">
                    <UserProfile />
                </div>
                <div className="item2">
                    <UserPhotosContainer />
                </div>
                <div className="item3">
                    <UsersToFollowContainer />
                </div>
                <div className="item4">
                    <AdoptCatNearMe />
                </div>
            </div>
            <Footer />
        </div>
    );
}