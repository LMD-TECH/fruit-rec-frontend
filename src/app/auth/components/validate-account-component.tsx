"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useCustomQuery } from '@/context/querycontext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ValidateAccountComponent() {
    const params = useSearchParams()
    const router = useRouter()
    const token = params.get("token")
    const { getData } = useCustomQuery()
    if (!token) return <p className="text-red-500">URL No valid !</p>
    const { isLoading, data, status, error } = useQuery<{}>({ queryFn: () => getData({ endpoint: "/api/auth/validate-email?token=" + token }) })
    if (isLoading) return <p>Chargment...</p>
    if (!status || !data) return <p className="text-red-500">Une erreur s'est produite !</p>
    if (error) return <p className="text-red-500">{JSON.stringify(error)}</p>

    return (
        <div>
            <p>OK, votre compte est verifié. vous pouvez vous connectez</p>
            <Button className="cursor-pointer w-full" type="button" onClick={() => router.replace("/auth/login")}>
                Se connecter
            </Button>
        </div>
    )
}

export default ValidateAccountComponent
