"use client";

import Link from "next/link";
import "./welcome.css";

export default function Home() {
    return (
        <main className="welcome-container">

            {/* Círculos de fondo */}
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>

            <div className="welcome-card">

                <img
                    src="/logo-solca.png"
                    alt="SOLCA"
                    className="welcome-logo"
                />

                <img
                    src="/guia-medica.png"
                    alt="Guía Virtual"
                    className="doctor-image"
                />

                <div className="speech-bubble">
                    ¡Hola! 👋 Bienvenido a SOLCA
                </div>

                <h1 className="typing-title">
                    Guía Inteligente de<br />
                    Navegación Hospitalaria
                </h1>

                <p className="description">
                    Mediante Realidad Aumentada podrá localizar fácilmente
                    consultorios, laboratorios, farmacia, imágenes y demás
                    servicios del hospital.
                </p>

                <Link href="/menu" className="start-button">
                    Comenzar recorrido →
                </Link>

            </div>

        </main>
    );
}