// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const VALID_USER = 'irene';
const VALID_PASS = 'esGuapa';

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (user === VALID_USER && pass === VALID_PASS) {
        // Usa SameSite=Lax para evitar problemas de cookies en redirecciones
        // Cambia "logged" por "token" para coincidir con dashboard.js
        document.cookie = "token=true; path=/; max-age=86400; SameSite=Lax";
        router.push('/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '5rem auto',
      textAlign: 'center',
      color: '#333',
      background: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
      borderRadius: '15px',
      boxShadow: '5px 5px 15px #bebebe, -5px -5px 15px #ffffff',
      padding: '2rem',
      transition: 'all 0.3s ease'
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: '#4A90E2',
        transition: 'color 0.3s ease'
      }}>
        Pon el Usuario y Contraseña que tú conoces
      </h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={e => setUser(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            transition: 'box-shadow 0.3s ease',
            boxShadow: 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff'
          }}
          onFocus={(e) => e.target.style.boxShadow = '0 0 5px #4A90E2'}
          onBlur={(e) => e.target.style.boxShadow = 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff'}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            outline: 'none',
            transition: 'box-shadow 0.3s ease',
            boxShadow: 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff'
          }}
          onFocus={(e) => e.target.style.boxShadow = '0 0 5px #4A90E2'}
          onBlur={(e) => e.target.style.boxShadow = 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff'}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: '#4A90E2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '2px 2px 5px #bebebe, -2px -2px 5px #ffffff',
            transition: 'background 0.3s ease, transform 0.2s ease'
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.97)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, resolvedUrl } = context;
  const cookies = req.headers.cookie || '';

  // Busca cookie "token" para coherencia con dashboard.js
  const loggedCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
  const isLogged = loggedCookie?.split('=')[1] === 'true';

  // Evitar redirección infinita revisando que la ruta destino sea distinta de la actual
  if (isLogged && (resolvedUrl === '/' || resolvedUrl === '/login')) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  if (!isLogged && (resolvedUrl === '/dashboard' || resolvedUrl === '/collage')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

