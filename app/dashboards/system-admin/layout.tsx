import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";


export default function SellerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        <DashboardHeader />
        <div className="flex w-full">
          <DashboardSidebar />
          <main className="flex-1 h-full pt-26 px-4 min-h-screen mx-auto max-w-screen-2xl w-2/3">{children}</main>
        </div>
      </div>
    </div>
  );
}
