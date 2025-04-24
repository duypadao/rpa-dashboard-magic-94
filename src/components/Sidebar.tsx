
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
import { Home, Info, Zap, PieChartIcon, LayoutList,ContactRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";

const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const taskAutomations = {
    title: t('dashboard'),
    items: [
      {
        title: t('home'),
        path: "/",
        icon: Home,
      },
    ]
  }
  const templateMenus = {
    title: t("templateMenus"),
    items: [
      {
        title: t('templateLibrary'),
        path: "/templateLibrary",
        icon: LayoutList,
      },
      {
        title: t('myTemplate'),
        path: "/myTemplate",
        icon: ContactRound,
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
    taskAutomations,
    templateMenus,
    reportMenus,
  ];

  return (
    <ShadcnSidebar>
      <SidebarContent className="mt-16"> {/* Added top margin to avoid navbar overlap */}
        {
          menuItems.map((group) =>
            <SidebarGroup key={group.title}>
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
