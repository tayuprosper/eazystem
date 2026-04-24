import {useState} from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="section login py-10 h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <p className="text-primary mb-6">Please enter your credentials to log in.</p>
            <form className="max-w-xl mx-auto p-6 rounded-lg shadow-md w-1/2 h-1/2 flex flex-col justify-center">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-primary font-semibold mb-2">Email</label>
                    <input type="email" id="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-primary font-semibold mb-2">Password</label>
                    <input type="password" id="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {/* add error message in the center */}
                {error && <p className="text-red-500 text-center m-2">{error}</p>}
                <GradientButton type="submit" className="w-full bg-primary text-white  flex items-center justify-center font-semibold py-2 rounded-lg hover:bg-primary-dark transition duration-300" onClick={handleLogin}>
                    {/* add loading icon animated in the center of the button    */}
                    {loading ? <Loader2 className="animate-spin " /> : "Login"}
                </GradientButton>
            </form>
            {/* sign up link */}
            <p className="text-gray-600 mt-4">Don't have an account? <a href="/signup" className="text-primary font-semibold hover:underline">Sign up</a></p>
        </div>
    )
}