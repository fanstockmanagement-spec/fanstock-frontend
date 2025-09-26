
export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <body>
          {children}
      </body>
    </div>
  );
}
