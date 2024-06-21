"use client";

import axios from "axios";
import Image from "next/image";

import toast from "react-hot-toast";

import { useState } from "react";
import { log } from "console";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log("Logging in...");
      throw Error("hello");

      const response = await axios.post(
        "https://progres.mesrs.dz/api/authentication/v1/",
        {
          username,
          password,
        }
      );
      localStorage.setItem("userData", response.data);
      // TODO: add react-hot-toast
      toast("logged in");
    } catch (err) {
      console.error(err);
      toast.error("something went wrong", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto mb-6"
        />
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">Login</h2>
          <div className="mb-4 text-left">
            <label
              htmlFor="username"
              className="block mb-2 text-sm text-gray-600"
            >
              <span className="text-red-500">* </span>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="mb-6 text-left">
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-gray-600"
            >
              <span className="text-red-500">* </span>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || username === "" || password === ""}
            onClick={() => console.log("eee")}
            className="w-full p-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
