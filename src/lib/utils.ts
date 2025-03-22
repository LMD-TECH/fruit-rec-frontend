import { getCookie } from "@/services/cookies.action";
import { _User } from "@/types/user.zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const getFirstAndLastChar = (user: _User | null): string => {
  return user?.prenom[0] + "" + user?.nom_famille[0];
};

type Response<T> = {
  statusCode: number;
  data: T;
};

type RequestParams = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  contentType?: "application/json" | "multipart/form-data";
  body?: any;
};

export const handleRequest = async <T>({
  endpoint,
  method = "GET",
  contentType = "application/json",
  body,
}: RequestParams): Promise<Response<T> | null> => {
  try {
    const BAKEND_URL = process.env.NEXT_PUBLIC_BAKEND_URL;
    const token = await getCookie("auth_token");

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType === "application/json") {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(BAKEND_URL + endpoint, {
      credentials: "include",
      method,
      headers,
      body:
        body && contentType === "application/json"
          ? JSON.stringify(body)
          : body,
    });

    if (!response.ok) {
      console.error(
        `Request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const result = await response.json();
    return { data: result, statusCode: response.status };
  } catch (err) {
    console.error("handleRequest error:", err);
    return null;
  }
};
