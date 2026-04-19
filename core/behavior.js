import { updateData } from "./storage.js";

export async function trackBehavior() {
  await updateData((data) => {
    const now = Date.now();
    const diff = now - data.behavior.lastBlockedTimestamp;

    if (diff < 10000) {
      data.behavior.rapidReturnCount += 1;
    } else if (diff < 30000) {
      data.behavior.rapidReturnCount =
        Math.max(1, data.behavior.rapidReturnCount);
    } else {
      data.behavior.rapidReturnCount = 0;
    }

    data.behavior.lastBlockedTimestamp = now;

    return data;
  });
}