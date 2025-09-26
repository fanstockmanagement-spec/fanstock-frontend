export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center p-4 w-full h-16 bg-white border-b border-gray-200 fixed">
      <h1>250 Kicks</h1>
      <span className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pr-5">
        <h1 className="bg-white rounded-full p-2 w-[40px] h-[40px] flex items-center justify-center border border-gray-300">A</h1>
        <p className="text-sm font-medium">Hello, Seller</p>
      </span>
    </header>
  );
}