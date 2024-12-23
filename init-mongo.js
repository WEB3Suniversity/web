const { MongoClient } = require("mongodb");

async function main() {
  // Connect to the MongoDB database
  const client = new MongoClient(
    "mongodb://root:example@localhost:27017/admin"
  );

  try {
    await client.connect(); // Establish connection
    // Switch to the 'mydb' database
    const mydb = client.db("mydb");

    // 创建 'users' 集合
    const usersCollection = await mydb
      .listCollections({ name: "users" })
      .toArray();
    if (usersCollection.length === 0) {
      await mydb.createCollection("users");
      await mydb.collection("users").insertMany([
        {
          user_id: 1,
          username: "john_doe",
          email: "john.doe@example.com",
          password: "hashedpassword123",
          wallet_address: "0x123456789abcdef123456789abcdef123456789a",
          role: "User",
          avatar: "https://example.com/john_doe.jpg",
          status: "Active",
          register_time: 1672531200,
          last_login_time: 1672531200,
          total_articles: 2,
          total_reviews: 10,
          total_courses: 3,
        },
        {
          user_id: 2,
          username: "admin_user",
          email: "admin@example.com",
          password: "hashedadminpassword123",
          wallet_address: "0xabcdef123456789abcdef123456789abcdef1234",
          role: "Admin",
          avatar: "https://example.com/admin_user.jpg",
          status: "Active",
          register_time: 1672531200,
          last_login_time: 1672531200,
          total_articles: 5,
          total_reviews: 20,
          total_courses: 10,
        },
      ]);
      console.log("Users collection created and data inserted.");
    }

    // 创建 'courses' 集合
    const coursesCollection = await mydb
      .listCollections({ name: "courses" })
      .toArray();
    if (coursesCollection.length === 0) {
      await mydb.createCollection("courses");
      await mydb.collection("courses").insertMany([
        {
          id: "course123",
          title: "Introduction to Programming",
          description: "Learn the basics of programming with JavaScript.",
          image: "https://example.com/course123.jpg",
          difficulty: "Beginner",
          tags: ["Programming", "JavaScript", "Web Development"],
          stats: {
            modules: 5,
            duration: "10 Hours",
            rewards: 100,
          },
          price: "Free",
          user_id: 1, // 发布课程的用户ID
        },
        {
          id: "course124",
          title: "Advanced JavaScript",
          description: "Deep dive into advanced JavaScript concepts.",
          image: "https://example.com/course124.jpg",
          difficulty: "Advanced",
          tags: ["JavaScript", "Advanced", "Web Development"],
          stats: {
            modules: 8,
            duration: "20 Hours",
            rewards: 200,
          },
          price: "100 USD",
          user_id: 2, // 发布课程的用户ID
        },
      ]);
      console.log("Courses collection created and data inserted.");
    }

    // 创建 'articles' 集合
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
          user_id: 1, // 文章发布者的用户ID
        },
        {
          article_id: 2,
          author_address: "0xabcdef123456789abcdef123456789abcdef1234",
          title: "Advanced JavaScript Article",
          content_hash: "xyz456hash",
          course_id: "course124",
          submission_time: 1672531200,
          votes_for: 5,
          votes_against: 1,
          reward_amount: 10,
          status: "Approved",
          addtime: 1672531200,
          last_update_time: 1672531200,
          user_id: 2, // 文章发布者的用户ID
        },
      ]);
      console.log("Articles collection created and data inserted.");
    }

    // 创建 'article_reviews' 集合
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
          support: 1, // 1表示支持
          quality_score: 80,
          vote_time: 1672531200,
        },
        {
          review_id: 2,
          article_id: 2,
          reviewer_address: "0x123456789abcdef123456789abcdef123456789a",
          support: 0, // 0表示反对
          quality_score: 60,
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
