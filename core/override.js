import { updateData, getData } from "./storage.js";

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
  let allowed = false;

  await updateData((data) => {
    if (data.override.usedToday < data.override.maxPerDay) {
      data.override.usedToday += 1;
      allowed = true;
    }
    return data;
  });

  return allowed;
}

export async function getOverrideLeft() {
  const data = await getData();
  return data.override.maxPerDay - data.override.usedToday;
}

const DURATION_LIMIT = 30 * 1000;

export function activateOverride() {
  updateData((data) => {
    data.override.active = true;
    data.override.startTime = Date.now();
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
