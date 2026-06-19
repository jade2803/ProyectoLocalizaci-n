"use client";

import { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import {
    FaArrowUp,
    FaArrowRight,
    FaCheckCircle,
} from "react-icons/fa";

export default function ConsultaPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isPredicting = useRef(false);
    const lastPredictions = useRef<string[]>([]);

    const [location, setLocation] = useState("Buscando...");
    const [instruction, setInstruction] = useState(
        "Apunte la cámara a una referencia"
    );

    const [direction, setDirection] = useState<
        "up" | "right" | "arrived" | "none"
    >("none");

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
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
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

                    if (best.probability < 0.75) {
                        setLocation("Buscando...");
                        return;
                    }

                    const detected = best.className;
                    setLocation(detected);

                    lastPredictions.current.push(detected);

                    if (lastPredictions.current.length > 3) {
                        lastPredictions.current.shift();
                    }

                    const stable =
                        lastPredictions.current.length === 3 &&
                        lastPredictions.current.every(
                            (x) => x === detected
                        );

                    if (!stable) return;

                    switch (detected) {
                        case "PuertaPrincipal":
                            setDirection("up");
                            setInstruction(
                                "Avance hacia Atención al Cliente"
                            );
                            break;

                        case "AtencionCliente":
                            setDirection("right");
                            setInstruction(
                                "Gire a la derecha hacia el pasillo"
                            );
                            break;

                        case "Pasillo":
                            setDirection("up");
                            setInstruction(
                                "Continúe recto por el pasillo"
                            );
                            break;

                        case "ConsultaExterna":
                            setDirection("arrived");
                            setInstruction(
                                "Ha llegado a Consulta Externa"
                            );
                            break;
                    }
                } finally {
                    isPredicting.current = false;
                }
            }, 700);
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
                return <FaArrowUp size={120} />;
            case "right":
                return <FaArrowRight size={120} />;
            case "arrived":
                return <FaCheckCircle size={120} />;
            default:
                return null;
        }
    };

    return (
        <div className="relative w-screen h-screen bg-black">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
            />

            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 w-[90%]">
                <div className="bg-black/80 text-white p-4 rounded-2xl text-center text-xl font-bold shadow-xl">
                    {instruction}
                </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 z-20">
                {renderArrow()}
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
                <div className="backdrop-blur-md bg-black/50 text-white px-6 py-3 rounded-2xl font-semibold border border-white/20 shadow-xl">
                    📍 {location}
                </div>
            </div>
        </div>
    );
}