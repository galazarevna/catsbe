function Body() {
    return (
        <div className="container-fluid">
            <div className="wrapper">
                <div className="item1"><UserProfile /></div>
                <div className="item2">
                    <div className="overflow-auto"><UserPhotosContainer /></div>
                </div>
                <div className="item3"><UsersToFollowContainer /></div>
                <div class="item4"><AdoptCatNearMe /></div>
            </div>
        </div>
    );
}