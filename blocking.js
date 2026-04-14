chrome.storage.local.get(["goals"], (data) => {

  const goal = data.goals?.mainGoal || "No goal set";
  const reason = data.goals?.reason || "No reason set";

  document.getElementById("goal").textContent = goal;
  document.getElementById("reason").textContent = reason;

});

// Handle override button
document.getElementById("overrideBtn").addEventListener("click", () => {

  const now = Date.now();

  chrome.storage.local.set({
    override: {
      active: true,
      startTime: now
    }
  }, () => {
    console.log("Override activated");
    window.history.back();
  });

});