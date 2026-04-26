import { useState } from "react";
import supabaseService from "../Services/supaBaseServices";
import { useNavigate, Link } from "react-router-dom";
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
        <div className="section signup py-10 min-h-screen flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
            <p className="text-primary mb-8 text-center max-w-md">Create an account to access exclusive features and content.</p>
            <form className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-4">
                <div>
                    <label htmlFor="email" className="block text-primary font-semibold mb-2">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Enter your email" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-primary font-semibold mb-2">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Enter your password" />
                </div>
                {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                <button type="submit" onClick={(e)=>{handleSubmit(e)}} className="w-full bg-primary text-white flex items-center justify-center font-bold py-3 rounded-xl hover:shadow-lg transition-all" disabled={loading}>
                    {loading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
                </button>
            </form>
            <p className="text-gray-600 mt-6">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link></p>
        </div>
    )
}