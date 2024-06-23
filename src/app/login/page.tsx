"use client"

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const token = Cookies.get("token");
  
  if(token){
    window.location.href = "/profile";
  }
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPassword(password.trim());
    setUsername(username.trim());

    if (username.trim() === "" || password.trim().length < 8) {
      toast.error("Please enter a valid username and password");
      return;
    }

    setLoading(true);

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
      Cookies.set("token", response.data.token);
      Cookies.set("uuid", response.data.uuid);

      toast.success("Logged In Successfully", { id: toastId });

      // Redirect to /profile
      window.location.href = "/profile";
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-md border border-green-600 w-full max-w-xs sm:max-w-sm md:max-w-md text-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="mx-auto mb-4 sm:mb-6 md:mb-8"
      />
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="mb-4 sm:mb-6 text-left">
          <label
            htmlFor="username"
            className="block mb-2 text-sm text-gray-600 font-bold"
          >
            <span className="text-red-500">*</span> Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="w-full p-2 sm:p-3 border border-green-600 rounded-md focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="mb-4 sm:mb-6 md:mb-8 text-left">
          <label
            htmlFor="password"
            className="block mb-2 text-sm text-gray-600 font-bold"
          >
            <span className="text-red-500">*</span> Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full p-2 sm:p-3 border border-green-600 rounded-md focus:outline-none focus:border-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={
            loading || username.trim() === "" || password.trim().length < 8
          }
          className="w-full p-2 sm:p-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}