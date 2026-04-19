import { updateData, getData, setData } from "./storage.js";
import { breakStreakNow } from "./streak.js";

const OVERRIDE_DURATION = 30 * 1000;

export async function resetOverrideIfNeeded() {
  await updateData((data) => {
    const today = new Date().toDateString();

    if (data.override.lastResetDate !== today) {
      data.override.usedToday = 0;
      data.override.lastResetDate = today;
    }

    return data;
  });
}

export async function canUseOverride() {
  const data = await getData();
  return data.override.usedToday < data.override.maxPerDay;
}

export async function useOverride() {
  const data = await getData();

  // 🚫 HARD GUARD
  if (data.override.usedToday >= data.override.maxPerDay) {
    return false;
  }

  data.override.usedToday += 1;

  const reachedLimit =
    data.override.usedToday >= data.override.maxPerDay;

  await setData(data);

  if (reachedLimit) {
    await breakStreakNow(); // ✅ now safe
  }

  return true;
}

export async function getOverrideLeft() {
  const data = await getData();
  return data.override.maxPerDay - data.override.usedToday;
}

const DURATION_LIMIT = 30 * 1000;

export async function activateOverride(url) {
  await updateData((data) => {
    data.override.active = true;
    data.override.startTime = Date.now();
    data.override.allowedUrl = url; // 🔥 penting
    return data;
  });
}

export async function isOverrideActive() {
  const data = await getData();
  const now = Date.now();

  if (!data.override.active || !data.override.startTime) return false;

  const duration = now - data.override.startTime;

  if (duration < DURATION_LIMIT) {
    return true;
  }

  await updateData((data) => {
    data.override.active = false;
    data.override.startTime = null;
    return data;
  });

  return false;
}

export function resetOverrideDev() {
  updateData((data) => {
    data.override.usedToday = 0;
    data.override.active = false;
    data.override.startTime = null;
    data.override.lastResetDate = new Date().toDateString();
    return data;
  });
}
