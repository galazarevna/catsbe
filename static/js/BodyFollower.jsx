function BodyFollower() {
    return (
        <div className="container-fluid">
            <div className="wrapper">
                <div className="item1">
                    <FollowProfile />
                </div>
                <div className="item2">
                    <FollowersPhotosContainer />
                </div>
                {/* <div className="item3">
                    <UsersToFollowContainer />
                </div> */}
            </div>
            <Footer />
        </div>
    );
}