"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// 詳細画面のコンポーネント
export default function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/articles/${id}`);
        if (!res.ok) throw new Error("記事の取得に失敗しました");
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error(error);
        alert("記事が見つかりませんでした");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p className="my-4 text-center">読み込み中...</p>;
  if (!article)
    return <p className="my-4 text-center">記事が見つかりませんでした</p>;

  return (
    <main className="w-full max-w-screen-lg m-auto">
      <Link href="/" className="text-blue-500 hover:text-blue-600">
        一覧に戻る
      </Link>
      <article className="my-4 p-4 border rounded-md border-gray-200">
        <h1>{article.title}</h1>
        <p className="whitespace-pre-line">{article.content}</p>
        <p>投稿日：{new Date(article.createdAt).toLocaleString()}</p>
        <div className="mt-4">
          <Link
            href={`/articles/${article.id}/edit`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            この記事を編集する
          </Link>
        </div>
      </article>
    </main>
  );
}
