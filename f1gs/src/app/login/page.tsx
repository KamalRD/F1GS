"use client";

// React & Next
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

// Libraries (Supabase & Zod)
import { signIn } from "@/lib/subapase/auth";
import { z } from "zod";

export default function Login() {
  const [loginValues, setLoginValues] = useState<LoginValues>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginValues, string>>
  >({});
  const [loginError, setLoginError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof LoginValues];
      return newErrors;
    });
    setLoginValues({ ...loginValues, [name]: value });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(loginValues);
      const { error } = await signIn(
        loginValues.username,
        loginValues.password
      );
      if (error) {
        setLoginError(error.message);
      } else {
        router.push("/admin");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: Partial<Record<keyof LoginValues, string>> = {};
        err.errors.forEach((error) => {
          validationErrors[error.path[0] as keyof LoginValues] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="flex items-start mt-[10%] justify-center max-h-screen">
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center w-72 h-80 bg-white pt-2 pb-4 px-4 rounded-md shadow-md"
      >
        <h1 className="text-center my-4 text-2xl font-bold">F1GS Admin</h1>
        <label className="flex flex-col mb-4">
          <input
            type="email"
            name="username"
            value={loginValues.username}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-2 text-sm"
          />
          <span className="text-xs text-red-500">{errors.username}</span>
          <span className="text-sm mt-1">Email</span>
        </label>
        <label className="flex flex-col mb-4">
          <input
            type="password"
            name="password"
            value={loginValues.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="border-2 border-solid rounded-md border-brand_grey focus:border-brand_gold p-2 text-sm"
          />
          <span className="text-xs text-red-500">{errors.password}</span>
          <span className="text-sm mt-1">Password</span>
        </label>
        <span className="text-sm font-medium text-center text-red-500">
          {loginError}
        </span>
        <button
          type="submit"
          className="bg-brand_red text-white rounded-md p-2 mt-4 hover:bg-brand_gold transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}

const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" })
    .endsWith("@fordham.edu", { message: "Use your '@fordham.edu' email" }),
  password: z.string().min(1, { message: "Please enter a complete password" }),
});

type LoginValues = z.infer<typeof loginSchema>;
