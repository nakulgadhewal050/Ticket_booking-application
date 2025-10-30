import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({ keepAlive: true });

export async function fetchFromTMDB(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: "application/json",
        },
        timeout: 10000,
        httpsAgent,
      });
      return response.data;
    } catch (error) {
      if (attempt < retries) {
        console.warn(
          `⚠️ TMDB fetch failed (attempt ${attempt}) — retrying in 1s...`
        );
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        console.error("❌ TMDB final failure:", error.message);
        throw error;
      }
    }
  }
}
