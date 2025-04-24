
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
import { Home, Info, Zap, PieChartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";

const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();


  const dashboardMenu = {
    title: t('dashboard'),
    items: [
      {
        title: t('overviewTab'),
        path: "/",
        icon: Home,
      },
    ]
  }
  const rpaTemplatesMenus = {
    title: t("rpaTemplate"),
    items: [
      {
        title: t('overviewTab'),
        path: "/",
        icon: Home,
      },
    ]
  }
  const reportMenus = {
    title: t("reports"),
    items: [
      {
        title: t('labRobotReport'),
        path: "/lab/report",
        icon: PieChartIcon,
      },
    ]
  }
  const menuItems = [
    dashboardMenu,
    rpaTemplatesMenus,
    reportMenus,
  ];

  return (
    <ShadcnSidebar>
      <SidebarContent className="mt-16"> {/* Added top margin to avoid navbar overlap */}
        {
          menuItems.map((group) =>
            <SidebarGroup>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
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
          )
        }

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
