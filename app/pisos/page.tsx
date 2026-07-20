import Link from "next/link";

export default function Pisos() {
  return (
    <main className="home-container">

      <div className="background-circle circle-1"></div>
      <div className="background-circle circle-2"></div>
      <div className="background-circle circle-3"></div>

      <div className="home-card">

        <div className="logo-section">

          <img
            src="/logo-solca.png"
            alt="SOLCA"
            className="logo"
          />

          <h1 className="title">
            Seleccione el Piso
          </h1>

          <p className="subtitle">
            Elija el nivel del hospital al que desea dirigirse.
          </p>

        </div>

        <div className="buttons-container">

          {/* Planta Baja */}

          <Link href="/menu" className="menu-button piso-button">

            <span className="icon">🏥</span>

            <div className="piso-content">
              <h2>Planta Baja</h2>
              <p>Consultorios y servicios</p>
            </div>

          </Link>

          {/* Piso 1 */}

          <Link href="/piso1" className="menu-button piso-button">

            <span className="icon">🛏️</span>

            <div className="piso-content">
              <h2>Piso 1</h2>
              <p>Hospitalización - Oncología Clínica</p>
            </div>

          </Link>

          {/* Piso 2 */}

          <Link href="/piso2" className="menu-button piso-button">

            <span className="icon">🏨</span>

            <div className="piso-content">
              <h2>Piso 2</h2>
              <p>Hospitalización - Cirugía Oncológica</p>
            </div>

          </Link>

        </div>

        <footer className="footer-text">
          SOLCA • Sistema Inteligente de Orientación
        </footer>

      </div>

    </main>
  );
}