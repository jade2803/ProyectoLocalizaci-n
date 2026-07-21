import Link from "next/link";

export default function Home() {
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
            Navegación Hospitalaria
          </h1>

          <p className="subtitle">
            Sistema de Realidad Aumentada
          </p>
        </div>

        <div className="buttons-container">
          <Link href="/ar/imagenes" className="menu-button">
            <span className="icon">🩻</span>
            <div>
              <h2>Área de Imágenes</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/consulta" className="menu-button">
            <span className="icon">👨‍⚕️</span>
            <div>
              <h2>Signos Vitales 1</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/laboratorio" className="menu-button">
            <span className="icon">🧪</span>
            <div>
              <h2>Laboratorio Clínico</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/signos" className="menu-button">
            <span className="icon">❤️</span>
            <div>
              <h2>Signos Vitales 2</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/nutricion" className="menu-button">
            <span className="icon">🥗</span>
            <div>
              <h2>Nutrición</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/papanicolaou" className="menu-button">
            <span className="icon">🧬</span>
            <div>
              <h2>Muestra Papanicolaou</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/citologia" className="menu-button">
            <span className="icon">🔬</span>
            <div>
              <h2>Citología</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/farmacia" className="menu-button">
            <span className="icon">💊</span>
            <div>
              <h2>Farmacia</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/cajas" className="menu-button">
            <span className="icon">💵</span>
            <div>
              <h2>Cajas</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/consulta18" className="menu-button">
            <span className="icon">🚪</span>
            <div>
              <h2>Consulta Externa 18–21</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/rehabilitacion" className="menu-button">
            <span className="icon">🦾</span>
            <div>
              <h2>Rehabilitación</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/psicologia" className="menu-button">
            <span className="icon">🧠</span>
            <div>
              <h2>Psicología</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/quimioterapia" className="menu-button">
            <span className="icon">💉</span>
            <div>
              <h2>Quimioterapia</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/emergencia" className="menu-button">
            <span className="icon">🚑</span>
            <div>
              <h2>Emergencia</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/procedimientos" className="menu-button">
            <span className="icon">🩺</span>
            <div>
              <h2>Procedimientos</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/uci" className="menu-button">
            <span className="icon">🏥</span>
            <div>
              <h2>UCI - Cuidados Intensivos</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/consulta9-16" className="menu-button">
            <span className="icon">🚪</span>
            <div>
              <h2>Consulta Externa 9 - 16</h2>
              <p>Iniciar navegación</p>
            </div>
          </Link>

          <Link href="/ar/derivaciones" className="menu-button">
            <span className="icon">📋</span>
            <div>
              <h2>Derivaciones</h2>
              <p>Iniciar navegación</p>
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