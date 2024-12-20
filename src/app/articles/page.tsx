"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Article = {
  _id?: string;
  article_id?: number;
  author_address: string;
  title: string;
  content_hash: string;
  created_at?: string;
  submission_time?: string;
  votes_for?: string;
  votes_against?: string;
  reward_amount?: string;
  status?: string;
};

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getArticleFn = () => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch(() => setError("Failed to fetch articles"));
  };
  // Fetch all articles on page load
  useEffect(() => {
    getArticleFn();
  }, []);

  // Open the modal for creating or editing an article
  const openModal = (article?: Article) => {
    if (article) {
      setCurrentArticle(article);
      setIsEditing(true);
    } else {
      setCurrentArticle({ author_address: "", title: "", content_hash: "" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentArticle(null);
    setError(null);
    getArticleFn();
  };

  // Handle form submission (create or update article)
  const handleSubmit = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing
        ? `/api/articles/${currentArticle?._id}`
        : "/api/articles";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentArticle),
      });

      if (res.ok) {
        closeModal();
      }
    } catch {
      setError("Failed to save article");
    }
  };

  // Handle article deletion
  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setArticles((prev) => prev.filter((article) => article._id !== id));
      } else {
        setError("Failed to delete article");
      }
    } catch {
      setError("Failed to delete article");
    }
  };
  const handleViewDetails = (id: string) => {
    router.push(`/articles/${id}`); // Navigate to the details page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold mb-6">Articles</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Create New Article
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ul className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <li
              onClick={() => handleViewDetails(article._id!)}
              key={article?._id}
              className="border border-gray-700 p-4 rounded flex justify-between items-center cursor-pointer"
            >
              <div>
                <h3 className="font-bold">{article?.title}</h3>
                <p>Author: {article?.author_address}</p>
                <p>Content Hash: {article?.content_hash}</p>
                <p>Submission Time: {article?.submission_time || "N/A"}</p>
                <p>Votes For: {article?.votes_for || 0}</p>
                <p>Votes Against: {article?.votes_against || 0}</p>
                <p>Reward Amount: {article?.reward_amount || 0}</p>
                <p className="flex items-center">
                  Status:
                  <span
                    className={`ml-2 h-3 w-3 rounded-full ${
                      article?.status === "Pending"
                        ? "bg-yellow-500"
                        : article?.status === "Approved"
                        ? "bg-green-500"
                        : article?.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  ></span>
                  <span className="ml-2">{article?.status || "Unknown"}</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(article)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteArticle(article._id!)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No articles found.</p>
        )}
      </ul>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Author Address
              </label>
              <input
                type="text"
                value={currentArticle?.author_address || ""}
                onChange={(e) =>
                  setCurrentArticle((prev) =>
                    prev ? { ...prev, author_address: e.target.value } : null
                  )
                }
                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={currentArticle?.title || ""}
                onChange={(e) =>
                  setCurrentArticle((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Content Hash
              </label>
              <input
                type="text"
                value={currentArticle?.content_hash || ""}
                onChange={(e) =>
                  setCurrentArticle((prev) =>
                    prev ? { ...prev, content_hash: e.target.value } : null
                  )
                }
                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-white"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
