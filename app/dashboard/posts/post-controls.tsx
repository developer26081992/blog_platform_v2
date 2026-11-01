"use client";
import { useActionState } from "react";
import { deletePost, setPublished } from "./actions";
import type { PostActionState } from "../../../lib/post-validation";

export default function PostControls({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const [publication, publishAction, publishing] = useActionState<
    PostActionState,
    FormData
  >(setPublished, {});
  const [deletion, deleteAction, deleting] = useActionState<
    PostActionState,
    FormData
  >(deletePost, {});
  return (
    <div className="post-controls">
      <form action={publishAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="published" value={String(!published)} />
        <button className="action-button" disabled={publishing || deleting}>
          {publishing ? "Saving…" : published ? "Unpublish" : "Publish"}
        </button>
        {publication.error && (
          <p className="row-error" role="alert">
            {publication.error}
          </p>
        )}
      </form>
      <form
        action={deleteAction}
        onSubmit={(event) => {
          if (!window.confirm("Delete this post?")) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          className="action-button action-danger"
          disabled={publishing || deleting}
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
        {deletion.error && (
          <p className="row-error" role="alert">
            {deletion.error}
          </p>
        )}
      </form>
    </div>
  );
}
