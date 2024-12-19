import { useState, useEffect } from "react";

type Article = {
  _id?: string;
  article_id?: number;
  author_address: string;
  title: string;
  content_hash: string;
  created_at?: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [newArticle, setNewArticle] = useState<Article>({
    author_address: "",
    title: "",
    content_hash: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch all articles on page load
  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => setError("Failed to fetch articles"));
  }, []);

  // Handle new article submission
  const handleCreateArticle = async () => {
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });

      const data = await res.json();

      if (res.ok) {
        setArticles((prev) => [...prev, data.data]);
        setNewArticle({ author_address: "", title: "", content_hash: "" });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create article");
    }
  };

  // Handle article deletion
  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: id }),
      });

      const data = await res.json();

      if (res.ok) {
        setArticles((prev) => prev.filter((article) => article._id !== id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete article");
    }
  };

  // Handle article update
  const handleUpdateArticle = async (id: string, updatedTitle: string) => {
    try {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: id, title: updatedTitle }),
      });

      const data = await res.json();

      if (res.ok) {
        setArticles((prev) =>
          prev.map((article) =>
            article._id === id ? { ...article, title: updatedTitle } : article
          )
        );
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to update article");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Articles</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Create New Article</h2>
        <input
          type="text"
          placeholder="Author Address"
          value={newArticle.author_address}
          onChange={(e) =>
            setNewArticle((prev) => ({
              ...prev,
              author_address: e.target.value,
            }))
          }
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Content Hash"
          value={newArticle.content_hash}
          onChange={(e) =>
            setNewArticle((prev) => ({
              ...prev,
              content_hash: e.target.value,
            }))
          }
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleCreateArticle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Article
        </button>
      </div>

      <ul className="space-y-4">
        {articles.map((article) => (
          <li
            key={article._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{article.title}</h3>
              <p>Author: {article.author_address}</p>
              <p>Content Hash: {article.content_hash}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  handleUpdateArticle(article._id!, "Updated Title Example")
                }
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteArticle(article._id!)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
