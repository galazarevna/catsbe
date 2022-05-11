"""Script to seed database."""

import json
import os
from datetime import datetime

import model
import server

os.system("dropdb catsbe")
os.system("createdb catsbe")

model.connect_to_db(server.app)
model.db.create_all()

# Load user data from JSON file
with open("data/users.json") as f:
    user_data = json.loads(f.read())

    # Create users, store them in a list
    users_in_db = []
    for user in user_data:
        username, email, password, confirmed, about_me, breed, status, zip_code = (
            user["username"],
            user["email"],
            user["password"],
            user["confirmed"],
            user["about_me"],
            user["breed"],
            user["status"],
            user["zip_code"]
        )

        last_seen = datetime.strptime(user["last_seen"], "%Y-%m-%d")

        db_user = model.User.create(username, email, password, confirmed, about_me, breed, status,
                                    last_seen, zip_code)

        users_in_db.append(db_user)

    model.db.session.add_all(users_in_db)
    model.db.session.commit()

# Load photo data from JSON file
with open("data/photos.json") as f:
    photo_data = json.loads(f.read())

    # Create photos, store them in a list
    photos_in_db = []
    for photo in photo_data:
        description, img_url, user_id = (
            photo["description"],
            photo["img_url"],
            photo["user_id"]
        )

        date_uploaded = datetime.strptime(photo["date_uploaded"], "%Y-%m-%d")

        db_photo = model.Image.create(description, img_url, date_uploaded, user_id)

        photos_in_db.append(db_photo)

    model.db.session.add_all(photos_in_db)
    model.db.session.commit()
