import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [user, setUser] = useState({
        email: '',
        password: '',
        name: ''
    })

    const navigate = useNavigate()

    const handleChange = (event) => {
        const { value, name } = event.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleUserSubmit = (event) => {
        event.preventDefault()
        fetch(`${backendUrl}api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (response.status === 200) {
                    alert('Usuario creado exitosamente')
                    navigate('/')
                }
                return response.json()
            })
            .then(data => alert(data))
            .catch(error => console.log(error))
    }

    return <>
        <main className="container form-signin w-100 m-auto">
            <form onSubmit={handleUserSubmit}>
                <img className="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">Please add your register info</h1>
                <div className="form-floating">
                    <input onChange={handleChange} name='email' type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input onChange={handleChange} name='name' type="text" className="form-control" id="floatingInput" placeholder="Pedrito Perez" />
                    <label htmlFor="floatingInput">Full name</label>
                </div>
                <div className="form-floating">
                    <input onChange={handleChange} name='password' type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                    <label htmlFor="floatingPassword">Password</label> </div> <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
                    <label className="form-check-label" htmlFor="checkDefault">
                        Remember me
                    </label>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                <p className="mt-5 mb-3 text-body-secondary">© 2017–2025</p>
            </form>
        </main>
    </>
}

export default Register