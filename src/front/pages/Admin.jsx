import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer";

const Admin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    fetch(`${backendUrl}api/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => {
        setErrorMessage('Error al cargar usuarios');
        setTimeout(() => setErrorMessage(''), 2000);
      })
      .finally(() => setLoading(false));
  }, []);


  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    fetch(`${backendUrl}api/user/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => setUsers(users.filter(u => u.id !== id)))
      .catch(() => {
        setErrorMessage('Error al eliminar usuario');
        setTimeout(() => setErrorMessage(''), 2000);
      });
  };

  const handleAssignRole = (userId, newRole) => {
    console.log("Enviando:", userId, newRole);
    console.log("Enviando a backend:", {
      url: `${backendUrl}api/user/${userId}/role`,
      token: localStorage.getItem('token'),
      body: { role: newRole }
    });
    fetch(`${backendUrl}api/user/${userId}/role`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: newRole })
    })
      .then(response =>
        response.json()
          .then(data => ({ ok: response.ok, data }))
      )
      .then(({ ok, data }) => {
        if (ok) {
          //recargar usuarios
          setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u
          ));

        } else {
          setErrorMessage(data.msg || "Error al asignar rol");
          setTimeout(() => setErrorMessage(""), 2000);
        }
      })
      .catch(() => {
        setErrorMessage("Error de conexión");
        setTimeout(() => setErrorMessage(""), 2000);
      });
  };

  return (
    <main className="container mt-5">
      <h1 className="mb-4 text-center fw-bold text-primary-emphasis">Panel de Administración</h1>

      {errorMessage && (
        <div className="alert alert-danger text-center" role="alert">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="azul-oscuro text-white">Nombre</th>
              <th className="azul-oscuro text-white">Email</th>
              <th className="azul-oscuro text-white">Rol</th>
              <th className="azul-oscuro text-white">Estado</th>
              <th className="azul-oscuro text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? 'Activo' : 'Inactivo'}</td>
                <td>
                  {/* boton para eliminar usuarios */}
                  {user.role !== "superadmin" && (store.user.role === "superadmin" || user.role !== "admin") &&
                    user.id !== store.user.id && (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </button>
                    )}

                  {/* boton para cambiar rol */}
                  {store.user.role === "superadmin" && user.role !== "superadmin" && (
                    <button
                      className="btn btn-outline-primary btn-sm" style={{ minWidth: '130px' }}
                      onClick={() => handleAssignRole(user.id, user.role === "admin" ? "user" : "admin")}
                    >
                      {user.role === "admin" ? "Asignar a Usuario" : "Asignar Admin"}
                    </button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default Admin;
