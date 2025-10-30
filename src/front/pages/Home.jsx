import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import fondo from "../assets/img/fondo.png";

const Home = () => {
  const { store: { user } } = useGlobalReducer();

  return (
    <div
      className="d-flex align-items-center justify-content-center text-center text-white"
      style={{
        minHeight: "60vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="bg-dark bg-opacity-75 p-5 rounded-4">
        <h1 className="fw-bold mb-3">
          ¡Bienvenido a Gymio{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="fs-5 text-light">
          Cada inicio de sesión es una nueva oportunidad para mejorar, aprender y seguir creciendo.
        </p>
      </div>
    </div>
  );
};

export default Home;
