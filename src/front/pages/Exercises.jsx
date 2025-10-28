import React, { useEffect, useState } from "react";
import ExerciseImage from "../components/ExerciseImage";

const VerRutina = () => {
    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const bodyPart = "chest"; // puedes cambiar esto o hacerlo dinámico luego

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exercises?bodyPart=${bodyPart}`)
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta del servidor");
                return res.json();
            })
            .then(data => {
                setExercises(data.slice(0, 6)); // solo los primeros 6
                setLoading(false);

            })
            .catch(err => {
                console.error(err);
                setError("Error al cargar ejercicios");
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Ejercicios para {exercises[0]?.bodyPart || bodyPart}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* aplico spinner mientras carga */}
            {loading ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Buscando ejercicios...</p>
                </div>
            ) : (

                <div className="row">
                    {exercises.map((ex, i) => (
                        <div className="col-md-4 mb-4" key={i}>
                            <div className="card h-100">
                                <ExerciseImage exerciseId={ex.id} resolution="180" />

                                <div className="card-body">
                                    <h5 className="card-title">{ex.name}</h5>
                                    <p className="card-text">
                                        <strong>Grupo muscular:</strong> {ex.bodyPart}<br />
                                        <strong>Equipo:</strong> {ex.equipment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerRutina;

