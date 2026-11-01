import Link from "next/link";
import AuthForm from "../auth-form";

export default function Login() {
  return <main><h1>Log in</h1><AuthForm mode="login" /><Link href="/register">Create an account</Link></main>;
}
