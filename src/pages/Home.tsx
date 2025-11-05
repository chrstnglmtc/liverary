import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api/auth";
import { setCurrentUser, getCurrentUser, logout as logoutUser } from "../api/authStore";
import Toast from "../components/Toast";

export default function Home() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const user = getCurrentUser() || JSON.parse(sessionStorage.getItem("authUser") || "null");
    if (user?.token) {
      navigate("/library");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;

      if (isLogin) {
        user = await login(email, password);
        setToast({ message: `Welcome back, ${user.display_name || user.email}!`, type: "success" });
      } else {
        user = await signup({ email, password, display_name: fullName });
        setToast({ message: `Account created! Welcome, ${user.display_name || user.email}`, type: "success" });
        setIsLogin(true);
      }

      setCurrentUser(user);
      sessionStorage.setItem("authUser", JSON.stringify(user));
      navigate("/library");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setToast({ message: err.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    sessionStorage.removeItem("authUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            {isLogin ? "Welcome" : "Create an Account"}
          </h2>
          <p className="text-center text-sm text-base-content/60">
            {isLogin ? "Login to continue to your library" : "Sign up to get started"}
          </p>

          {loading && (
            <div className="text-center my-2">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          )}

          {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input input-bordered w-full"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isLogin && (
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              )}
            </div>

            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm mt-3">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button type="button" className="link link-primary" onClick={() => setIsLogin(false)}>
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" className="link link-primary" onClick={() => setIsLogin(true)}>
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
