
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { Home, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Overview",
    path: "/",
    icon: Home,
  },
  {
    title: "AI Insights",
    path: "/insights",
    icon: Zap,
  },
];

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <ShadcnSidebar>
      <SidebarContent className="mt-16"> {/* Added top margin to avoid navbar overlap */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 flex items-center">
          <Info className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">v1.0.0</span>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
