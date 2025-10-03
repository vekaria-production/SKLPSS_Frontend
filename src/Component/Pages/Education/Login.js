import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";


export default function Edu_Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "student",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("=== LOGIN DEBUG ===");
        console.log("Login data:", form);
        console.log("Selected role:", form.role);
        // On login form submit
        localStorage.setItem("role", form.role);
        // Capitalize first letter for navigation
        const capitalizedRole = form.role.charAt(0).toUpperCase() + form.role.slice(1);
        console.log("Navigating to:", `/Education/${capitalizedRole}`);
        console.log("==================");
        navigate(`/Education/${capitalizedRole}`);
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
        const route = form.role === "teacher" ? "/Education/Teacher" : "/Education/Student";
        navigate(route);
    };

    return (
        <div className="min-h-screen bg-[#FDF8F3] dark:bg-[#1a1a1a] font-poppins transition-colors">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white dark:bg-[#262626] p-8 rounded-2xl shadow-md dark:shadow-lg transition-all">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                        Login to your Account
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#333] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#333] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Select Role
                            </label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center text-sm text-gray-800 dark:text-gray-100">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={form.role === "student"}
                                        onChange={handleChange}
                                        className="mr-2 accent-orange-500"
                                    />
                                    Student
                                </label>
                                <label className="flex items-center text-sm text-gray-800 dark:text-gray-100">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="teacher"
                                        checked={form.role === "teacher"}
                                        onChange={handleChange}
                                        className="mr-2 accent-orange-500"
                                    />
                                    Teacher
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#F48F0F] text-[#292929] py-2 rounded-lg hover:bg-orange-500 transition-all"
                        >
                            Login
                        </button>
                    </form>

                    <div className="my-4 flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                        OR
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-all"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/Education/SignUp")}
                            className="text-[#F48F0F] hover:underline cursor-pointer"
                        >
                            Sign up
                        </span>
                    </p>
                </div>
            </div>
        </div>

    );
}
