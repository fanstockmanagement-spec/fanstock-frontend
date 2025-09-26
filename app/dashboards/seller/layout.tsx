import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";


export default function SellerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <body className="flex flex-col">
        <DashboardHeader />
        <div className="flex w-full">
          <DashboardSidebar />
          <main className="flex-1 w-full h-full pt-26 px-4 min-h-screen mx-auto max-w-screen-2xl">{children}</main>
        </div>
      </body>
    </div>
  );
}
