"use client";

import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

import { ArrowUp, ArrowRight, CheckCircle2, MapPin } from "lucide-react";

export default function PsicologiaPage() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const isPredicting = useRef(false);

    const lastPredictions = useRef<string[]>([]);

    const lastChange = useRef(0);

    const currentStep = useRef(1);

    const [location, setLocation] = useState("Buscando...");

    const [instruction, setInstruction] = useState("Apunte la cámara");

    const [direction, setDirection] = useState<
        "up" | "right" | "arrived" | "none"
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

                "/model/metadata.json",
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

                    predictions.sort((a: any, b: any) => b.probability - a.probability);

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
                        lastPredictions.current.every((x) => x === detected);

                    if (!stable) return;

                    const now = Date.now();

                    if (now - lastChange.current < 800) return;

                    // PASO 1

                    if (currentStep.current === 1 && detected === "PuertaPrincipal") {
                        lastChange.current = now;

                        currentStep.current = 2;

                        setCurrentStepUI(2);

                        setDirection("up");

                        setInstruction("Avance hacia Atención al Cliente");
                    }

                    // PASO 2
                    else if (
                        currentStep.current === 2 &&
                        detected === "AtencionCliente"
                    ) {
                        lastChange.current = now;

                        currentStep.current = 3;

                        setCurrentStepUI(3);

                        setDirection("up");

                        setInstruction("Continúe recto hacia el ascensor");
                    }

                    // PASO 3
                    else if (currentStep.current === 3 && detected === "Ascensor") {
                        lastChange.current = now;

                        currentStep.current = 4;

                        setCurrentStepUI(4);

                        setDirection("right");

                        setInstruction(
                            "Al pasar el ascensor gire a la derecha hacia Pasillo A",
                        );
                    }

                    // PASO 4
                    else if (currentStep.current === 4 && detected === "PasilloA") {
                        lastChange.current = now;

                        currentStep.current = 5;

                        setCurrentStepUI(5);

                        setDirection("up");

                        setInstruction("Continúe recto por el Pasillo A");
                    }

                    // PASO 5
                    else if (currentStep.current === 5 && detected === "PasilloB") {
                        lastChange.current = now;

                        currentStep.current = 6;

                        setCurrentStepUI(6);

                        setDirection("up");

                        setInstruction("Siga avanzando hacia Laboratorio Clínico");
                    }

                    // PASO 6
                    else if (
                        currentStep.current === 6 &&
                        detected === "LaboratorioClinico"
                    ) {
                        lastChange.current = now;

                        currentStep.current = 7;

                        setCurrentStepUI(7);

                        setDirection("up");

                        setInstruction("Continúe por el Pasillo C");
                    }

                    // PASO 7
                    else if (currentStep.current === 7 && detected === "PasilloC") {
                        lastChange.current = now;

                        currentStep.current = 8;

                        setCurrentStepUI(8);

                        setDirection("up");

                        setInstruction("Continúe recto. Psicología está cerca");
                    }

                    // FINAL
                    else if (currentStep.current === 8 && detected === "Psicologia") {
                        lastChange.current = now;

                        setDirection("arrived");

                        setInstruction("Ha llegado al área de Psicología");
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
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const renderArrow = () => {
        switch (direction) {
            case "up":
                return <ArrowUp size={50} strokeWidth={3} />;

            case "right":
                return <ArrowRight size={50} strokeWidth={3} />;

            case "arrived":
                return <CheckCircle2 size={50} strokeWidth={3} />;

            default:
                return null;
        }
    };

    return (
        <div className="ar-container">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
            />

            <div className="guide-assistant">
                <img
                    src="/guia-medica.png"
                    alt="Guía Virtual"
                    className="guide-image"
                />

                <div className="guide-bubble">{instruction}</div>
            </div>

            <div className="navigation-indicator">{renderArrow()}</div>

            <div className="route-container">
                <button
                    className="route-toggle"
                    onClick={() => setShowRoute(!showRoute)}
                >
                    🗺 Ruta ({currentStepUI}/8)
                </button>

                {showRoute && (
                    <div className="route-dropdown">
                        <h3>Ruta a Psicología</h3>

                        {[
                            "Puerta Principal",
                            "Atención al Cliente",
                            "Ascensor",
                            "Pasillo A",
                            "Pasillo B",
                            "Laboratorio Clínico",
                            "Pasillo C",
                            "Psicología",
                        ].map((item, index) => (
                            <div
                                key={item}
                                className={`route-step ${currentStepUI >= index + 1 ? "active" : ""
                                    }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="location-card">
                <MapPin size={20} />

                <span>{location}</span>
            </div>
        </div>
    );
}
