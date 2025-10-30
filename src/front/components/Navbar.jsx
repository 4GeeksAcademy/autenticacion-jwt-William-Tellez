import { Link } from "react-router-dom";
import letrasGymio from "../assets/img/letras-gymio.png";
import logoGymio from "../assets/img/logo-gymio.png";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { dispatch, store } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: "logout" });        // Limpio el estado global
		localStorage.clear();                // Limpio el token
		navigate("/login");
	};

	return (
		<nav className="navbar bg-white shadow-sm">
			<div className="container-fluid d-flex justify-content-between align-items-center">
				<Link className="navbar-brand d-flex align-items-center ms-5" to="/">
					<img src={logoGymio} alt="Logo Gymio" height="40" className="me-2" />
					<img src={letrasGymio} alt="Letras Gymio" height="25" />
				</Link>

				<div className="d-flex gap-3 me-5">
					<Link className="nav-link fw-semibold text-primary-emphasis" to="/">Home</Link>
					<Link className="nav-link fw-semibold text-primary-emphasis" to="/exercises">Ejercicios</Link>
					{(store.user?.role === "admin" || store.user?.role === "superadmin") && (
						<Link className="nav-link fw-semibold text-primary-emphasis" to="/admin">Admin</Link>
					)}

					<button
						className="nav-link fw-semibold text-primary-emphasis bg-transparent border-0"
						onClick={handleLogout}
					>
						<FaCircleUser className="me-1 ms-4 fs-4" />
						Cerrar Sesión
					</button>

				</div>
			</div>
		</nav>
	);
};