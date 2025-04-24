import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Globe, Moon, Sun  } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/LanguageProvider"
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  const { language, setLanguage, t } = useLanguage();
  const changeLanguage = (lang: "en" | "cn" | "vi") => {
    setLanguage(lang);
    console.log(`Language changed to: ${lang}`);
  };
  const [empID, setEmpID] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const handleLogin = async () => {
    await auth.signIn(empID, password);
  }

  const onKeyUp = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    }
  }, [empID, password]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader >
              <div className={cn("flex")}>
                <div className="w-60">
                  <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
                </div>
                <div className="flex items-center gap-2 mr-2">
                  <Sun className="h-4 w-4 dark:text-muted-foreground" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-cyan-500"
                  />
                  <Moon className="h-4 w-4 text-muted-foreground dark:text-white" />
                </div>
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-30" variant="ghost" size="icon">
                        <Globe className="h-5 text-primary" />
                        {language == "vi" ? "Tiếng Việt" : language == "cn" ? "中文" : "English"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={language === "vi" ? "bg-muted" : ""}
                        onClick={() => changeLanguage("vi")}
                      >
                        Tiếng Việt
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={language === "cn" ? "bg-muted" : ""}
                        onClick={() => changeLanguage("cn")}
                      >
                        中文
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={language === "en" ? "bg-muted" : ""}
                        onClick={() => changeLanguage("en")}
                      >
                        English
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardDescription>
                {t("loginDescription")}
              </CardDescription>

            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="empID">{t("empId")}</Label>
                    <Input
                      id="empID"
                      type="empID"
                      required
                      value={empID}
                      onChange={(e) => {
                        setEmpID(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t("password")}</Label>
                    </div>
                    <Input value={password} onChange={(e) => {
                      setPassword(e.target.value);
                    }} id="password" type="password" required />
                  </div>
                  <Button type="button" onClick={() => { handleLogin() }} className="w-full">
                    {t("login")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
