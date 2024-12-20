"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ArticleDetailsPage() {
  const { id } = useParams(); // Get the `id` from the dynamic route
  const router = useRouter();
  interface Article {
    title: string;
    author_address: string;
    content_hash: string;
    submission_time: number;
    votes_for: number;
    votes_against: number;
    reward_amount: number;
    status: "Pending" | "Approved" | "Rejected" | "Unknown";
  }

  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the article details
  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setArticle(data);
        }
      })
      .catch(() => setError("Failed to fetch article details."));
  }, [id]);

  // Handle "Vote For" functionality
  const handleVoteFor = async () => {
    try {
      const res = await fetch(`/api/articles/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "for" }),
      });
      const data = await res.json();
      if (res.ok) {
        setArticle((prev: Article | null) =>
          prev
            ? {
                ...prev,
                votes_for: data.votes_for,
                status: data.status,
              }
            : prev
        );
      } else {
        setError(data.error || "Failed to vote.");
      }
    } catch {
      setError("Failed to vote.");
    }
  };

  // Handle "Vote Against" functionality
  const handleVoteAgainst = async () => {
    try {
      const res = await fetch(`/api/articles/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "against" }),
      });
      const data = await res.json();
      if (res.ok) {
        setArticle((prev: Article | null) =>
          prev
            ? {
                ...prev,
                votes_against: data.votes_against,
                status: data.status,
              }
            : prev
        );
      } else {
        setError(data.error || "Failed to vote.");
      }
    } catch {
      setError("Failed to vote.");
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!article) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 text-center">
      <h1 className="text-2xl font-bold mb-6">{article.title || "Untitled"}</h1>
      <p>
        <strong>Author:</strong> {article.author_address || "Unknown"}
      </p>
      <p>
        <strong>Content Hash:</strong> {article.content_hash || "N/A"}
      </p>
      <p>
        <strong>Submission Time:</strong>{" "}
        {article.submission_time
          ? new Date(article.submission_time * 1000).toLocaleString()
          : "N/A"}
      </p>
      <p>
        <strong>Votes For:</strong> {article.votes_for || 0}
      </p>
      <p>
        <strong>Votes Against:</strong> {article.votes_against || 0}
      </p>
      <p>
        <strong>Reward Amount:</strong> {article.reward_amount || 0}
      </p>
      <p className="flex items-center justify-center">
        <strong>Status:</strong>
        <span
          className={`ml-2 h-3 w-3 rounded-full ${
            article.status === "Pending"
              ? "bg-yellow-500"
              : article.status === "Approved"
              ? "bg-green-500"
              : article.status === "Rejected"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        ></span>
        <span className="ml-2">{article.status || "Unknown"}</span>
      </p>

      {/* Voting Buttons */}
      <div className="flex space-x-4 mt-6 justify-center">
        <button
          onClick={handleVoteFor}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Vote For
        </button>
        <button
          onClick={handleVoteAgainst}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Vote Against
        </button>
        <button
          onClick={() => router.push("/articles")}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}
