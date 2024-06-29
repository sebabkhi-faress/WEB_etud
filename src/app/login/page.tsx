"use client"

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const Login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    try {
      await signIn(username.trim(), password.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg shadow-md border border-green-600 w-full max-w-xs sm:max-w-lg md:max-w-xl text-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="mx-auto mb-4 sm:mb-6 md:mb-8"
      />
      <form className="flex flex-col" onSubmit={Login}>
        <div className="mb-4 sm:mb-6 text-left">
          <label
            htmlFor="username"
            className="block mb-2 text-sm text-gray-600 font-bold"
          >
            <span className="text-red-500">*</span> Student Registration Number
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Example: 202336197619"
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
          {loading ? "Loading.." : "Login"}
        </button>
      </form>
    </div>
  );
}
