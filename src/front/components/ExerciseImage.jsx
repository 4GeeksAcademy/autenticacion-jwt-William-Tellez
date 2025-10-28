import React, { useState } from "react";

const ExerciseImage = ({ exerciseId, resolution = "180" }) => {
  const [imgError, setImgError] = useState(false);

  // 🔹 Aquí defines imageUrl usando tu backend como proxy
  const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/api/exercise/image/${exerciseId}?resolution=${resolution}`;

  return !imgError ? (
    <img
      src={imageUrl}
      alt="Exercise animation"
      style={{ width: "100%", height: "auto", borderRadius: "8px 8px 0 0" }}
      onError={() => setImgError(true)}
    />
  ) : (
    <p style={{ color: "gray", textAlign: "center" }}>GIF no disponible</p>
  );
};

export default ExerciseImage;
