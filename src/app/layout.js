import "./globals.css";

export const metadata = {
  title: "CalmMe Web",
  description: "CalmMe Web Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
