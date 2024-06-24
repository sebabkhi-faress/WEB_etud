export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute right-0 top-0 left-0 bottom-0 flex">
        <nav className="bg-gray-300 w-1/4 h-full flex justify-center items-center shadow-xl">
          hello
        </nav>
        <div className="bg-gray-200 flex flex-1 justify-center overflow-scroll">
          {children}
        </div>
      </div>
    </>
  );
}
