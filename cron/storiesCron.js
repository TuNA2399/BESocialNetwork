import cron from "node-cron";
import { db } from "../connect.js";

const deleteExpiredStories = () => {
    const q = "DELETE FROM stories WHERE createdAt < (NOW() - INTERVAL 1 DAY)";

    db.query(q, (err, result) => {
        if (err) {
            console.error(`[${new Date().toLocaleString()}] Error deleting expired stories:`, err);
        } else {
            console.log(
                `[${new Date().toLocaleString()}] Story cleanup completed. Rows affected: ${result.affectedRows}`
            );
        }
    });
};

export const startStoryCleanupCron = () => {
    cron.schedule("0 * * * *", () => {
        console.log(`[${new Date().toLocaleString()}] Running story cleanup cron job...`);
        deleteExpiredStories();
    });

    console.log("Story cleanup cron job scheduled to run every hour.");
};