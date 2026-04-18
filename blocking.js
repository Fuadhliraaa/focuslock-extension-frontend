import { getData } from "./core/storage.js";

import {
  resetOverrideIfNeeded,
  canUseOverride,
  useOverride,
  getOverrideLeft,
  activateOverride,
  resetOverrideDev
} from "./core/override.js";

const IS_DEV = true;

document.addEventListener("DOMContentLoaded", async () => {

  await resetOverrideIfNeeded();

  const left = await getOverrideLeft();
  document.getElementById("override-info").innerText =
    `Override left: ${left}/3`;

  if (IS_DEV) {
    const resetBtn = document.getElementById("resetOverrideBtn");

    resetBtn.style.display = "block";

    resetBtn.addEventListener("click", async () => {
      await resetOverrideDev();

      const left = await getOverrideLeft();
      document.getElementById("override-info").innerText =
        `Override left: ${left}/3`;
    });
  }

  chrome.storage.local.get(["goals"], (data) => {
    document.getElementById("goal").textContent =
      data.goals?.mainGoal || "No goal set";

    document.getElementById("reason").textContent =
      data.goals?.reason || "No reason set";
  });

  const overrideBtn = document.getElementById("overrideBtn");

  overrideBtn.addEventListener("click", async () => {
    await resetOverrideIfNeeded();

    if (!(await canUseOverride())) {
      alert("Override limit reached today!");
      return;
    }

    await useOverride();
    await activateOverride();

    chrome.storage.local.get(["lastBlockedUrl"], (data) => {
      const targetUrl = data.lastBlockedUrl || "https://youtube.com";
      window.location.href = targetUrl;
    });
  });

});