"use client"

import React from 'react'


type Router = {
    push: (pathname: string) => void;
    replace: (pathname: string) => void;
}

function useRouter(): Router {

    const push = (pathname: string) => {
        window.location.pathname = pathname
    }
    const replace = (pathname: string) => {
        window.location.pathname = pathname
    }

    return { push, replace }
}

export default useRouter

