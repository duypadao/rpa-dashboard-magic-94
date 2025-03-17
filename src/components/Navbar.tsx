
import { Bell, Moon, Search, Settings, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setIsDark(newTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <div className="font-semibold text-xl">RPA Dashboard</div>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-12">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search robots..."
              className="w-full pl-8 bg-background/50"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 dark:text-muted-foreground" />
            <Switch 
              checked={isDark} 
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-cyan-500"
            />
            <Moon className="h-4 w-4 text-muted-foreground dark:text-white" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-medium text-error-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="p-3 cursor-pointer flex flex-col items-start gap-1">
                    <div className="font-medium">RPA Robot Error</div>
                    <div className="text-sm text-muted-foreground">Invoice Processing Robot #1 has encountered an error</div>
                    <div className="text-xs text-muted-foreground">10 min ago</div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
