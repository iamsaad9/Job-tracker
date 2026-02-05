// import Sidebar from "@/components/Sidebar";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/SideBar";

import { IconHome } from "@tabler/icons-react";
import { User, Plus, ChartArea, ClipboardList } from "lucide-react";
import { ReactNode } from "react";
import Header from "../components/ui/NavBar";

type Props = {
  children: ReactNode;
};
export default function DashboardLayout({ children }: Props) {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <IconHome className="text-white" />,
    },
    {
      label: "Documents",
      href: "/claims/view",
      icon: <ClipboardList className="text-white" />,
    },

    {
      label: "Profile",
      href: "/profile",
      icon: <User className="text-white" />,
    },
  ];
  return (
    <main className="text-foreground bg-background">
      {/* <Sidebar>
        <SidebarBody className="h-full">
          {links.map((l, i) => (
            <SidebarLink key={i} link={l} />
          ))}
        </SidebarBody>
      </Sidebar> */}

      <div className="flex-1 h-full overflow-y-auto ">
        <Header />
        <div>{children}</div>
      </div>
    </main>
  );
}
