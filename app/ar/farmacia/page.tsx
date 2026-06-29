"use client";

import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import {
    ArrowUp,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    MapPin,
} from "lucide-react";

export default function FarmaciaPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isPredicting = useRef(false);
    const lastPredictions = useRef<string[]>([]);

    const [location, setLocation] = useState("Buscando...");
    const [instruction, setInstruction] = useState("Apunte la cámara");
    const [direction, setDirection] = useState<
        "up" | "left" | "right" | "arrived" | "none"
    >("none");

    const [showRoute, setShowRoute] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let stream: MediaStream;
        let model: any;

        async function init() {
            model = await tmImage.load(
                "/model/model.json",
                "/model/metadata.json"
            );

            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                };
            }

            interval = setInterval(async () => {
                if (!videoRef.current) return;
                if (isPredicting.current) return;

                isPredicting.current = true;

                try {
                    const predictions = await model.predict(videoRef.current);

                    predictions.sort(
                        (a: any, b: any) =>
                            b.probability - a.probability
                    );

                    const best = predictions[0];

                    if (best.probability < 0.6) {
                        setLocation("Buscando...");
                        return;
                    }

                    const detected = best.className;
                    setLocation(detected);

                    lastPredictions.current.push(detected);

                    if (lastPredictions.current.length > 2) {
                        lastPredictions.current.shift();
                    }

                    const stable =
                        lastPredictions.current.length === 2 &&
                        lastPredictions.current.every(
                            (x) => x === detected
                        );

                    if (!stable) return;

                    switch (detected) {
                        case "PuertaPrincipal":
                            setCurrentStep(1);
                            setDirection("up");
                            setInstruction(
                                "Avance hacia Atención al Cliente"
                            );
                            break;

                        case "AtencionCliente":
                            setCurrentStep(2);
                            setDirection("left");
                            setInstruction(
                                "Gire a la izquierda hacia Cajas"
                            );
                            break;

                        case "Cajas":
                            setCurrentStep(3);
                            setDirection("right");
                            setInstruction(
                                "Gire a la derecha y continúe por el pasillo"
                            );
                            break;

                        case "Farmacia":
                            setCurrentStep(4);
                            setDirection("arrived");
                            setInstruction(
                                "Ha llegado al área de Farmacia"
                            );
                            break;
                    }
                } finally {
                    isPredicting.current = false;
                }
            }, 150);
        }

        init();

        return () => {
            if (interval) clearInterval(interval);

            if (stream) {
                stream.getTracks().forEach((track) =>
                    track.stop()
                );
            }
        };
    }, []);

    const renderArrow = () => {
        switch (direction) {
            case "up":
                return <ArrowUp size={50} strokeWidth={3} />;

            case "left":
                return <ArrowLeft size={50} strokeWidth={3} />;

            case "right":
                return <ArrowRight size={50} strokeWidth={3} />;

            case "arrived":
                return (
                    <CheckCircle2 size={50} strokeWidth={3} />
                );

            default:
                return null;
        }
    };

    return (
        <div className="ar-container">
            {/* Cámara */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
            />

            {/* Guía virtual */}
            <div className="guide-assistant">
                <img
                    src="/guia-medica.png"
                    alt="Guía Virtual"
                    className="guide-image"
                />

                <div className="guide-bubble">
                    {instruction}
                </div>
            </div>

            {/* Flecha */}
            <div className="navigation-indicator">
                {renderArrow()}
            </div>

            {/* Ruta */}
            <div className="route-container">
                <button
                    className="route-toggle"
                    onClick={() =>
                        setShowRoute(!showRoute)
                    }
                >
                    🗺 Ruta ({currentStep}/4)
                </button>

                {showRoute && (
                    <div className="route-dropdown">
                        <h3>Ruta a Farmacia</h3>

                        <div
                            className={`route-step ${
                                currentStep >= 1
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Puerta Principal
                        </div>

                        <div
                            className={`route-step ${
                                currentStep >= 2
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Atención al Cliente
                        </div>

                        <div
                            className={`route-step ${
                                currentStep >= 3
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Cajas
                        </div>

                        <div
                            className={`route-step ${
                                currentStep >= 4
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Farmacia
                        </div>
                    </div>
                )}
            </div>

            {/* Ubicación */}
            <div className="location-card">
                <MapPin size={20} />
                <span>{location}</span>
            </div>
        </div>
    );
}