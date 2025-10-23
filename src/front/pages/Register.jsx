import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoCompleto from "../assets/img/logo-completo.png";

const Register = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const isFormValid = () => {
    return user.email.trim() !== '' && user.password.trim() !== '' && user.name.trim() !== '';
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleUserSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('Por favor completa todos los campos');
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }

    setErrorMessage('');
    setLoading(true);

    fetch(`${backendUrl}api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al registrar usuario');
        }
        return response.json();
      })
      .then(data => {
        alert('Usuario creado exitosamente');
        navigate('/login');
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('Error al registrar usuario');
        setTimeout(() => setErrorMessage(''), 2000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="container form-signin m-auto" style={{ width: '40%' }}>
      <form onSubmit={handleUserSubmit}>
        <img
          src={logoCompleto}
          alt="Logo Gymio completo"
          className="mb-4 mt-5 mx-auto d-block"
          height="250"
        />
        <h1 className="mb-5 fw-bold text-center text-primary-emphasis">Registrarse</h1>

        <div className="form-floating">
          <input onChange={handleChange} name='email' type="email" className="form-control mb-4" id="floatingEmail" placeholder="name@example.com" />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className="form-floating">
          <input onChange={handleChange} name='name' type="text" className="form-control mb-4" id="floatingName" placeholder="Juan Pérez" />
          <label htmlFor="floatingName">Full name</label>
        </div>

        <div className="form-floating">
          <input onChange={handleChange} name='password' type="password" className="form-control" id="floatingPassword" placeholder="Password" />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div style={{ minHeight: '60px' }}>
          {errorMessage && (
            <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          )}
        </div>

        <button className="btn btn-warning w-100 py-2" type="submit" disabled={loading}>
          {loading && (
            <div className="spinner-border spinner-border-sm text-light me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>

        <p className="mt-3 text-center">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary fw-semibold">Inicia Sesión</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;