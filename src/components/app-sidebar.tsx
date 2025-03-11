'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Inter } from "next/font/google"
import Link from 'next/link'

const inter = Inter({ subsets: ["latin"] })

import { motion } from "framer-motion"
import { Apple, LayoutDashboard, Activity, Settings, User, Shield, ChevronDown, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import React from "react"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  isSubItem?: boolean
}

const NavItem = ({ href, icon, label, isActive, isSubItem }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      "group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary",
      isActive && "bg-primary/10 text-primary",
      isSubItem && "ml-6 text-muted-foreground",
    )}
  >
    {icon}
    <span>{label}</span>
    {isActive && (
      <motion.div
        layoutId="active-pill"
        className="absolute left-0 h-7 w-1 rounded-r-full bg-primary"
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 30,
        }}
      />
    )}
  </Link>
)

interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}
import { usePathname } from "next/navigation"



const Section = ({ icon, title, children, defaultOpen = false }: SectionProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-muted",
          isOpen && "text-primary",
        )}
      >
        <div className="flex items-center gap-x-3">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const sidebar = (

    <div className="flex h-full flex-col gap-4">
      <div className="flex h-14 items-center border-b px-3.5">
        <Link href="/" className="flex items-center gap-x-3">
          <div className="rounded-lg bg-primary/10 p-1">
            <Apple className="h-6 w-6 text-primary" />
          </div>
          <span className="text-lg font-semibold">Fruit Recognition</span>
        </Link>
      </div>
  
      <nav className="flex-1 space-y-4 px-3">
        <Section icon={<LayoutDashboard className="h-4 w-4" />} title="Tableau de bord" defaultOpen>
          <div className="mt-1 space-y-1">
            <NavItem
              href="/dashboard"
              icon={<Apple className="h-4 w-4" />}
              label="Détecteur de fruit"
              isActive={pathname === "/dashboard"}
              isSubItem
            />
            <NavItem
              href="/dashboard/activities"
              icon={<Activity className="h-4 w-4" />}
              label="Activités effectuées"
              isActive={pathname === "/dashboard/activities"}
              isSubItem
            />
          </div>
        </Section>
  
        <Section icon={<Settings className="h-4 w-4" />} title="Paramètre">
          <div className="mt-1 space-y-1">
            <NavItem
              href="/dashboard/profile"
              icon={<User className="h-4 w-4" />}
              label="Profil"
              isActive={pathname === "/dashboard/profile"}
              isSubItem
            />
            <NavItem
              href="/dashboard/security"
              icon={<Shield className="h-4 w-4" />}
              label="Sécurité"
              isActive={pathname === "/dashboard/security"}
              isSubItem
            />
          </div>
        </Section>
      </nav>
  
      {/* <div className="mt-auto border-t p-3">
        <div className="rounded-lg bg-muted/50 p-3">
          <h3 className="font-medium">Need Help?</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Check our documentation or contact support for assistance.
          </p>
          <Button className="mt-3 w-full" size="sm">
            View Documentation
          </Button>
        </div>
      </div> */}
    </div>
  )
  
  return (
    <Sidebar {...props} className={inter.className}>
      <aside className=" h-screen border-r lg:block">{sidebar}</aside>
    </Sidebar>
  )
}