import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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

  // Leer imágenes desde disco aquí, dentro de getServerSideProps
  const pngDir = path.join(process.cwd(), 'public', 'png');
  const allowedExtensions = ['.png', '.jpg', '.jpeg'];

  let files = [];
  try {
    files = fs.readdirSync(pngDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return allowedExtensions.includes(ext) && file !== 'subrayador.png';
    });
  } catch (error) {
    console.error('Error leyendo imágenes:', error);
  }

  return {
    props: {
      images: files,
    },
  };
}

export default function Collage({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  const handleDownload = (img) => {
    const link = document.createElement('a');
    link.href = `/png/${img}`;
    link.download = img;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => {
      const newIndex = prev === 0 ? images.length - 1 : prev - 1;
      setAnimationKey((k) => k + 1);
      return newIndex;
    });
  };

  const handleNext = () => {
    setSelectedIndex((prev) => {
      const newIndex = prev === images.length - 1 ? 0 : prev + 1;
      setAnimationKey((k) => k + 1);
      return newIndex;
    });
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <title>Our Collage</title>
      </Head>

      <div className="container">
        <h1>Our Collage</h1>

        <div className="masonry">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="item"
              onClick={() => {
                setSelectedIndex(idx);
                setAnimationKey((k) => k + 1);
              }}
            >
              <Image
                src={`/png/${img}`}
                alt={`Collage image ${idx}`}
                width={300}
                height={300}
                layout="responsive"
                objectFit="cover"
                style={{ borderRadius: '12px' }}
              />
            </div>
          ))}
        </div>

        <Link href="/" legacyBehavior>
          <a className="back-button">Volver al Home</a>
        </Link>
      </div>

      {selectedIndex !== null && (
        <div className="modal" onClick={() => setSelectedIndex(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="nav-button left" onClick={handlePrev}>
              ❮
            </button>
            <div key={animationKey} className="fade-in">
              <Image
                src={`/png/${images[selectedIndex]}`}
                alt="Selected"
                width={600}
                height={600}
                style={{ borderRadius: '12px', objectFit: 'contain', maxHeight: '80vh' }}
              />
            </div>
            <button className="nav-button right" onClick={handleNext}>
              ❯
            </button>
            <div className="modal-buttons">
              <button onClick={() => setSelectedIndex(null)}>Cerrar</button>
              <button onClick={() => handleDownload(images[selectedIndex])}>Descargar</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Estilos igual que los tuyos... */
        .container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
        }

        h1 {
          font-family: 'Pacifico', cursive;
          font-size: 3rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #ffffff;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .masonry {
          column-count: 3;
          column-gap: 1rem;
        }

        .item {
          margin-bottom: 1rem;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: inline-block;
          width: 100%;
        }

        .item:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          position: relative;
          background: #2b2b2b;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
          max-width: 90%;
          max-height: 90%;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        .fade-in {
          animation: fadeInScale 0.4s ease;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 50%;
          z-index: 2;
          transition: background 0.3s ease;
        }

        .nav-button:hover {
          background: rgba(0,0,0,0.8);
        }

        .left { left: -2rem; }
        .right { right: -2rem; }

        .modal-buttons {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .modal-buttons button {
          font-family: 'Poppins', sans-serif;
          background-color: #43d5b6;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .modal-buttons button:hover {
          background-color: #2fa490;
        }

        .back-button {
          display: inline-block;
          margin-top: 2rem;
          padding: 0.8rem 1.5rem;
          background-color: #ffffff;
          color: #43d5b6;
          text-decoration: none;
          font-weight: 600;
          border-radius: 8px;
          border: 2px solid #43d5b6;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .back-button:hover {
          background-color: #43d5b6;
          color: white;
          transform: scale(1.05);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 900px) {
          .masonry { column-count: 2; }
        }

        @media (max-width: 600px) {
          .masonry { column-count: 1; }
          .left { left: -1rem; }
          .right { right: -1rem; }
        }
      `}</style>

      <style global jsx>{`
        body {
          margin: 0;
          background: linear-gradient(135deg,rgb(121, 234, 209),rgb(99, 184, 240),rgb(253, 212, 90));
          min-height: 100vh;
        }
      `}</style>
    </>
  );
}
