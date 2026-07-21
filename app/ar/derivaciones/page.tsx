"use client";

import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import {
    ArrowUp,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    MapPin,
} from "lucide-react";

export default function DerivacionesPage() {

    const videoRef = useRef<HTMLVideoElement>(null);

    const isPredicting = useRef(false);

    const lastPredictions = useRef<string[]>([]);

    const lastChange = useRef(0);

    const currentStep = useRef(1);

    const [location, setLocation] = useState("Buscando...");

    const [instruction, setInstruction] = useState(
        "Apunte la cámara"
    );

    const [direction, setDirection] = useState<
        "up" | "right" | "left" | "arrived" | "none"
    >("none");

    const [showRoute, setShowRoute] = useState(false);

    const [currentStepUI, setCurrentStepUI] = useState(1);

    useEffect(() => {

        let interval: NodeJS.Timeout;
        let stream: MediaStream;
        let model: any;

        async function init() {

            model = await tmImage.load(
                "/model4/model.json",
                "/model4/metadata.json"
            );

            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment",
                    },
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

                    const predictions =
                        await model.predict(videoRef.current);

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

                    const now = Date.now();

                    if (now - lastChange.current < 1000) {

                        return;

                    }

                    // PASO 1
                    if (
                        currentStep.current === 1 &&
                        detected === "PuertaPrincipal"
                    ) {

                        lastChange.current = now;

                        currentStep.current = 2;

                        setCurrentStepUI(2);

                        setDirection("right");

                        setInstruction(
                            "Gire a la derecha hacia el pasillo ubicado junto a la Farmacia Económica."
                        );

                    }

                    // PASO 2
                    else if (
                        currentStep.current === 2 &&
                        detected === "FarmaciaEco"
                    ) {

                        lastChange.current = now;

                        currentStep.current = 3;

                        setCurrentStepUI(3);

                        setDirection("up");

                        setInstruction(
                            "Continúe recto por el pasillo del Bloque A."
                        );

                    }

                    // PASO 3
                    else if (
                        currentStep.current === 3 &&
                        detected === "PasilloAParteDelantera"
                    ) {

                        lastChange.current = now;

                        currentStep.current = 4;

                        setCurrentStepUI(4);

                        setDirection("left");

                        setInstruction(
                            "A su lado izquierdo encontrará las oficinas de Derivaciones."
                        );

                    }

                    // PASO 4
                    else if (
                        currentStep.current === 4 &&
                        detected === "Derivaciones"
                    ) {

                        lastChange.current = now;

                        currentStep.current = 5;

                        setCurrentStepUI(5);

                        setDirection("arrived");

                        setInstruction(
                            "Ha llegado a Derivaciones."
                        );

                    }

                }

                finally {

                    isPredicting.current = false;

                }

            }, 150);

        }

        init();

        return () => {

            if (interval) clearInterval(interval);

            if (stream) {

                stream.getTracks().forEach(track =>
                    track.stop()
                );

            }

        };

    }, []);

    const renderArrow = () => {

        switch (direction) {

            case "up":
                return <ArrowUp size={50} strokeWidth={3} />;

            case "right":
                return <ArrowRight size={50} strokeWidth={3} />;

            case "left":
                return <ArrowLeft size={50} strokeWidth={3} />;

            case "arrived":
                return (
                    <CheckCircle2
                        size={50}
                        strokeWidth={3}
                    />
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

            {/* Flecha de navegación */}
            <div className="navigation-indicator">
                {renderArrow()}
            </div>

            {/* Ruta */}
            <div className="route-container">

                <button
                    className="route-toggle"
                    onClick={() => setShowRoute(!showRoute)}
                >
                    🗺 Ruta ({currentStepUI}/5)
                </button>

                {showRoute && (

                    <div className="route-dropdown">

                        <h3>Ruta a Derivaciones</h3>

                        <div
                            className={`route-step ${currentStepUI >= 1 ? "active" : ""
                                }`}
                        >
                            Puerta Principal
                        </div>

                        <div
                            className={`route-step ${currentStepUI >= 2 ? "active" : ""
                                }`}
                        >
                            Farmacia Económica
                        </div>

                        <div
                            className={`route-step ${currentStepUI >= 3 ? "active" : ""
                                }`}
                        >
                            Pasillo Bloque A
                        </div>

                        <div
                            className={`route-step ${currentStepUI >= 4 ? "active" : ""
                                }`}
                        >
                            Derivaciones
                        </div>

                        <div
                            className={`route-step ${currentStepUI >= 5 ? "active" : ""
                                }`}
                        >
                            Destino alcanzado
                        </div>

                    </div>

                )}

            </div>

            {/* Ubicación actual */}
            <div className="location-card">

                <MapPin size={20} />

                <span>{location}</span>

            </div>

        </div>

    );

}