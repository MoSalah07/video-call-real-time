import Navbar from "../components/ui/navbar/Navbar";
import Sidebar from "../components/ui/sidebar/Sidebar";

interface IProps {
  children: React.ReactNode;
  showSidebar: boolean;
}

export default function Layout({ showSidebar, children }: IProps) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto"> {children}</main>
        </div>
      </div>
    </div>
  );
}
