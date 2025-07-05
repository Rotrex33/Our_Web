import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookies from 'js-cookie';

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/pdf/pdf.zip';
  link.download = 'pdf.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Sidebar({ scrollToTop }) {
  const router = useRouter();

  const logout = async () => {
    Cookies.remove('token');  // <-- cambiamos 'logged' por 'token'
    // Espera un momento para asegurarte de que la cookie está borrada
    await new Promise(resolve => setTimeout(resolve, 50));
    router.replace('/');  // vuelve a la página principal
    // Forzamos recarga para que SSR detecte que no está logueado
    window.location.reload();
  };

  return (
    <>
      <aside className="sidebar">
        <button onClick={scrollToTop} className="btn btn-main">Home</button>
        <button onClick={handleDownload} className="btn btn-main">Descargar archivos</button>
        <Link href="/collage" legacyBehavior>
          <a className="btn btn-main link-btn">Collage</a>
        </Link>
        <button onClick={logout} className="btn btn-logout">Salir</button>
      </aside>

      <style jsx>{`
        .sidebar {
          width: 400px;
          background-color: rgb(255, 170, 52);
          color: white;
          display: flex;
          flex-direction: column;
          padding: 0.5rem;
          box-sizing: border-box;
          height: 100vh;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
        }

        .btn {
          width: 100%;
          box-sizing: border-box;
          border: none;
          color: #ffffff;
          text-align: left;
          padding: 1rem 1rem;
          font-size: 1.1rem;
          cursor: pointer;
          margin-bottom: 0.5rem;
          border-radius: 12px;
          transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          background-color: rgb(255, 200, 97);
        }

        .btn-main:hover {
          background-color: rgba(139, 220, 207, 0.85);
          color: #000000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .link-btn {
          display: block;
          text-decoration: none;
        }

        .btn-logout {
          margin-top: auto;
          margin-left: auto;
          margin-right: auto;
          background-color: #e93845;
          box-shadow: 0 2px 6px rgba(233, 56, 69, 0.6);
          font-weight: 600;
        }

        .btn-logout:hover {
          background-color: #c22b35;
          box-shadow: 0 4px 12px rgba(194, 43, 53, 0.9);
          color: white;
        }
      `}</style>
    </>
  );
}
