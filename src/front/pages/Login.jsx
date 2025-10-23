import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useGlobalReducer from '../hooks/useGlobalReducer';
import logoCompleto from "../assets/img/logo-completo.png";

const Login = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { dispatch } = useGlobalReducer();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate()

    const isFormValid = () => {  //Función que devuelve true solosolo si ambos campos tienen contenido
        return user.email.trim() !== '' && user.password.trim() !== '';
    };

    const handleChange = (event) => {
        const { value, name } = event.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleUserSubmit = (event) => {
        event.preventDefault()

        if (!isFormValid()) {
            setErrorMessage('Por favor completa todos los campos');
            // Borra el mensaje después de 3 segundos
            setTimeout(() => { setErrorMessage('') }, 2000);
            return;
        }

        setErrorMessage('');
        setLoading(true);

        fetch(`${backendUrl}api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al iniciar sesión');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    dispatch({ type: 'set_user', payload: data.user });
                    navigate('/');
                } else {
                    console.error('No se recibió token');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessage('Credenciales incorrectas o error de conexión');
                setTimeout(() => { setErrorMessage('') }, 2000);
            })
            .finally(() => setLoading(false));
    }

    return <>
        <main className="container form-signin m-auto" style={{ width: '40%' }}>
            <form onSubmit={handleUserSubmit}>
                <img
                    src={logoCompleto}
                    alt="Logo Gymio completo"
                    className="mb-4 mt-5 mx-auto d-block"
                    height="250"
                />
                <h1 className="mb-5 fw-bold text-center text-primary-emphasis">Iniciar Sesión</h1>
                <div className="form-floating">
                    <input onChange={handleChange} name='email' type="email" className="form-control mb-4" id="floatingInput" placeholder="name@example.com" />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input onChange={handleChange} name='password' type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                    <label htmlFor="floatingPassword">Password</label> </div>

                <div style={{ minHeight: '60px' }}>
                    {errorMessage && (
                        <div className="alert alert-danger text-center" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <button className="btn btn-warning w-100 py-2" type="submit"
                    disabled={loading}
                >
                    {loading && ( // función de Boostrap para spiner
                        <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}</button>
                <p className="mt-3 text-center">
                    ¿Aún no tienes cuenta? <Link to="/register" className="text-primary fw-semibold">Regístrate</Link>
                </p>

            </form>
        </main>
    </>
}

export default Login