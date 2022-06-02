"""Server for catsbe app."""
import html
import json
import os
from datetime import datetime

import filetype
import requests
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect
from flask import flash, session, jsonify
from jinja2 import StrictUndefined
from werkzeug.utils import secure_filename

import model
from model import connect_to_db, User, Image, Like

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024
app.config["UPLOAD_EXTENSIONS"] = [".jpg", ".jpeg", ".png", ".gif"]
app.config["UPLOAD_PATH"] = "static/uploads"
load_dotenv()

EMAIL = os.environ.get("EMAIL")
PASSWORD = os.environ.get("PASSWORD")
PETFINDER_CLIENT_ID = os.environ.get("PETFINDER_CLIENT_ID")
PETFINDER_CLIENT_SECRET = os.environ.get("PETFINDER_CLIENT_SECRET")
GOOGLEMAPS_API_KEY = os.environ.get("REACT_APP_GOOGLEMAPS_API_KEY")


@app.route("/")
def homepage():
    """View homepage. If a user exists in session they are redirected to their profile."""

    if "user_id" in session:
        user_id = session["user_id"]
        curr_user = User.get_by_id(user_id)
        return render_template("homepage.html", user=curr_user)
    return render_template("login_page.html")


def validate_image(filename):
    """Validates type of given file"""

    kind = filetype.guess(filename)
    if kind is None:
        print("Cannot guess file type!")
        return None
    print("File extension:", kind.extension)
    print("File MIME type:", kind.mime)
    return f".{kind.extension}"


@app.errorhandler(413)
def too_large(e):
    """Error handler for large files"""

    return "File is too large", 413


def upload_file():
    """Upload file to storage"""

    uploaded_file = None
    path = None
    user_id = None
    if "user_id" in session:
        user_id = session["user_id"]
        try:
            uploaded_file = request.files["file"]
            print("uploaded_file=", uploaded_file)
        except KeyError as e:
            print(e)
        if not uploaded_file:
            return "No image provided", 400
        filename = secure_filename(uploaded_file.filename)
        if filename != "":
            file_ext = os.path.splitext(filename)[1]
            val_image = validate_image(uploaded_file)
            if (file_ext or val_image) not in app.config["UPLOAD_EXTENSIONS"]:
                return "Invalid image", 400
            uploaded_file.seek(0)
            path = os.path.join(app.config["UPLOAD_PATH"], f"{user_id}_{filename}")
            uploaded_file.save(path)
    return user_id, path


@app.route("/update-profile-photo", methods=["POST"])
def update_profile_photo():
    """Update current user's profile photo."""

    user_id, path = upload_file()
    User.update_profile_img(user_id, path)
    return jsonify({"url": path})


@app.route("/add-photo", methods=["POST"])
def add_photo():
    """Add a new photo to DB images table."""

    description = request.form.get("description")
    date_uploaded = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user_id, path = upload_file()

    image = Image.create(description=description, img_url=path, date_uploaded=date_uploaded,
                         user_id=user_id)
    model.db.session.add(image)
    model.db.session.commit()
    new_photo = image.as_dict()
    return jsonify({"photoAdded": new_photo})


@app.route("/photos.json", methods=["GET", "POST"])
def photos():
    """View all photos with related info (likes) owned by user."""

    images_list = []

    if "user_id" in session:
        curr_user = session["user_id"]
        if request.method == "POST":
            photo_owner = request.json.get("user_id")
        else:
            photo_owner = curr_user

        images = Image.get_images_with_likes_by_user_id(photo_owner)
        for img_obj in images:
            images_dict = img_obj.as_dict()
            counter = 0
            for like in img_obj.likes:
                counter += 1
                if like.user_id == curr_user:
                    images_dict.update({"active_like": True})
            images_dict.update({"num_of_likes": counter})
            images_dict.update({"curr_user_id": curr_user})
            images_list.append(images_dict)
    return jsonify({"images": images_list})


@app.route("/update-like", methods=["POST"])
def update_like():
    """Update like in DB."""

    data = request.get_json()
    status = Like.update_like(data["user_id"], data["image_id"])
    return jsonify({"status": status})


@app.route("/login", methods=["POST"])
def process_login():
    """Process user login."""

    username = request.form.get("username")
    password = request.form.get("password")

    curr_user = User.get_by_username(username)
    if not curr_user or curr_user.password != password:
        flash("The email or password you entered was incorrect.")
    else:
        # Log in user by storing the user's username in session
        session["user_id"] = curr_user.user_id
        curr_user.ping()
        flash(f"Welcome back, {curr_user.username}!")
    return redirect("/")


def get_city(zip_code):
    """Return user location (city) by zipcode."""

    url = f"https://maps.googleapis.com/maps/api/geocode/json?key={GOOGLEMAPS_API_KEY}&components" \
          f"=postal_code:{zip_code} "

    response = requests.get(url)
    response = response.json()
    city = zip_code
    try:
        city = response["results"][0]["address_components"][1]["short_name"]
    except KeyError as error:
        print(error)
    return city


@app.route("/current-user.json")
def current_user():
    """Returns logged-in user's info and updates last seen time"""

    user_as_dict = {}
    if "user_id" in session:
        user_id = session["user_id"]
        curr_user = User.get_by_id(user_id)
        curr_user.ping()
        user_as_dict = curr_user.as_dict()
        # user_as_dict["city"] = get_city(user_as_dict["zip_code"]) # uncomment for Google API
    return user_as_dict


@app.route("/user.json", methods=["POST"])
def user():
    """Returns user's info"""

    user_id = request.form.get("user_id")
    user_to_follow = User.get_by_id(user_id)
    user_as_dict = user_to_follow.as_dict()
    return user_as_dict


@app.route("/users.json")
def users():
    """Return all users"""

    all_users = User.all_users()
    users_list = []
    for user_obj in all_users:
        users_list.append(user_obj.as_dict())
    return jsonify({"users": users_list})


@app.route("/random-users.json")
def random_users():
    """Takes all users (except current) from the DB and returns 2 random users to follow"""

    users_list = []
    if "user_id" in session:
        user_id = session["user_id"]
        rand_users = User.get_users_to_follow(user_id, 2)
        for user_obj in rand_users:
            users_list.append(user_obj.as_dict())
    return jsonify({"users": users_list})


def beautify_text(text):
    """Converting HTML character references to the corresponding Unicode characters.
    Removes any url links from the text.

    >>> beautify_text("I&amp;#39;m")
    'I&#39;m'
    >>> beautify_text("I&#39;m")
    "I'm"
    """

    txt = html.unescape(text)
    words = txt.split()
    for word in words:
        if word.startswith("http"):
            words.remove(word)
    new_text = " ".join(words)
    return new_text


@app.route("/cats.json")
def cats():
    """Makes a request to Petfinder's API to retrieve 3 cats available for adoption in 20 miles
    radius from the user's location.
    """

    user_zip_code = None
    if "user_id" in session:
        user_id = session["user_id"]
        curr_user = User.get_by_id(user_id)
        user_zip_code = curr_user.zip_code
        print("user_zip_code=", user_zip_code)

    def get_cats():
        data = {
            "grant_type": "client_credentials",
            "client_id": PETFINDER_CLIENT_ID,
            "client_secret": PETFINDER_CLIENT_SECRET
        }
        cats_req = None
        url = "https://api.petfinder.com/v2/oauth2/token"

        response_get_token = requests.post(url, data=json.dumps(data))
        if response_get_token.status_code == 200:
            token = response_get_token.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            cats_req = requests.get(f"https://api.petfinder.com/v2/animals?type=cat&status"
                                    f"=adoptable&location={user_zip_code}&distance=20&limit=3",
                                    headers=headers)
        return cats_req.json()

    cats_petfinder = get_cats()

    cats_list = []
    for cat in cats_petfinder["animals"]:
        cats_dict = {}
        try:
            name = html.unescape(cat["name"])
            cats_dict["name"] = name
            cats_dict["url"] = cat["url"]
            cats_dict["city"] = cat["contact"]["address"]["city"]
            cats_dict["color"] = cat["colors"]["primary"]
            cats_dict["gender"] = cat["gender"]
            cats_dict["age"] = cat["age"]
            cats_dict["description"] = beautify_text(cat["description"])
            cats_dict["img"] = cat["primary_photo_cropped"]["small"]
        except (KeyError, TypeError) as e:
            print(e)
        finally:
            cats_dict["img"] = cats_dict.get("img", "/static/img/adopt_default.jpg")
            cats_list.append(cats_dict)
    return jsonify({"cats": cats_list})


@app.route("/update-status", methods=["POST"])
def update_status():
    """Updates user's status in DB"""

    status = False
    user_status = request.form.get("status")
    if "user_id" in session:
        user_id = session["user_id"]
        User.update_user_status(user_id, user_status)
        status = True
    return jsonify({"success": status})


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
