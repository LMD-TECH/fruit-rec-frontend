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
