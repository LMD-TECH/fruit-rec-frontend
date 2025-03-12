"use client";
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Search, Settings, Home, LogOutIcon } from "lucide-react";

import { cn, getFirstAndLastChar } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { _User } from "@/types/user.zod"
import useUser from "@/hooks/use-user"
import { deleteCookie } from "@/services/cookies.action"

interface BreadcrumbItem {
    label: string
    href: string
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean)
    return paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
        return { label, href }
    });
}

export function Navbar() {
    const pathname = usePathname()
    const [open, setOpen] = React.useState<boolean>(false)
    const breadcrumbs = getBreadcrumbs(pathname)
    const user = useUser()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open: boolean) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])


    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="flex flex-1 items-center justify-between">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2">
                        <SidebarTrigger />

                        <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                            <Home />
                        </Link>
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={item.href}>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        index === breadcrumbs.length - 1 && "text-foreground",
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </nav>

                    {/* Right side items */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        {/* <Button
                            variant="outline"
                            className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                            onClick={() => setOpen(true)}
                        >
                            <Search className="h-4 w-4 xl:mr-2" />
                            <span className="hidden xl:inline-flex">Search...</span>
                            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button> */}

                        {/* Notifications */}
                        {/* <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge variant="secondary" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                                3
                            </Badge>
                        </Button> */}

                        {/* Settings */}
                        {/* <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button> */}

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full mr-5 cursor-pointer">
                                    <Avatar className="h-9 w-9 bg-primary/10 hover:bg-primary/15 transition-colors">
                                        <AvatarFallback className="bg-transparent text-primary font-medium">{getFirstAndLastChar(user)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{`${user?.prenom} ${user?.nom_famille}`}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        Profile
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup> */}
                                {/* <DropdownMenuSeparator /> */}
                                <DropdownMenuItem asChild className="text-destructive cursor-pointer">
                                    <Button variant={"outline"} onClick={async () => await deleteCookie("auth_token")}> <LogOutIcon className="text-destructive" />
                                        Déconnexion
                                    </Button>
                                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Search Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>
                            <Search className="mr-2 h-4 w-4" />
                            <span>Search Fruits</span>
                        </CommandItem>
                        <CommandItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Recent">
                        <CommandItem>Banana Detection Results</CommandItem>
                        <CommandItem>Apple Analysis Report</CommandItem>
                        <CommandItem>Mango Classification Data</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </header>
    )
}

