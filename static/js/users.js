'use strict';

function initMap() {
    // fetch("/user.json")
    //     .then((response) => response.json())
    //     .then((currentUser) => {
    //         const currentUserCoords = `${currentUser.lat}, ${currentUser.lng}`;
    //     });
    // }

    const currentUserCoords = {
        lat: 37.4975165,
        lng: -122.2710602,
    };

    const map = new google.maps.Map(document.querySelector('#map'), {
        center: currentUserCoords,
        scrollwheel: false,
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
                <div class="bear-thumbnail">
                    <img
                    src=${user.image_file}
                    alt="nearby-user"
                    />
                </div>

                <class="bear-info">
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
}