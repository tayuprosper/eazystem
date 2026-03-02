import GradientButton from "../Components/ui/Button";

export default function Login() {
    return (
        <div className="section login py-10 h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <p className="text-primary mb-6">Please enter your credentials to log in.</p>
            <form className="max-w-xl mx-auto p-6 rounded-lg shadow-md w-1/2 h-1/2 flex flex-col justify-center">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-primary font-semibold mb-2">Email</label>
                    <input type="email" id="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary" placeholder="Enter your email" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-primary font-semibold mb-2">Password</label>
                    <input type="password" id="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary" placeholder="Enter your password" />
                </div>

                <GradientButton type="submit" className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition duration-300">Login</GradientButton>
            </form>
            {/* sign up link */}
            <p className="text-gray-600 mt-4">Don't have an account? <a href="/signup" className="text-primary font-semibold hover:underline">Sign up</a></p>
        </div>
    )
}