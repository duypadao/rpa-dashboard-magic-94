import { createContext, useState, useEffect, useContext } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { LoginForm } from "./login";
import { useToast } from "@/hooks/use-toast"
import { useAxios } from "@/axios/AxiosProvider";
//Khởi tạo context qua createContext
export const AuthContext = createContext<any>(null);


const AuthProvider = ({ children, mustLogin = false }) => {
  const { t } = useLanguage();
  const { toast } = useToast()
  const [user, setUser] = useState(null); //token?.user
  const [status, setStatus] = useState(null); //authStatus
  const [authorize, setAuthorize] = useState([]);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const axios = useAxios();

  const signOut = async () => {
    try {
      await axios.get("/signOut");
      toast({
        description: t("success")
      });
      setUser(null);
      setIsAdministrator(false);
      setStatus("fail");
      localStorage.removeItem("token");
    }
    catch {

    }

  }

  const signIn = async (username, password) => {
    try {
      const response = await axios.post("/token", {
        username, password
      });
      if (response.data.user === null) {
        setUser(null);
        toast({ description: t("pleaseLoginToContinue") });
        localStorage.removeItem("token");
        setStatus("fail");
      } else {
        setStatus("success");
        localStorage.setItem("token", response.data.token); //Nếu lấy được dữ từ phía token sẽ lưu token trên localstorage
        setUser(response.data.user); //Update user thông tin người dùng
        await loadAccesses();
      }

    } catch (err) {
      console.log(err);
      setStatus("fail");
      if (err.response.status !== 400) {
        toast({
          description: t("pleaseLoginToContinue"),
          variant: "destructive",
        });
      }
      localStorage.removeItem("token");
    }
  }

  //Ktra token xem có tt hay ko?
  const checkToken = async () => {
    try {
      const response = await axios.get("/getToken");
      if (response.data.user === null) {
        setUser(null);
        toast({ description: t("pleaseLoginToContinue") });
        localStorage.removeItem("token");
        setStatus("fail");
      } else {
        setStatus("success");
        localStorage.setItem("token", response.data.token); //Nếu lấy được dữ từ phía token sẽ lưu token trên localstorage
        setUser(response.data.user); //Update user thông tin người dùng
        await loadAccesses();
      }

    } catch (err) {
      console.log(err);
      setStatus("fail");
      if (err.response.status !== 401) {
        toast({
          description: t("pleaseLoginToContinue"),
          variant: "destructive",
        });
      }
      localStorage.removeItem("token");
    }
  };
  const loadAccesses = async () => {
    try {
      const responseAuthorized = await axios.get("/auth/accesses"); //Lấy quyền truy cập dữ liệu của người dùng sau khi đã có token
      setAuthorize(responseAuthorized.data.accesses); //Lưu quyền truy cập của người dùng vào biến authorize
      setIsAdministrator(responseAuthorized.data.isAdministrator); //Update user thông tin người dùng
    }
    catch (ex) {
      console.log(ex);
    }

  }

  useEffect(() => {
    if (status !== "success") {
      checkToken();
    }
  }, [status]);
  return (
    <AuthContext.Provider
      value={{
        user,
        isAdministrator,
        setUser,
        setAuthorize,
        setIsAdministrator,
        authorize,
        signIn,
        signOut,
        setStatus
      }}
    >
      {/* Render Login page when required. Login must be inside authen context to access login function */}
      {mustLogin && status === "fail" && <LoginForm></LoginForm>}
      {/* Render content*/}
      {(!mustLogin || (mustLogin && status === "success")) && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
export { useAuth };
export default AuthProvider;