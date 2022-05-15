function initMap() {

    fetch("/user.json")
        .then((response) => response.json())
        .then((currentUser) => {
            const userCoords = { lat: currentUser.lat, lng: currentUser.lng };

            const map = new google.maps.Map(document.querySelector('#map'), {
                center: userCoords,
                zoom: 11,
                zoomControl: true,
                panControl: false,
                streetViewControl: false
            });

            const userInfo = new google.maps.InfoWindow();

            // Retrieving the information with AJAX.
            fetch("/users.json")
                .then((response) => response.json())
                .then((data) => {
                    const users = data.users
                    for (const user of users) {
                        // Define the content of the infoWindow
                        const userInfoContent = `
                        <div class="window-content">
                        <div class="user-thumbnail">
                            <img
                            src=${user.image_file}
                            alt="nearby-user"
                            />
                        </div>

                        <class="user-info">
                            Name: <b>${user.username}</b>
                            Breed: ${user.breed}
                        </div>
            `;

                        const userMarker = new google.maps.Marker({
                            position: {
                                lat: user.lat,
                                lng: user.lng,
                            },
                            title: `${user.username}`,
                            icon: {
                                url: `${user.image_file}`,
                                scaledSize: new google.maps.Size(50, 50),
                            },
                            map, // same as saying map: map
                        });

                        userMarker.addListener('click', () => {
                            userInfo.close();
                            userInfo.setContent(userInfoContent);
                            userInfo.open(map, userMarker);
                        });
                    }
                })
                .catch(() => {
                    alert("We were unable to retrieve data about users :(");
                });
        });
}

function GoogleMaps() {

    React.useEffect(() => {
        const script = document.createElement("script");
        const API = "";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=initMap`;
        script.async = true;
        document.body.appendChild(script);
    });

    return (
        <div>
            <div id="map" style={{ width: 100, height: 100 }}></div>
        </div>
    )


}

ReactDOM.render(<GoogleMaps />, document.querySelector('#map'));