"use client";
import { useActionState, useState } from "react";
import { createPost, updatePost } from "./actions";
import type { PostActionState } from "../../../lib/post-validation";
import Link from "next/link";

type Props = {
  categories: { id: string; name: string }[];
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    categories: { id: string }[];
  };
};
export default function PostForm({ categories, post }: Props) {
  const [state, action, pending] = useActionState<PostActionState, FormData>(
    post ? updatePost : createPost,
    {},
  );
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [selected, setSelected] = useState(
    post?.categories.map((category) => category.id) ?? [],
  );
  return (
    <form action={action} className="post-editor">
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="editor-main">
        <div className="field">
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            className="title-input"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A title worth stopping for"
            maxLength={200}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="post-slug">Slug</label>
          <input
            id="post-slug"
            name="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            maxLength={200}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="my-first-post"
            aria-describedby="slug-hint"
            required
          />
          <span className="field-hint" id="slug-hint">
            The address of your story. Use lowercase letters, numbers, and
            hyphens.
          </span>
        </div>
        <div className="field">
          <label htmlFor="post-content">Content</label>
          <textarea
            id="post-content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={12}
            maxLength={100000}
            placeholder="Start with a thought. See where it takes you…"
            required
          />
        </div>
      </div>
      <aside className="editor-aside">
        <h2>The finishing touches</h2>
        <p>Help readers find your story by choosing at least one category.</p>
        <fieldset className="categories-fieldset">
          <legend>Categories</legend>
          {categories.map((category) => (
            <label key={category.id} className="category-option">
              <input
                type="checkbox"
                name="categoryIds"
                value={category.id}
                checked={selected.includes(category.id)}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, category.id]
                      : current.filter((id) => id !== category.id),
                  )
                }
              />{" "}
              {category.name}
            </label>
          ))}
        </fieldset>
        {categories.length === 0 && (
          <p className="form-message" role="status">
            No categories are available yet. Add categories before creating a
            post.
          </p>
        )}
        {state.error && (
          <p className="form-message" role="alert">
            {state.error}
          </p>
        )}
        <button
          className="button"
          disabled={pending || categories.length === 0}
        >
          {pending ? "Saving…" : post ? "Save changes" : "Create draft"}
          <span aria-hidden="true">↗</span>
        </button>
        <span className="field-hint">
          {post
            ? "Changes to published stories are visible to readers as soon as you save."
            : "Your draft stays private. Publish it from My posts when you are ready."}
        </span>
        <Link className="editor-cancel" href="/dashboard/posts">
          Cancel and return to posts
        </Link>
      </aside>
    </form>
  );
}
