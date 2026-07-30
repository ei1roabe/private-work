"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filedErrors, setFiledErrors] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // データを取ってくる関数
  const fetchArticles = async () => {
    try {
      const res = await fetch("http://localhost:3000/articles");
      if (!res.ok) throw new Error("データ取得失敗");

      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error("エラーが発生しました", error);
      alert("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 送信中はボタンを無効化（連打防止）
    if (isSubmitting) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // バリデーション
    setFiledErrors({
      title: !trimmedTitle ? "タイトルを入力してください" : "",
      content: !trimmedContent ? "本文を入力してください" : "",
    });

    if (!trimmedTitle || !trimmedContent) return;

    setFiledErrors({ title: "", content: "" });

    // 送信中フラグを立てる
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle, content: trimmedContent }),
      });

      if (!res.ok) throw new Error("投稿に失敗しました");

      const newArticle: Article = await res.json();

      // 成功したら入力欄を空にする
      setTitle("");
      setContent("");
      setArticles((prev) => [newArticle, ...prev]); // 再取得不要
    } catch (error) {
      console.error("投稿エラー", error);
      alert("投稿に失敗しました");
    } finally {
      // 送信中フラグを解除
      setIsSubmitting(false);
    }
  };

  // 削除ボタンの処理
  const handleDelete = async (id: string) => {
    // ユーザーに確認を求める
    const isConfirmed = window.confirm("この記事を削除してもよろしいですか？");
    if (!isConfirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`http://localhost:3000/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除に失敗しました");

      setArticles((prev) => prev.filter((article) => article.id !== id));

      alert("削除しました");
    } catch (error) {
      console.error("削除エラー", error);
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <p className="my-4 text-center">読み込み中...</p>;

  return (
    <main className="w-full max-w-screen-lg m-auto">
      <h1 className="p-2 text-xl border-b-2">技術ブログ</h1>
      <h2 className="my-4 mb-0 p-2 text-lg">新規記事を投稿する</h2>
      <form onSubmit={handleSubmit} className="my-4 bg-gray-100 p-4 rounded-md">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            placeholder="記事のタイトル"
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value);
              if (filedErrors.title)
                setFiledErrors({ ...filedErrors, title: "" });
            }}
            className={`w-full p-2 border rounded-md
              ${filedErrors.title ? "border-red-500" : "border-gray-300"}`}
          />
          {filedErrors.title && (
            <p className="text-red-500">{filedErrors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            本文
          </label>
          <textarea
            id="content"
            placeholder="記事の本文"
            value={content}
            onChange={(e) => {
              setContent(e.currentTarget.value);
              if (filedErrors.content)
                setFiledErrors({ ...filedErrors, content: "" });
            }}
            className={`w-full block p-2 border rounded-md
              ${filedErrors.content ? "border-red-500" : "border-gray-300"}`}
          />
          {filedErrors.content && (
            <p className="text-red-500">{filedErrors.content}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          {isSubmitting ? "投稿中..." : "記事を投稿する"}
        </button>
      </form>
      <h2 className="p-2 text-lg">記事一覧</h2>
      {articles.length === 0 ? (
        <p className="my-4 text-center">記事がありません</p>
      ) : (
        <div>
          {articles.map((article) => (
            <div
              className="my-4 p-4 border rounded-md border-gray-200"
              key={article.id}
            >
              <h2 className="mb-2 text-lg font-bold text-blue-400">
                <Link href={`/articles/${article.id}`}>{article.title}</Link>
              </h2>
              <p className="mb-2 line-clamp-3">{article.content}</p>
              <div className="flex items-center justify-between">
                <p>投稿日：{new Date(article.createdAt).toLocaleString()}</p>
                <button
                  onClick={() => handleDelete(article.id)}
                  className={`p-1 px-3 text-sm text-white rounded-md transition-colors
                    ${isDeleting ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover: bg-red-600"}`}
                >
                  {isDeleting ? "削除中…" : "削除"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
