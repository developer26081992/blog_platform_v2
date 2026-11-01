import Link from "next/link";
import AuthForm from "../auth-form";

export default function Register() {
  return <main><h1>Register</h1><AuthForm mode="register" /><Link href="/login">Log in</Link></main>;
}
