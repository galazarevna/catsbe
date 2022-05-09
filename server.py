"""Server for catsbe app."""
import json
import os

import requests
from dotenv import load_dotenv
from flask import Flask, render_template, request, flash, session, redirect, jsonify
from jinja2 import StrictUndefined
from requests.auth import HTTPBasicAuth

from model import connect_to_db, User

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined
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
        user = User.get_by_id(user_id)
        return render_template("profile_page.html", user=user)
    return render_template("homepage.html")


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


@app.route("/users")
def all_users():
    """View all users."""

    users = User.all_users()

    return render_template("all_users.html", users=users)


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
            cats_dict = {"name": cat["name"], "url": cat["url"],
                         "img": cat["primary_photo_cropped"]["small"],
                         "color": cat["colors"]["primary"],
                         "age": cat["age"], "gender": cat["gender"],
                         "description": cat["description"],
                         "city": cat["contact"]["address"]["city"]}
            if "&amp;#39;" in cat["description"]:
                cats_dict["description"] = cat["description"].replace("&amp;#39;", "'")
        except (KeyError, TypeError) as e:
            print(e)
        finally:
            cats_list.append(cats_dict)
    return jsonify({"cats": cats_list})


# @app.route("/users/<user_id>")
# def show_user(user_id):
#     """Show details on a particular user."""
#
#     user = User.get_by_id(user_id)
#
#     return render_template("profile_page.html", user=user)


# @app.route("/movies")
# def all_movies():
#     """View all movies."""
#
#     movies = Movie.all_movies()
#
#     return render_template("all_movies.html", movies=movies)
#
#
# @app.route("/movies/<movie_id>")
# def show_movie(movie_id):
#     """Show details on a particular movie."""
#
#     movie = Movie.get_by_id(movie_id)
#
#     return render_template("movie_details.html", movie=movie)
#
#

#
#
# @app.route("/users", methods=["POST"])
# def register_user():
#     """Create a new user."""
#
#     email = request.form.get("email")
#     password = request.form.get("password")
#
#     user = User.get_by_email(email)
#     if user:
#         flash("Cannot create an account with that email. Try again.")
#     else:
#         user = User.create(email, password)
#         db.session.add(user)
#         db.session.commit()
#         flash("Account created! Please log in.")
#
#     return redirect("/")
#
#

#

#
# @app.route("/update_rating", methods=["POST"])
# def update_rating():
#     rating_id = request.json["rating_id"]
#     updated_score = request.json["updated_score"]
#     Rating.update(rating_id, updated_score)
#     db.session.commit()
#
#     return "Success"
#
# @app.route("/movies/<movie_id>/ratings", methods=["POST"])
# def create_rating(movie_id):
#     """Create a new rating for the movie."""
#
#     logged_in_email = session.get("user_email")
#     rating_score = request.form.get("rating")
#
#     if logged_in_email is None:
#         flash("You must log in to rate a movie.")
#     elif not rating_score:
#         flash("Error: you didn't select a score for your rating.")
#     else:
#         user = User.get_by_email(logged_in_email)
#         movie = Movie.get_by_id(movie_id)
#
#         rating = Rating.create(user, movie, int(rating_score))
#         db.session.add(rating)
#         db.session.commit()
#
#         flash(f"You rated this movie {rating_score} out of 5.")
#
#     return redirect(f"/movies/{movie_id}")


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
