function Body() {
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
                <div class="item4">
                    <AdoptCatNearMe />
                </div>
            </div>
        </div>
    );
}