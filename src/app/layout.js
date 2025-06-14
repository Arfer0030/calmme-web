import "./globals.css";

export const metadata = {
  title: "CalmMe Web",
  description: "CalmMe Web Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
