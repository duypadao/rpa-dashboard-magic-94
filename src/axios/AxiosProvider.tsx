import { useLanguage } from '@/components/LanguageProvider';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosInstance } from 'axios';
import { createContext, useContext } from 'react';


const AxiosContext = createContext<AxiosInstance>(null);


const getToken = () => {
  return localStorage.getItem("token");
};

const AxiosProvider = ({ children }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const axiosClient = axios.create({
    baseURL: "http://ros:8103"
  });
  axiosClient.defaults.withCredentials = true;

  axiosClient.interceptors.request.use(
    (request) => {
      const token = getToken();
      // const { token } = store.getState().auth;
      if (token && token.length > 0) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    },
    (error) => {
      console.log(error);
      // toast({
      //   description: t("loading"),
      //   itemID: axiosToastId
      // });
      return Promise.reject(error);
    }
  );

  axiosClient.interceptors.response.use(
    (response) => {
      // close when received response
      return response;
    },
    (error) => {
      // close when error occured
      if (error.response) {
        if (error.response.status === 401) {
          //store.dispatch(logoutUser());
        } else {
          //toast.error(error.response.data);
        }
      } else {
        //toast.error(`${error.code}-${error.message}`);
      }
      return Promise.reject(error);
    }
  );

  return <AxiosContext.Provider value={axiosClient} >
    {children}
  </AxiosContext.Provider>;
}

const useAxios = ()=>{
    const context = useContext(AxiosContext);
    if (context === undefined) {
      throw new Error("useAxios must be used within a AxiosProvider");
    }
    return context;
}
export {useAxios};
export default AxiosProvider;