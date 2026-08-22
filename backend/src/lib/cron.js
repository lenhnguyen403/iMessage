import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";

// every 14 minutes send a GET request to the health endpoint
const job = new CronJob("*/14 * * * *", () => {
    const base = process.env.VITE_FRONTEND_URL || 'http://localhost:5173'

    if (!base) return

    const url = new URL("/health", base).href
    const client = url.startsWith("https") ? https : http

    client
        .get(url, (res) => {
            if (res.statusCode === 200) console.log('GET request sent successfully')
            else console.log('GET request failed', res.statusCode)
        })

        .on("error", (e) => console.error('Error while sending request', e))
})

export default job