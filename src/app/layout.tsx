import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stocks App",
  description: "Real time stocks from Twelve Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Provider store={makeStore()}> */}
          {children}
        {/* </Provider> */}
      </body>
    </html>
  );
}