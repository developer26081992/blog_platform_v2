"use client";
import { useActionState, useState } from "react";
import { createPost, updatePost } from "./actions";
import type { PostActionState } from "../../../lib/post-validation";

type Props = {
  categories: { id: string; name: string }[];
  post?: { id: string; title: string; slug: string; content: string; categories: { id: string }[] };
};
export default function PostForm({ categories, post }: Props) {
  const [state, action, pending] = useActionState<PostActionState, FormData>(post ? updatePost : createPost, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [selected, setSelected] = useState(post?.categories.map((category) => category.id) ?? []);
  return <form action={action}>
    {post && <input type="hidden" name="id" value={post.id} />}
    <p><label>Title <input name="title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required /></label></p>
    <p><label>Slug <input name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} maxLength={200} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="my-first-post" required /></label></p>
    <p><label>Content<br /><textarea name="content" value={content} onChange={(event) => setContent(event.target.value)} rows={12} cols={65} maxLength={100000} required /></label></p>
    <fieldset><legend>Categories (choose at least one)</legend>
      {categories.map((category) => <p key={category.id}><label>
        <input type="checkbox" name="categoryIds" value={category.id} checked={selected.includes(category.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, category.id] : current.filter((id) => id !== category.id))} /> {category.name}
      </label></p>)}
    </fieldset>
    {state.error && <p role="alert">{state.error}</p>}
    <p><button disabled={pending || categories.length === 0}>{pending ? "Saving…" : post ? "Save changes" : "Create draft"}</button></p>
  </form>;
}
