import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import GradientButton from "../Components/ui/Button";
import supabaseService from "../Services/supaBaseServices";
import { Loader2 } from "lucide-react";


export default function Login() {

    const Navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const results = await supabaseService.signIn(email, password);
        if (results) {
            console.log("Login successful:", results);
            Navigate("/workspace"); // Redirect to the dashboard or home page after successful login
        } else {
            console.error("Login failed");
            setError("Invalid email or password. Please try again."); 
            // Show an error message to the user
        }
        setLoading(false);
    }


    return (
        <div className="section login py-10 min-h-screen flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-primary mb-8 text-center">Please enter your credentials to log in.</p>
            <form className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-4">
                <div>
                    <label htmlFor="email" className="block text-primary font-semibold mb-2">Email</label>
                    <input type="email" id="email" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password" className="block text-primary font-semibold mb-2">Password</label>
                    <input type="password" id="password" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                <GradientButton type="submit" className="w-full bg-primary text-white flex items-center justify-center font-bold py-3 rounded-xl hover:shadow-lg transition-all" onClick={handleLogin}>
                    {loading ? <Loader2 className="animate-spin" /> : "Login"}
                </GradientButton>
            </form>
            <p className="text-gray-600 mt-6">Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link></p>
        </div>
    )
}