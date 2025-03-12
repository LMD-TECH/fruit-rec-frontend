"use server";
import { redirect } from "next/navigation";
import { _User } from "@/types/user.zod";
import { getCookie } from "./cookies.action";

const isAuthenticatedOrRedirect = async (notRedirect: boolean = false) => {
  const URL = process.env.BAKEND_URL ?? "";
  try {
    const token = await getCookie("auth_token");
    const response = await fetch(URL + `/api/auth/is-authenticated/`, {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "POST",
      credentials: "include",
    });

    const result: { is_authenticated: boolean; user: _User } =
      await response.json();
    console.log("Result", result);
    if (!result.is_authenticated && !notRedirect) redirect("/auth/login");
    return result.user;
  } catch (err) {
    console.error(err);
    if (notRedirect) return null;
    redirect("/auth/login");
  }
};

export { isAuthenticatedOrRedirect };
