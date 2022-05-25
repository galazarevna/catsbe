"""Models for catsbe app."""

from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import func

db = SQLAlchemy()


class User(db.Model):
    """Data model for a user."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(25), unique=True, nullable=False, index=True)
    email = db.Column(db.String(50), unique=True, nullable=False, index=True)
    password = db.Column(db.String, nullable=False)
    confirmed = db.Column(db.Boolean, default=False)
    about_me = db.Column(db.Text)
    breed = db.Column(db.String(20))
    status = db.Column(db.String(50))
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    zip_code = db.Column(db.Integer, nullable=False)
    image_file = db.Column(db.String(100), nullable=False, default="static/img/default.jpg")
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)

    sent_messages = db.relationship("Message", foreign_keys='[Message.sender_id]',
                                    back_populates="sender",
                                    cascade="all, delete")
    received_messages = db.relationship("Message", foreign_keys='[Message.recipient_id]',
                                        back_populates="recipient",
                                        cascade="all, delete")

    def __repr__(self):
        return f"<User user_id={self.user_id} email={self.email} zip_code={self.zip_code}>"

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def ping(self):
        self.last_seen = datetime.utcnow()
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, username, email, password, confirmed, about_me, breed, status, last_seen,
               zip_code, lat, lng):
        """Create and return a new user."""

        return cls(username=username, email=email, password=password, confirmed=confirmed,
                   about_me=about_me, breed=breed, status=status, last_seen=last_seen,
                   zip_code=zip_code, lat=lat, lng=lng)

    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.get(user_id)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter(User.email == email).first()

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter(User.username == username).first()

    @classmethod
    def all_users(cls):
        return cls.query.all()

    @classmethod
    def update_profile_img(cls, user_id, img_url):
        user = cls.query.get(user_id)
        user.image_file = img_url
        db.session.commit()

    @classmethod
    def get_users_to_follow(cls, user_id, num_of_users):
        """Gets random users except the current one"""

        return cls.query.filter(User.user_id != user_id).order_by(func.random()).limit(
            num_of_users).all()

    @classmethod
    def update_user_status(cls, user_id, new_status):
        """Updates user's status"""

        user = cls.query.get(user_id)
        user.status = new_status
        db.session.commit()


class Message(db.Model):
    """Data model for a message."""

    __tablename__ = "messages"

    message_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    message_text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    sender_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    recipient_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))

    sender = db.relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    recipient = db.relationship("User", foreign_keys=[recipient_id],
                                back_populates="received_messages")

    def __repr__(self):
        return f"<Message message_id={self.message_id} message_text={self.message_text[:10]}>"


class Image(db.Model):
    """Data model for an image."""

    __tablename__ = "images"

    image_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    description = db.Column(db.Text)
    img_url = db.Column(db.String, nullable=False)
    date_uploaded = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))

    user = db.relationship("User", backref="images")

    def __repr__(self):
        return f"<Image image_id={self.image_id} description={self.description} user_id={self.user_id}>"

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @classmethod
    def create(cls, description, img_url, date_uploaded, user_id):
        """Create and return a new image."""

        return cls(description=description, img_url=img_url, date_uploaded=date_uploaded,
                   user_id=user_id)

    @classmethod
    def all_images(cls):
        """Return all images."""

        return cls.query.all()

    @classmethod
    def get_images_by_user_id(cls, user_id):
        """Return images owned by user."""

        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def get_images_with_likes_by_user_id(cls, user_id):
        """Return images with likes owned by user."""

        return cls.query.join(Like, isouter=True).filter(Image.user_id == user_id).all()


class Comment(db.Model):
    """Data model for a comment."""

    __tablename__ = "comments"

    comment_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    comment_text = db.Column(db.Text, nullable=False)
    date_uploaded = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    image_id = db.Column(db.Integer, db.ForeignKey("images.image_id"))

    user = db.relationship("User", backref="comments")
    image = db.relationship("Image", backref="comments")

    def __repr__(self):
        return f"<Comment comment_id={self.comment_id} comment_text={self.comment_text[:10]}>"


class Like(db.Model):
    """Data model for a like."""

    __tablename__ = "likes"

    like_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    image_id = db.Column(db.Integer, db.ForeignKey("images.image_id"), nullable=True)
    comment_id = db.Column(db.Integer, db.ForeignKey("comments.comment_id"), nullable=True)

    user = db.relationship("User", backref="likes")
    image = db.relationship("Image", backref="likes")
    comment = db.relationship("Comment", backref="likes")

    __table_args__ = (db.Index('image_like_index', "user_id", "image_id", unique=True),)

    def __repr__(self):
        return f"<Like like_id={self.like_id}>"

    @classmethod
    def create(cls, user_id, image_id, comment_id):
        """Create and return a new like."""

        return cls(user_id=user_id, image_id=image_id, comment_id=comment_id)

    @classmethod
    def get_like_by_user_and_image_id(cls, user_id, image_id):
        """Gets like by user_id and image_id."""

        return cls.query.filter_by(user_id=user_id, image_id=image_id).first()

    @classmethod
    def update_like(cls, user_id, image_id):
        """Checks if the like already exists. If not - add like. If the like exists - delete
        the record."""

        like = cls.get_like_by_user_and_image_id(user_id, image_id)
        if like:
            db.session.delete(like)
            status = "deleted"
        else:
            new_like = cls.create(user_id, image_id, comment_id=None)
            db.session.add(new_like)
            status = "created"
        db.session.commit()
        return status


class Follower(db.Model):
    """Data model for a follower."""

    __tablename__ = "followers"
    id = db.Column(db.Integer, primary_key=True)
    followers_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), index=True)
    following_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), index=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # ToDo: how to backref user_id and following_id?
    # __table_args__ = (
    #     db.Index('follower_index', "followers_id", "following_id", unique=True),
    # )

    # https://docs.sqlalchemy.org/en/14/core/constraints.html

    def __repr__(self):
        return f"<Follower follower_id={self.follower_id}>"


class FreeItem(db.Model):
    """Data model for a message."""

    __tablename__ = "freeitems"

    item_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    item_description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    image_id = db.Column(db.Integer, db.ForeignKey("images.image_id"))

    user = db.relationship("User", backref="freeitems")
    image = db.relationship("Image", backref="freeitems")

    def __repr__(self):
        return f"<FreeItem item_id={self.item_id} item_description={self.item_description[:10]}>"

    # @classmethod
    # def create(cls, user, movie, score):
    #     """Create and return a new movie."""
    #
    #     return cls(user=user, movie=movie, score=score)
    #
    # @classmethod
    # def update(cls, rating_id, new_score):
    #     """ Update a rating given rating_id and the updated score. """
    #     rating = cls.query.get(rating_id)
    #     rating.score = new_score


def connect_to_db(flask_app, db_uri="postgresql:///catsbe", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
