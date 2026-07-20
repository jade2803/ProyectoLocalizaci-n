"use client";

import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import {
    ArrowUp,
    ArrowLeft,
    CheckCircle2,
    MapPin,
} from "lucide-react";

export default function ImagenesPage() {

    const videoRef = useRef<HTMLVideoElement>(null);

    const isPredicting = useRef(false);

    const lastPredictions = useRef<string[]>([]);

    const lastChange = useRef(0);

    const currentStep = useRef(1);

    const [location, setLocation] = useState("Buscando...");

    const [instruction, setInstruction] = useState("Apunte la cámara");

    const [direction, setDirection] = useState<
        "up" | "left" | "arrived" | "none"
    >("none");

    const [showRoute, setShowRoute] = useState(false);

    const [currentStepUI, setCurrentStepUI] = useState(1);

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

                    const predictions = await model.predict(videoRef.current);

                    predictions.sort(
                        (a: any, b: any) =>
                            b.probability - a.probability
                    );

                    const best = predictions[0];

                    if (best.probability < 0.4) {

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

                    if (now - lastChange.current < 800) {

                        return;

                    }

                    if (
                        currentStep.current === 1 &&
                        detected === "PuertaPrincipal"
                    ) {

                        lastChange.current = now;

                        currentStep.current = 2;

                        setCurrentStepUI(2);

                        setDirection("up");

                        setInstruction(
                            "Avance hacia Atención al Cliente"
                        );

                    }

                    else if (
                        currentStep.current === 2 &&
                        detected === "AtencionCliente"
                    ) {

                        lastChange.current = now;

                        currentStep.current = 3;

                        setCurrentStepUI(3);

                        setDirection("up");

                        setInstruction(
                            "Continúe recto por el camino entre las gradas y el Ascensor"
                        );

                    }

                    else if (
                        currentStep.current === 3 &&
                        detected === "Ascensor"
                    ) {

                        lastChange.current = now;

                        currentStep.current = 4;

                        setCurrentStepUI(4);

                        setDirection("left");

                        setInstruction(
                            "Gire a la izquierda hacia Imágenes"
                        );

                    }

                    else if (
                        currentStep.current === 4 &&
                        detected === "Imagenes"
                    ) {

                        lastChange.current = now;

                        setDirection("arrived");

                        setInstruction(
                            "Ha llegado al área de Imágenes"
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

            case "left":
                return <ArrowLeft size={50} strokeWidth={3} />;

            case "arrived":
                return <CheckCircle2 size={50} strokeWidth={3} />;

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
                    🗺 Ruta ({currentStepUI}/4)
                </button>

                {showRoute && (

                    <div className="route-dropdown">

                        <h3>Ruta a Imágenes</h3>

                        <div
                            className={`route-step ${currentStepUI >= 1 ? "active" : ""}`}
                        >
                            Puerta Principal
                        </div>

                        <div
                            className={`route-step ${currentStepUI >= 2 ? "active" : ""}`}
                        >
                            Atención al Cliente
                        </div>

                        <div
                            className={`route-step ${currentStepUI >= 3 ? "active" : ""}`}
                        >
                            Ascensor
                        </div>

                        <div
                            className={`route-step ${currentStepUI >= 4 ? "active" : ""}`}
                        >
                            Área de Imágenes
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