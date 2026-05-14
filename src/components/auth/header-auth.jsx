import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const base = process.env.PUBLIC_URL || "";

const linkBase =
    "whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-primary/10 hover:text-primary";

export default function HeaderAuth() {
    const { user, logout, bootstrapped } = useAuth();
    if (!bootstrapped) return null;

    if (user) {
        return (
            <div className="hidden flex-wrap items-center justify-end gap-2 lg:flex">
                <span className="hidden max-w-[200px] truncate text-xs text-slate-500 xl:inline">
                    {user.email}
                </span>
                <button
                    type="button"
                    className={linkBase}
                    onClick={() => logout()}
                >
                    Log out
                </button>
            </div>
        );
    }

    return (
        <div className="hidden flex-wrap items-center justify-end gap-2 lg:flex">
            <Link className={linkBase} to={`${base}/login`}>
                Log in
            </Link>
            <Link className={linkBase} to={`${base}/signup`}>
                Sign up
            </Link>
        </div>
    );
}
