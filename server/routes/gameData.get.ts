import { MongoClient } from "mongodb";
import { generateSignedUrl } from "../utils/s3signedurl";

export default defineEventHandler(async (event) => {
  try {
    const client = await MongoClient.connect(process.env.DB_URL!);
    const db = client.db("Gaming-App");

    const query = getQuery(event);

    const movies = await db.collection(`${query.level}Movies`).find().toArray();

    const moviesWithSignedUrls = await Promise.all(
      movies.map(async (movie) => {
        const signedUrl = await generateSignedUrl(movie.s3_key);

        return {
          name: movie.name,
          img: signedUrl,
        };
      })
    );

    return moviesWithSignedUrls;
  } catch (err) {
    return { error: "Failed to load movies" };
  }
});
