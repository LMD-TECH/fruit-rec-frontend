"use client"

import { isAuthenticatedOrRedirect } from '@/services/session.action'
import { _User } from '@/types/user.zod'
import React from 'react'

function useUser() {

    const [user, setUser] = React.useState<_User | null>(null)

    React.useEffect(() => {
        (async () => {
            const user = await isAuthenticatedOrRedirect(true)
            console.log("User", user)
            setUser(user)
        })()
    }, [])
    return user
}

export default useUser
