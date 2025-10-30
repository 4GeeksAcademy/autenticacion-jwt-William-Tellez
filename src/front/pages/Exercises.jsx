import React, { useState } from "react";
import ExerciseImage from "../components/ExerciseImage";

const VerRutina = () => {
    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bodyPart, setBodyPart] = useState("");
    const [offset, setOffset] = useState(0);
    const limit = 6; // siempre 6 por página

    const fetchExercises = (reset = false, customOffset = null) => {
        if (!bodyPart) return setExercises([]);

        const currentOffset = customOffset !== null ? customOffset : offset;
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/exercises?bodyPart=${bodyPart}&offset=${currentOffset}&limit=${limit}`;

        setLoading(true);
        setError(null);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar ejercicios");
                return res.json();
            })
            .then(data => {
                setExercises(prev => reset ? data : [...prev, ...data]);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error al cargar ejercicios");
                setLoading(false);
            });
    };

    const handleFilter = () => {
        setOffset(0);          // reinicia la paginación
        fetchExercises(true, 0);  // reset = true reemplaza la lista
    };

    const handleMore = () => {
        const newOffset = offset + limit;
        console.log("Petición con offset:", newOffset);
        setOffset(newOffset);
        fetchExercises(false, newOffset);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Ejercicios</h2>

            <div className="mb-4">
                <select className="form-select mb-2" value={bodyPart} onChange={e => setBodyPart(e.target.value)}>
                    <option value="">Parte del cuerpo</option>
                    <option value="back">Espalda</option>
                    <option value="cardio">Cardio</option>
                    <option value="chest">Pecho</option>
                    <option value="lower arms">Antebrazos</option>
                    <option value="lower legs">Piernas (inferiores)</option>
                    <option value="neck">Cuello</option>
                    <option value="shoulders">Hombros</option>
                    <option value="upper arms">Brazos (superiores)</option>
                    <option value="upper legs">Piernas (superiores)</option>
                    <option value="waist">Cintura</option>
                </select>

                <button className="btn btn-primary mt-2" onClick={handleFilter}>
                    Filtrar ejercicios
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Buscando ejercicios...</p>
                </div>
            ) : (
                <>
                    <div className="row">
                        {exercises.map((ex, index) => (
                            <div className="col-md-4 mb-4" key={`${ex.id}-${index}`}>
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

                    {exercises.length > 0 && (
                        <div className="text-center mb-4">
                            <button className="btn btn-secondary" onClick={handleMore}>
                                Más ejercicios
                            </button>
                        </div>
                    )}

                </>
            )}
        </div>
    );
};

export default VerRutina;


