"use client";

import Link from "next/link";
import "./bienvenida.css";

export default function BienvenidaPage() {
    return (
        <main className="welcome-container">

            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>

            <div className="welcome-card">

                <img
                    src="/logo-solca.png"
                    alt="SOLCA"
                    className="welcome-logo"
                />

                <img
                    src="/guia-medica.png"
                    alt="Guía Virtual"
                    className="doctor"
                />

                <h1 className="typing">
                    Bienvenido a la Guía Inteligente de SOLCA
                </h1>

                <p className="fade">
                    Nuestro sistema de Realidad Aumentada le ayudará a
                    encontrar fácilmente consultorios, laboratorios,
                    farmacia y demás áreas del hospital de manera rápida,
                    sencilla y segura.
                </p>

                <Link href="/" className="start-button">
                    Comenzar recorrido →
                </Link>

            </div>

        </main>
    );
}