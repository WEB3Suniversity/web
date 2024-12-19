// 连接到 admin 数据库
db = connect("mongodb://localhost:27017/admin");

// 检查用户是否已存在
if (!db.getUser("root")) {
  db.createUser({
    user: "root",
    pwd: "example",
    roles: [{ role: "root", db: "admin" }],
  });
}

// 切换到 mydb 数据库
db = db.getSiblingDB("mydb");

// 创建 articles 集合并插入数据（如果尚未存在）
if (!db.getCollectionNames().includes("articles")) {
  db.createCollection("articles");
  db.articles.insertMany([
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
}

// 创建 article_reviews 集合并插入数据（如果尚未存在）
if (!db.getCollectionNames().includes("article_reviews")) {
  db.createCollection("article_reviews");
  db.article_reviews.insertMany([
    {
      review_id: 1,
      article_id: 1,
      reviewer_address: "0xabcdef123456789abcdef123456789abcdef1234",
      support: true,
      quality_score: 80,
      vote_time: 1672531200,
    },
  ]);
}
