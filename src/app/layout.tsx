import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import baseMetadata from "@/assets/metadata";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const { siteName, keywords, description, title, url } = baseMetadata;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    template: `%s - ${title}`,
    default: title,
  },
  description,
  applicationName: siteName,
  keywords,
  authors: [{ name: "Kinyua Nyaga" }],
  creator: "Kinyua Nyaga",
  publisher: "Kinyua Nyaga",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${poppins.variable}`,
          "bg-secondary flex flex-col w-[100vw] h-[100vh]",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
