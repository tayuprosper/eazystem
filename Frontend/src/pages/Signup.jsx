import { useState } from "react"
import supabaseService from "../Services/supaBaseServices"
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";


export default function Signup() {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);   
        const result = await supabaseService.signUp(email, password);
        if (result) {
            navigate("/workspace");
            setLoading(false);
        } else {
            setError("Sign up failed. Please try again.");
            setLoading(false);
        }
    };



    return (
        <div className="section signup py-10 h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <p className="text-primary mb-6">Create an account to access exclusive features and content.</p>
            <form className="max-w-xl mx-auto p-6 rounded-lg shadow-md w-1/2 h-1/2 flex flex-col justify-center">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-primary font-semibold mb-2">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary" placeholder="Enter your email" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-primary font-semibold mb-2">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary" placeholder="Enter your password" />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button type="submit" onClick={(e)=>{handleSubmit(e)}} className="w-full bg-primary text-white flex items-center justify-center font-semibold py-2 rounded-lg hover:bg-primary-dark transition duration-300" disabled={loading}>
                    {loading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
                </button>
            </form>
            {/* login link */}
            <p className="text-gray-600 mt-4">Already have an account? <a href="/login" className="text-primary font-semibold hover:underline">Log in</a></p>
        </div>
    )
}