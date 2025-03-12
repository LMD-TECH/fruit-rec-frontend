"use server"

import { cookies } from "next/headers"

export const createCookies = async (key:string, value:string) => {
    (await cookies()).set(key, value)
}

export const getCookie = async (key:string,) => {
    return (await cookies()).get(key)?.value ?? ""
}


export const deleteCookie = async (key:string) => {
    (await cookies()).delete(key)
}