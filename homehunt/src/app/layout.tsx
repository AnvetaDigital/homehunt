import "./globals.css";
import Providers from "@/components/Providers";
import AuthButton from "@/components/AuthButton";

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

          {children}

        </Providers>
      </body>
    </html>
  );
}
