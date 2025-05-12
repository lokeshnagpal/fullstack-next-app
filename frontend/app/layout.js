export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
