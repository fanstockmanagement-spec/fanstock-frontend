export default function SellerDashboardLayout({
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
  