import { getData } from "./core/storage.js";
import {
  resetOverrideIfNeeded,
  useOverride,
  getOverrideLeft,
  activateOverride
} from "./core/override.js";
import { processDailyStreak, getStreak } from "./core/streak.js";

document.addEventListener("DOMContentLoaded", async () => {

  await processDailyStreak();
  await resetOverrideIfNeeded();

  const left = await getOverrideLeft();
  const streak = await getStreak();
  const data = await getData();

  // 🔥 STATUS
  document.getElementById("status").innerText =
    `Override left: ${left}/3 | 🔥 Streak: ${streak}`;

  // 🔥 GOAL
  document.getElementById("goal").innerText =
    data.goals.mainGoal;

  document.getElementById("reason").innerText =
    data.goals.reason;

  // 🔥 STATE
  let stateMessage = "";
  if (left === 0) {
    stateMessage = "You've used all your chances today. You're using your focus time (see tab timer).";
  } else if (data.override.active) {
    stateMessage = "You're in focus mode.You're using your focus time (see tab timer).";
  } else {
    stateMessage = "Take control before you lose time. You're using your focus time (see tab timer).";
  }

  if (data.override.active) {
    stateMessage = "You're using your focus time.";
  }

  if (left === 0) {
    stateMessage = "You've used all your chances today.";
  }

  document.getElementById("state-message").innerText = stateMessage;

  // 🔥 TIMER
  if (data.override.active) {
    const interval = setInterval(async () => {
      const latest = await getData();

      const remaining =
        30 - Math.floor((Date.now() - latest.override.startTime) / 1000);

      const timerEl = document.getElementById("timer");


      if (remaining > 0) {
        timerEl.innerText = `Time left: ${remaining}s`;
      } else {
        timerEl.innerText = "Your time is up.";
        clearInterval(interval);
      }
    }, 1000);
  }

  if (!data.override.active) {
    document.getElementById("timer").innerText =
      "You will get limited time if you continue.";
  }

  // 🔥 BEHAVIOR MESSAGE
  const rapid = data.behavior.rapidReturnCount;

  let behaviorMessage = "";

  if (rapid >= 5) {
    behaviorMessage = "You're looping. Step away.";
  } else if (rapid >= 3) {
    behaviorMessage = "You keep coming back.";
  } else if (rapid >= 1) {
    behaviorMessage = "That was fast...";
  }

  document.getElementById("behavior-info").innerText = behaviorMessage;

  // 🔥 BUTTON
  const btn = document.getElementById("overrideBtn");

  btn.addEventListener("click", async () => {

    await resetOverrideIfNeeded();

    const latest = await getData();
    const rapid = latest.behavior.rapidReturnCount;

    let delay = 0;

    if (rapid >= 6) delay = -1;
    else if (rapid >= 4) delay = 5000;
    else if (rapid >= 2) delay = 2000;

    if (delay === -1) {
      btn.disabled = true;
      btn.innerText = "Locked. Take a break.";
      return;
    }

    if (delay > 0) {
      btn.disabled = true;
      btn.innerText = `Wait ${delay / 1000}s...`;
      await new Promise(r => setTimeout(r, delay));
      btn.disabled = false;
      btn.innerText = "Continue (uses 1)";
    }

    const success = await useOverride();

    if (!success) {
      alert("You've used all your chances today.");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.storage.local.set({
        overrideTabId: tabs[0].id
      });
    });

    chrome.storage.local.get(["lastBlockedUrl"], async (res) => {
      const target = res.lastBlockedUrl || "https://youtube.com";
      await activateOverride(target);
      window.location.href = target;
    });
  });

});