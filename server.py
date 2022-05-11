"""Server for catsbe app."""
import json
import os

import filetype
import requests
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect
from flask import flash, session, jsonify
from jinja2 import StrictUndefined
from requests.auth import HTTPBasicAuth
from werkzeug.utils import secure_filename

from model import connect_to_db, User, Image

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024
app.config["UPLOAD_EXTENSIONS"] = [".jpg", ".png", ".gif"]
app.config["UPLOAD_PATH"] = "static/uploads"
load_dotenv()

ZIP_CODE_API = os.environ.get('ZIP_CODE_API', None)
EMAIL = os.environ.get('EMAIL', None)
PASSWORD = os.environ.get('PASSWORD', None)
PETFINDER_CLIENT_ID = os.environ.get('PETFINDER_CLIENT_ID', None)
PETFINDER_CLIENT_SECRET = os.environ.get('PETFINDER_CLIENT_SECRET', None)


@app.route("/")
def homepage():
    """View homepage. If a user exists in session they are redirected to their profile."""

    if "user_id" in session:
        user_id = session["user_id"]
        current_user = User.get_by_id(user_id)
        return render_template("profile_page.html", user=current_user)
    return render_template("homepage.html")


def validate_image(filename):  # path to file
    kind = filetype.guess(filename)
    if kind is None:
        print("Cannot guess file type!")
        return None
    print(f"File extension: {kind.extension}")
    print(f"File MIME type: {kind.mime}")

    return f".{kind.extension}"


@app.errorhandler(413)
def too_large(e):
    return "File is too large", 413


@app.route('/upload_file', methods=['POST'])
def upload_file():
    """

    """
    path = None
    if "user_id" in session:
        user_id = session["user_id"]
        uploaded_file = None
        try:
            uploaded_file = request.files["file"]
        except KeyError as e:
            print(e)
        if not uploaded_file:
            return "No image provided", 400
        filename = secure_filename(uploaded_file.filename)
        if filename != "":
            file_ext = os.path.splitext(filename)[1]
            if file_ext not in app.config["UPLOAD_EXTENSIONS"] or \
                    file_ext != validate_image(uploaded_file):
                return "Invalid image", 400
            uploaded_file.seek(0)
            path = os.path.join(app.config["UPLOAD_PATH"], f"{user_id}_{filename}")
            uploaded_file.save(path)
            User.update_profile_img(user_id, path)
    return {"url": f"{path}"}


@app.route("/photos.json")
def all_photos():
    """View all photos owned by user."""
    images_list = []
    print("images_list =", images_list)
    if "user_id" in session:
        user_id = session["user_id"]
        images = Image.get_images_by_user_id(user_id)
        for img_obj in images:
            images_list.append(img_obj.as_dict())
    return jsonify({"images": images_list})


@app.route("/login", methods=["POST"])
def process_login():
    """Process user login."""

    username = request.form.get("username")
    password = request.form.get("password")

    user = User.get_by_username(username)
    if not user or user.password != password:
        flash("The email or password you entered was incorrect.")
    else:
        # Log in user by storing the user's username in session
        session["user_id"] = user.user_id
        flash(f"Welcome back, {user.username}!")
    return redirect("/")


def get_city(zip_code):
    city_req = requests.get(
        f"https://service.zipapi.us/zipcode/{zip_code}?X-API-KEY={ZIP_CODE_API}&fields=geolocation,population",
        auth=HTTPBasicAuth(EMAIL, PASSWORD))
    response = city_req.json()
    city = zip_code
    try:
        city = response["data"]["city"]
    except KeyError as e:
        print(e)
    return city


@app.route("/user.json")
def user():
    if "user_id" in session:
        user_id = session["user_id"]
        current_user = User.get_by_id(user_id)
        user_as_dict = current_user.as_dict()
        # user_as_dict["city"] = get_city(user_as_dict["zip_code"]) # uncomment for Zip API
        return user_as_dict


@app.route("/users.json")
def users():
    all_users = User.all_users()
    users_list = []
    for user_obj in all_users:
        users_list.append(user_obj.as_dict())
    return jsonify({"users": users_list})


@app.route("/cats.json")
def cats():
    """Makes a request to Petfinder's API to retrieve 3 cats available for adoption in 20 miles
    radius from the user's location.
    """

    user_zip_code = None
    if "user_id" in session:
        user_id = session["user_id"]
        current_user = User.get_by_id(user_id)
        user_zip_code = current_user.zip_code
        print("user_zip_code=", user_zip_code)

    def get_cats():
        data = {
            "grant_type": "client_credentials",
            "client_id": f"{PETFINDER_CLIENT_ID}",
            "client_secret": f"{PETFINDER_CLIENT_SECRET}"
        }

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
            cats_dict["name"] = cat["name"]
            cats_dict["url"] = cat["url"]
            cats_dict["city"] = cat["contact"]["address"]["city"]
            cats_dict["color"] = cat["colors"]["primary"]
            cats_dict["gender"] = cat["gender"]
            cats_dict["age"] = cat["age"]
            cats_dict["description"] = cat["description"]
            cats_dict["img"] = cat["primary_photo_cropped"]["small"]
            if "&amp;#39;" in cat["description"]:
                cats_dict["description"] = cat["description"].replace("&amp;#39;", "'")
        except (KeyError, TypeError) as e:
            print(e)
        finally:
            cats_dict["img"] = cats_dict.get("img", "/static/img/default.jpg")
            cats_list.append(cats_dict)
    return jsonify({"cats": cats_list})


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
