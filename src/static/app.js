document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Debug: log participants to console
        console.log(`Activity: ${name}, Participants:`, details.participants);

        activityCard.innerHTML = `
          <h4 style="color:#1976d2; margin-bottom:8px;">${name}</h4>
          <p style="margin-bottom:12px;">${details.description}</p>
          <p style="margin-bottom:4px;"><strong>Schedule:</strong> ${details.schedule}</p>
          <p style="margin-bottom:10px;"><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-section">
            <span style="font-weight:bold; color:#222; display:block; margin-bottom:6px;">Participants:</span>
            <ul class="participants-list" style="list-style-type: disc; margin-left: 20px; color: #333; font-size: 1rem;">
              ${
                details.participants.length > 0
                  ? details.participants.map(
                      (p) => `<li style='margin-bottom:4px;'>${p}</li>`
                    ).join("")
                  : '<li><em>No participants yet</em></li>'
              }
            </ul>
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
          // Refresh activities list to show new participant
          fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
