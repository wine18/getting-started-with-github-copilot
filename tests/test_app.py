from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert "Chess Club" in data
    assert "Programming Class" in data
    assert isinstance(data["Chess Club"], dict)
    assert "participants" in data["Chess Club"]


def test_signup_for_activity_success():
    email = "newstudent@mergington.edu"
    response = client.post(f"/activities/Chess Club/signup?email={email}")
    assert response.status_code == 200
    assert f"Signed up {email} for Chess Club" in response.json()["message"]
    # Check participant added
    response2 = client.get("/activities")
    assert email in response2.json()["Chess Club"]["participants"]


def test_signup_for_activity_duplicate():
    email = "michael@mergington.edu"
    response = client.post(f"/activities/Chess Club/signup?email={email}")
    assert response.status_code == 400
    assert "already signed up" in response.json()["detail"]


def test_signup_for_activity_not_found():
    email = "someone@mergington.edu"
    response = client.post(f"/activities/Nonexistent/signup?email={email}")
    assert response.status_code == 404
    assert "Activity not found" in response.json()["detail"]
