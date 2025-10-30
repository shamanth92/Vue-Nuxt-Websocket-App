import { MongoClient } from "mongodb";
import { generateSignedUrl } from "../utils/s3signedurl";

export default defineEventHandler(async () => {
  try {
    const client = await MongoClient.connect(process.env.DB_URL!);
    const db = client.db("Gaming-App");

    const images = await db.collection('gameImages').find().toArray();

    const imagesWithSignedUrls = await Promise.all(
      images.map(async (image) => {
        const signedUrl = await generateSignedUrl(image.s3_key, 'game-images');

        return {
          name: image.name,
          img: signedUrl,
        };
      })
    );

    return imagesWithSignedUrls;

  } catch (err) {
    return { error: "Failed to load images" };
  }
});
