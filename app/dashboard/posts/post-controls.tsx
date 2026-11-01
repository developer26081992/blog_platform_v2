"use client";
import { useActionState } from "react";
import { deletePost, setPublished } from "./actions";
import type { PostActionState } from "../../../lib/post-validation";

export default function PostControls({ id, published }: { id: string; published: boolean }) {
  const [publication, publishAction, publishing] = useActionState<PostActionState, FormData>(setPublished, {});
  const [deletion, deleteAction, deleting] = useActionState<PostActionState, FormData>(deletePost, {});
  return <>
    <form action={publishAction}>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="published" value={String(!published)} />
      <button disabled={publishing || deleting}>{publishing ? "Saving…" : published ? "Unpublish" : "Publish"}</button>
      {publication.error && <p role="alert">{publication.error}</p>}
    </form>
    <form action={deleteAction} onSubmit={(event) => { if (!window.confirm("Delete this post?")) event.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button disabled={publishing || deleting}>{deleting ? "Deleting…" : "Delete"}</button>
      {deletion.error && <p role="alert">{deletion.error}</p>}
    </form>
  </>;
}
