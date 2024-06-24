"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    setUser(data);
  }, []);

  const [user, setUser] = useState<string | null>(null);

  const signIn = async (username: string, password: string) => {
    const toastId = toast.loading("Logging In..");

    try {
      const response = await axios.post(
        "https://progres.mesrs.dz/api/authentication/v1/",
        {
          username,
          password,
        }
      );

      localStorage.setItem("userData", JSON.stringify(response.data));
      setUser(response.data);

      Cookies.set("token", response.data.token);
      Cookies.set("uuid", response.data.uuid);

      router.push("/profile");

      toast.success("Logged In Successfully", { id: toastId });
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        toast.error("Invalid Credentials", {
          duration: 3000,
          id: toastId,
        });
      } else {
        toast.error("Something Went Wrong", {
          duration: 3000,
          id: toastId,
        });
      }
    }
  };

  const signOut = () => {
    localStorage.removeItem("userData");
    setUser(null);
    Cookies.remove("token");
    Cookies.remove("uuid");
  };

  return (
    <authContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </authContext.Provider>
  );
};

const authContext = createContext<any>(null);

export const useAuth = () => useContext(authContext);
