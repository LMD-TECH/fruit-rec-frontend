"use client"

import { getCookie } from "@/services/cookies.action";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

type PropsType = {
    children: React.ReactNode
};

type RequestOptions = {
    body: any,
    endpoint: string,
    method?: "POST" | "PUT" | "DELETE",
    contentType?: "application/json" | "multipart/form-data"
}
type GetDataParams = {
    endpoint: string
}

type ContextType = {
    onMutate: <T>(p: RequestOptions) => Promise<T | null>
    getData: <T>({ endpoint }: GetDataParams) => Promise<T>

    //  A sppr plustard
    test: string
    handleTest: (msg: string) => void
};

const context = createContext({} as ContextType);

const queryClientForProvider = new QueryClient()

const BAKEND_URL = process.env.NEXT_PUBLIC_BAKEND_URL || ""

const QueryContextProvider = ({ children }: PropsType) => {

    return (
        <QueryClientProvider client={queryClientForProvider}>
            <InnerQueryContextProvider>
                {children}
            </InnerQueryContextProvider>
        </QueryClientProvider>
    );
};

const InnerQueryContextProvider = ({ children }: PropsType) => {
    const queryClient = useQueryClient();
    const [test, setTest] = useState("Hello")

    const mutation = useMutation({
        mutationFn: async (params: RequestOptions) => await handlePost(params),
        onSuccess: () => {
            queryClient.invalidateQueries()
        },
    })


    const handleTest = (msg: string = "bonjour tout le monde.") => {
        setTest(test)
    }

    const handlePost = async (params: RequestOptions): Promise<any | null> => {
        const { contentType = "application/json", method = "POST", body, endpoint } = params;

        try {
            const token = await getCookie("auth_token",)
            const response = await fetch(BAKEND_URL + endpoint, {
                headers: contentType === "multipart/form-data" ? {
                    "Authorization": "Bearer " + token
                } : {
                    "Content-Type": contentType,
                    "Authorization": "Bearer " + token
                },
                method,
                credentials: "include",
                body: contentType === "application/json" ? JSON.stringify(body) : body,
            });

            const result: any = await response.json();
            return { ...result, status_code: response.status };

        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const getData = async ({ endpoint }: GetDataParams) => {
        try {
            const token = await getCookie("auth_token")
            const response = await fetch(BAKEND_URL + endpoint, { credentials: "include", headers: { Authorization: "Bearer " + token } })
            const result = await response.json();
            return result
        } catch (err) {
            return null
        }
    }

    const QueryValues: ContextType = { onMutate: mutation.mutateAsync, getData, handleTest, test };

    return (
        <context.Provider value={QueryValues}>
            {children}
        </context.Provider>
    );
};

const useCustomQuery = () => useContext(context)

export { QueryContextProvider, useCustomQuery };
