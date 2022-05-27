import os
import unittest

from dotenv import load_dotenv

from model import connect_to_db, db, example_data
from server import app

load_dotenv()

USERNAME = os.environ.get("TEST_USERNAME")
PASSWORD = os.environ.get("TEST_PASSWORD")


class LoginTests(unittest.TestCase):
    """Tests for catsbe site."""

    def setUp(self):
        self.client = app.test_client()
        app.config["TESTING"] = True
        connect_to_db(app, "postgresql:///testdb")

        db.create_all()
        example_data()

    def test_homepage(self):
        """Test to verify homepage"""

        result = self.client.get("/")
        self.assertIn(b"Welcome furrends!", result.data)

    def login(self, username, password):
        """Login method"""

        return self.client.post("/login", data=dict(
            username=username,
            password=password
        ), follow_redirects=True)

    def test_login(self):
        """Test login with valid and invalid credentials"""

        result = self.login(USERNAME, PASSWORD)
        self.assertIn(f"Welcome back, {USERNAME}!", result.text)
        self.assertNotIn("Welcome furrends!", result.text)
        self.assertEqual(result.request.path, '/')

        result = self.login(USERNAME + "x", PASSWORD)
        self.assertNotIn(f"Welcome back, {USERNAME}!", result.text)
        self.assertIn("The email or password you entered was incorrect.", result.text)

        result = self.login(USERNAME, PASSWORD + "x")
        self.assertNotIn(f"Welcome back, {USERNAME}!", result.text)
        self.assertIn("The email or password you entered was incorrect.", result.text)

    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()


if __name__ == "__main__":
    unittest.main()
