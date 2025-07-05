// pages/dashboard.js
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Head from 'next/head';

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

function TiempoJuntos() {
  const startDate = new Date('2022-07-06T00:00:00');
  const [timeDiff, setTimeDiff] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateDiff() {
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setTimeDiff({ years, months, days, hours, minutes, seconds });
    }

    calculateDiff();
    const interval = setInterval(calculateDiff, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: '"DynaPuff", system-ui',
        color: '#333',
        fontSize: '1.5rem',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <p>
        <strong>{timeDiff.years}</strong> año{timeDiff.years !== 1 ? 's' : ''},{' '}
        <strong>{timeDiff.months}</strong> mes{timeDiff.months !== 1 ? 'es' : ''},{' '}
        <strong>{timeDiff.days}</strong> día{timeDiff.days !== 1 ? 's' : ''}<br />
        <strong>{String(timeDiff.hours).padStart(2, '0')}</strong>:
        <strong>{String(timeDiff.minutes).padStart(2, '0')}</strong>:
        <strong>{String(timeDiff.seconds).padStart(2, '0')}</strong>
      </p>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [carta, setCarta] = useState('');
  const [pdfs, setPdfs] = useState('');
  const [despedida, setDespedida] = useState('');
  const titleRef = useRef();

  // Modal states
  const [modalCartaOpen, setModalCartaOpen] = useState(false);
  const [modalTiempoOpen, setModalTiempoOpen] = useState(false);

  // Proteger ruta
  useEffect(() => {
    const hasToken = document.cookie.includes('token=true');
    if (!hasToken) {
      router.replace('/');
    } else {
      setLogged(true);
    }
  }, [router]);

  // Cargar textos
  useEffect(() => {
    if (!logged) return;

    async function fetchTexts() {
      const urls = {
        descripcion: '/txt/descripcion.txt',
        carta: '/txt/carta.txt',
        pdfs: '/txt/pdfs.txt',
        despedida: '/txt/despedida.txt',
      };
      const [descRes, cartaRes, pdfsRes, despRes] = await Promise.all([
        fetch(urls.descripcion),
        fetch(urls.carta),
        fetch(urls.pdfs),
        fetch(urls.despedida),
      ]);

      setDescripcion(await descRes.text());
      setCarta(await cartaRes.text());
      setPdfs(await pdfsRes.text());
      setDespedida(await despRes.text());
    }

    fetchTexts();
  }, [logged]);

  const scrollToTop = () => {
    titleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!logged) return <p>Cargando...</p>;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Loved+by+the+King&family=DynaPuff&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Fondo con sombra si modal abierto */}
      <div
        style={{
          filter: modalCartaOpen || modalTiempoOpen ? 'blur(3px) brightness(0.7)' : 'none',
          pointerEvents: modalCartaOpen || modalTiempoOpen ? 'none' : 'auto',
          transition: 'filter 0.3s ease',
          height: '100vh',
          display: 'flex',
          background: 'linear-gradient(135deg, #ffe6eb, #e0f7fa)',
        }}
      >
        <Sidebar scrollToTop={scrollToTop} />
        <main
          style={{
            flexGrow: 1,
            padding: '2rem',
            overflowY: 'auto',
            color: '#333',
            fontFamily: '"DynaPuff", system-ui',
            animation: 'fadeIn 1s ease-out',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: '2rem',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src="/png/subrayador.png"
                alt="subrayador"
                style={{
                  position: 'absolute',
                  bottom: '-50%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '200%',
                  opacity: 0.6,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
              <h1
                ref={titleRef}
                style={{
                  fontFamily: "'Loved by the King', cursive",
                  fontSize: '7rem',
                  color: '#f48fb1',
                  margin: 0,
                  position: 'relative',
                  textAlign: 'center',
                  animation: 'slideDown 1s ease-out',
                }}
              >
                Our Web
              </h1>
            </div>
          </div>

          <p
            style={{
              fontSize: '1.3rem',
              margin: '4rem 0 1rem',
              whiteSpace: 'pre-line',
              animation: 'fadeInUp 1.2s ease-out',
            }}
          >
            {descripcion}
          </p>

          <Section title="Carta">
            <p style={{ whiteSpace: 'pre-line', animation: 'fadeInUp 1.2s ease-out' }}>{carta}</p>
          </Section>

          <Section title="Pdfs">
            {(() => {
              const lines = pdfs.split('\n').map((line) => line.trim()).filter(Boolean);
              const pdfLines = lines.filter((line) => line.toLowerCase().endsWith('.pdf'));
              const textLines = [];
              for (const line of lines) {
                if (!line.toLowerCase().endsWith('.pdf')) {
                  textLines.push(line);
                } else {
                  break;
                }
              }

              return (
                <>
                  <p style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>{textLines.join('\n')}</p>
                  <ul style={{ marginTop: 0, paddingLeft: '1.2rem' }}>
                    {pdfLines.map((pdf, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>
                        <a
                          href={`/pdf/${pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#ec407a',
                            textDecoration: 'none',
                            transition: 'color 0.3s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.color = '#f27f18')}
                          onMouseOut={(e) => (e.currentTarget.style.color = '#ec407a')}
                        >
                          📄 {pdf}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              );
            })()}
          </Section>

          <Section title="Despedida">
            <p style={{ whiteSpace: 'pre-line', animation: 'fadeInUp 1.2s ease-out' }}>{despedida}</p>
          </Section>

          {/* Botón flotante para abrir modal Carta */}
          <button
            onClick={() => setModalCartaOpen(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              backgroundColor: '#f48fb1',
              color: 'white',
              border: 'none',
              borderRadius: '1.5rem',
              width: '7.5rem',
              height: '3.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              userSelect: 'none',
              transition: 'background-color 0.3s',
              zIndex: 1000,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f27f18')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f48fb1')}
          >
            Carta
          </button>

          {/* Botón para abrir modal Tiempo juntos */}
          <button
            onClick={() => setModalTiempoOpen(true)}
            style={{
              position: 'fixed',
              bottom: '7rem',
              right: '2rem',
              backgroundColor: '#ec407a',
              color: 'white',
              border: 'none',
              borderRadius: '1.5rem',
              width: '7.5rem',
              height: '3.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              userSelect: 'none',
              transition: 'background-color 0.3s',
              zIndex: 1000,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9c27b0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ec407a')}
          >
            Tiempo
          </button>
        </main>
      </div>

      {/* Modales */}
      {modalCartaOpen && (
        <Modal onClose={() => setModalCartaOpen(false)} title="Carta de amor">
          <p style={{ whiteSpace: 'pre-line' }}>{carta}</p>
        </Modal>
      )}
      {modalTiempoOpen && (
        <Modal onClose={() => setModalTiempoOpen(false)} title="Tiempo juntos">
          <TiempoJuntos />
        </Modal>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-3rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section
      style={{
        marginTop: '4rem',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
        animation: 'fadeInUp 1s ease-out',
      }}
    >
      <h2
        style={{
          fontFamily: "'Loved by the King', cursive",
          fontSize: '2.8rem',
          marginBottom: '1rem',
          color: '#f27f18',
          userSelect: 'none',
          textAlign: 'center',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Modal({ children, title, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
          cursor: 'pointer',
        }}
        aria-label="Cerrar modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '2rem 2.5rem',
          borderRadius: '1rem',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
          zIndex: 10000,
          fontFamily: '"DynaPuff", system-ui',
          color: '#333',
        }}
      >
        <h3
          id="modal-title"
          style={{
            fontFamily: "'Loved by the King', cursive",
            fontSize: '3rem',
            marginBottom: '1rem',
            color: '#f27f18',
            userSelect: 'none',
            textAlign: 'center',
          }}
        >
          {title}
        </h3>
        <div>{children}</div>
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          style={{
            marginTop: '2rem',
            backgroundColor: '#f48fb1',
            border: 'none',
            borderRadius: '1rem',
            color: 'white',
            padding: '0.7rem 1.8rem',
            cursor: 'pointer',
            display: 'block',
            marginLeft: 'auto',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f27f18')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f48fb1')}
        >
          Cerrar
        </button>
      </div>
    </>
  );
}
