import { Link } from "react-router-dom";
import letrasGymio from "../assets/img/letras-gymio.png";
import logoGymio from "../assets/img/logo-gymio.png";
import { FaCircleUser } from "react-icons/fa6";

export const Navbar = () => {

	return (
		<nav className="navbar bg-white shadow-sm">
			<div className="container-fluid d-flex justify-content-between align-items-center">
				<Link className="navbar-brand d-flex align-items-center ms-5" to="/">
					<img src={logoGymio} alt="Logo Gymio" height="40" className="me-2" />
					<img src={letrasGymio} alt="Letras Gymio" height="25" />
				</Link>

				<div className="d-flex gap-3 me-5">
					<Link className="nav-link fw-semibold text-primary-emphasis" to="/">Home</Link>
					<Link className="nav-link fw-semibold text-primary-emphasis" to="/rutinas">Rutinas</Link>
					<Link className="nav-link fw-semibold text-primary-emphasis" to="/crear">Crear Rutina</Link>
					<Link className="nav-link fw-semibold text-primary-emphasis" to="/rutina/1">Detalle Rutina</Link>
					<Link className="nav-link fw-semibold text-primary-emphasis" to="/admin">Admin</Link>
					<Link className="nav-link fw-semibold text-primary-emphasis"><FaCircleUser className="me-1 ms-4 fs-4" />Cerrar Sesión</Link>
				</div>
			</div>
		</nav>
	);
};