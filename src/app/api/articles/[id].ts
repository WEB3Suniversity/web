import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const article = await prisma.article.findUnique({
        where: { id: Number(id) },
      });
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ error: "Article not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching article" });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, content } = req.body;
      const updatedArticle = await prisma.article.update({
        where: { id: Number(id) },
        data: { title, content },
      });
      res.status(200).json(updatedArticle);
    } catch (error) {
      res.status(500).json({ error: "Error updating article" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.article.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error deleting article" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
