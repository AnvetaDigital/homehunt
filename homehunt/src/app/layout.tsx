import "./globals.css";
import Providers from "@/components/Providers";
import AuthButton from "@/components/AuthButton";
import { Toaster } from "react-hot-toast";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="fixed top-4 right-6 z-50">
            <AuthButton />
          </div>
          <FavoritesProvider>{children}</FavoritesProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
