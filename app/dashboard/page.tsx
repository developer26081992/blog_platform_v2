import Link from "next/link";

export default function Dashboard() {
  return <><h1>Dashboard</h1><p>You are logged in.</p><Link href="/dashboard/posts">Manage my posts</Link></>;
}
