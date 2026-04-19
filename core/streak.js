import { getData, updateData } from "./storage.js";

function getToday() {
    return new Date().toDateString();
}

export async function processDailyStreak() {
    const data = await getData();

    const today = getToday();
    const lastActive = data.streak.lastActiveDate;

    // 🛑 already processed today
    if (lastActive === today) return;

    const wasBreak =
        data.override.usedToday >= data.override.maxPerDay;

    await updateData((data) => {
        if (wasBreak) {
            // 💀 reset streak
            data.streak.current = 0;
            data.streak.lastBreakDate = today;
        } else {
            // 🔥 increment streak
            data.streak.current += 1;
        }

        data.streak.lastActiveDate = today;

        return data;
    });
}

export async function getStreak() {
  const data = await getData();
  return data.streak.current;
}

export async function breakStreakNow() {
  await updateData((data) => {
    data.streak.current = 0;
    data.streak.lastBreakDate = new Date().toDateString();
    return data;
  });
}