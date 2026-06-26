// import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "./lib/get-session";



export default async function Home() {
   const session = await getServerSession();

   console.log(session,'session')

  if (!session) {
    redirect("/auth/sign-in");
  }

  redirect("/chats");
}