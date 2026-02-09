// import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";
import Header from "../components/ui/NavBar";
import { UserProvider } from "../context/userContext";

type Props = {
  children: ReactNode;
};
export default function DashboardLayout({ children }: Props) {
  return (
    <main className="text-foreground bg-background">
      <div className="flex-1 h-full overflow-y-auto ">
        <UserProvider>
          <Header />
          <div>{children}</div>
        </UserProvider>
      </div>
    </main>
  );
}
