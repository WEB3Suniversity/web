const { MongoClient } = require("mongodb");

async function main() {
  // Connect to the MongoDB database
  const client = new MongoClient(
    "mongodb+srv://lijinhai255:ADeQx1Hyj8JRDZtF@cluster0.m2ayv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );

  try {
    await client.connect(); // Establish connection
    // Switch to the 'mydb' database
    const mydb = client.db("mydb");

    // Create 'articles' collection if it doesn't exist
    const articlesCollection = await mydb
      .listCollections({ name: "articles" })
      .toArray();
    if (articlesCollection.length === 0) {
      await mydb.createCollection("articles");
      await mydb.collection("articles").insertMany([
        {
          article_id: 1,
          author_address: "0x123456789abcdef123456789abcdef123456789a",
          title: "First Article",
          content_hash: "abc123hash",
          course_id: "course123",
          submission_time: 1672531200,
          votes_for: 0,
          votes_against: 0,
          reward_amount: 0,
          status: "Pending",
          addtime: 1672531200,
          last_update_time: 1672531200,
        },
      ]);
      console.log("Articles collection created and data inserted.");
    }

    // Create 'article_reviews' collection if it doesn't exist
    const reviewsCollection = await mydb
      .listCollections({ name: "article_reviews" })
      .toArray();
    if (reviewsCollection.length === 0) {
      await mydb.createCollection("article_reviews");
      await mydb.collection("article_reviews").insertMany([
        {
          review_id: 1,
          article_id: 1,
          reviewer_address: "0xabcdef123456789abcdef123456789abcdef1234",
          support: true,
          quality_score: 80,
          vote_time: 1672531200,
        },
      ]);
      console.log("Article reviews collection created and data inserted.");
    }

    console.log("Database and collections setup complete!");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  } finally {
    await client.close(); // Close the connection
  }
}

main().catch(console.error);
