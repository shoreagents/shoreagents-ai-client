import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppThemeProvider } from "@/components/app-theme";
import { AuthProvider } from "@/contexts/auth-context";
import { AppProtection } from "@/components/app-protection";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
      title: "ShoreAgents AI",
  description: "IT Support and Ticket Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar_state")?.value
  // Default to true (expanded) unless explicitly set to false
  const defaultOpen = sidebarCookie !== "false"

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <AppThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppProtection>
              <SidebarProvider defaultOpen={defaultOpen}>
                {children}
                <Toaster />
              </SidebarProvider>
            </AppProtection>
          </AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
