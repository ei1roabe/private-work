"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
}

export default function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filedErrors, setFiledErrors] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/articles/${id}`);
        if (!res.ok) throw new Error("記事データの読み込みに失敗しました");
        const data = await res.json();

        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error(error);
        alert("記事データの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    setFiledErrors({
      title: !trimmedTitle ? "タイトルを入力してください" : "",
      content: !trimmedContent ? "本文を入力してください" : "",
    });

    if (!trimmedTitle || !trimmedContent) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:3000/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle, content: trimmedContent }),
      });
      console.log(res);
      if (!res.ok) throw new Error("更新に失敗しました");
      router.push(`/articles/${id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="my-4 text-center">読み込み中...</p>;
  if (!title && !content)
    return <p className="my-4 text-center">記事データが見つかりませんでした</p>;

  return (
    <main className="w-full max-w-screen-lg m-auto">
      <Link href="/" className="text-blue-500 hover:text-blue-600">
        一覧に戻る
      </Link>
      <h1 className="text-2xl font-bold my-4">記事を編集する</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-slate-700"
          >
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 ${filedErrors.title ? "border-red-500" : "border-slate-300"}`}
            placeholder="記事のタイトルを入力"
          />
          {filedErrors.title && <p>{filedErrors.title}</p>}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="content"
            className="text-sm font-semibold text-slate-700"
          >
            本文
          </label>
          <textarea
            name=""
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            rows={12}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 ${filedErrors.content ? "border-red-500" : "border-slate-300"}`}
            placeholder="記事の本文を入力"
          />
          {filedErrors.content && <p>{filedErrors.content}</p>}
        </div>
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          <Link href={`/articles/${id}`}>キャンセル</Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md shadow-sm transition-colors font-medium"
          >
            {isSubmitting ? "更新中..." : "変更を保存"}
          </button>
        </div>
      </form>
    </main>
  );
}
