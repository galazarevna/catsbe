"""Server for movie ratings app."""

from flask import Flask, render_template, request, flash, session, redirect
from jinja2 import StrictUndefined

from model import connect_to_db, User

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


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


# @app.route("/users/<user_id>")
# def show_user(user_id):
#     """Show details on a particular user."""
#
#     user = User.get_by_id(user_id)
#
#     return render_template("profile_page.html", user=user)

@app.route("/user.json")
def user():
    if "user_id" in session:
        user_id = session["user_id"]
        user = User.get_by_id(user_id)
        print(user)
        user_as_dict = user.as_dict()

        return user_as_dict


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
