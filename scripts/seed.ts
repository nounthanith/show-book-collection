import mongoose from "mongoose";
import { SAMPLE_BOOKS } from "@/data/books";
import BookModel from "@/models/Book";
import { dbConnect } from "@/lib/mongoose";

async function main() {
  try {
    if (typeof process.loadEnvFile === "function") {
      try {
        process.loadEnvFile(".env.local");
      } catch {
        // .env.local may not exist; fall back to shell env
      }
    }

    await dbConnect();

    const operations = SAMPLE_BOOKS.map((book, index) => ({
      updateOne: {
        filter: { id: book.id },
        update: {
          $set: {
            ...book,
            sortOrder: index,
          },
        },
        upsert: true,
      },
    }));

    const result = await BookModel.bulkWrite(operations);
    const total = await BookModel.countDocuments();

    console.log(
      `Seeded ${SAMPLE_BOOKS.length} sample books ` +
        `(inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}). ` +
        `Total books in collection: ${total}`,
    );
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
