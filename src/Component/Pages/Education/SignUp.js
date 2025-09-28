import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        mobile: "",
        parentMobile: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validatePassword = (password) => {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!validatePassword(form.password)) {
            alert(
                "Password must be at least 8 characters long, include an uppercase letter, lowercase letter, number, and special character."
            );
            return;
        }

        // TODO: Connect to backend
        console.log("Registering user:", form);
    };

    const handleGoogleSignup = () => {
        // TODO: Connect with Google OAuth logic
        alert("Google Signup clicked");
    };

    const handleSignUp = () => {
        
        navigate("/Education/Student");
        alert("Signing Up");
    };



    return (
        <div className="bg-[#fdf5ee] dark:bg-[#121212] min-h-screen flex flex-col">
            <div className="flex-1 flex justify-center items-center px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-[#1e1e1e] text-[#292929] dark:text-white shadow-xl rounded-xl p-8 w-full max-w-lg space-y-4"
                >
                    <h2 className="text-2xl font-bold text-center mb-4">Student Registration</h2>

                    <div className="w-full flex gap-2">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="flex-1 border rounded-md p-1 dark:bg-[#2a2a2a]"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="flex-1 border rounded-md p-1 dark:bg-[#2a2a2a]"
                        />
                    </div>

                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md p-2 dark:bg-[#2a2a2a]"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md p-2 dark:bg-[#2a2a2a]"
                    />

                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={form.mobile}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        required
                        className="w-full border rounded-md p-2 dark:bg-[#2a2a2a]"
                    />

                    <input
                        type="tel"
                        name="parentMobile"
                        placeholder="Parent Mobile Number (optional)"
                        value={form.parentMobile}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        className="w-full border rounded-md p-2 dark:bg-[#2a2a2a]"
                    />

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={form.gender === "Male"}
                                onChange={handleChange}
                                required
                            />
                            Male
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={form.gender === "Female"}
                                onChange={handleChange}
                            />
                            Female
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Other"
                                checked={form.gender === "Other"}
                                onChange={handleChange}
                            />
                            Other
                        </label>
                    </div>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md p-2 dark:bg-[#2a2a2a]"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md p-2 dark:bg-[#2a2a2a]"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#f48f0f] text-white py-2 rounded-md font-semibold hover:bg-orange-600 transition"
                        onClick={handleSignUp}
                    >
                        Sign Up
                    </button>

                    <div className="text-center text-gray-500 dark:text-gray-400 font-semibold">OR</div>

                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-all"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/Education/Login")}
                            className="text-[#f48f0f] font-semibold cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
