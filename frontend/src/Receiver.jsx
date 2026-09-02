import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

export default function Receiver() {
    const videoRef = useRef(null);

    // Stores all received chunks
    const receivedChunks = useRef(new Map());

    const [received, setReceived] = useState(0);
    const [total, setTotal] = useState(0);
    const [imageURL, setImageURL] = useState("");

    function base64ToUint8(base64) {
        const binary = atob(base64);

        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return bytes;
    }

    function reconstructImage(totalChunks) {

        const arrays = [];

        for (let i = 0; i < totalChunks; i++) {
            arrays.push(
                base64ToUint8(receivedChunks.current.get(i).data)
            );
        }
        let totalLength = 0;

        for (const arr of arrays) {
            totalLength += arr.length;
        }

        const merged = new Uint8Array(totalLength);

        let offset = 0;

        for (const arr of arrays) {
            merged.set(arr, offset);
            offset += arr.length;
        }
        const blob = new Blob([merged], {
            type: "image/png"
        });
        const url = URL.createObjectURL(blob);

        setImageURL(url);
    }

    function downloadImage() {
        if (!imageURL) return;

        const link = document.createElement("a");
        link.href = imageURL;
        link.download = `QuickeR-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        const scanner = new QrScanner(
            videoRef.current,
            (result) => {
                const payload = JSON.parse(result.data);

                // Ignore duplicate chunks
                if (receivedChunks.current.has(payload.index)) return;

                // Store chunk
                receivedChunks.current.set(payload.index, payload);

                setReceived(receivedChunks.current.size);
                setTotal(payload.total);

                console.log(
                    `${receivedChunks.current.size}/${payload.total}`, receivedChunks.current
                );

                // All chunks received
                if (
                    receivedChunks.current.size === payload.total
                ) {
                    scanner.stop();

                    reconstructImage(payload.total);
                }
            },
            {
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );

        scanner.start();

        return () => {
            scanner.destroy();
        };
    }, []);



    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center p-8">

                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">

                    {/* Scanner Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    QR Receiver
                                </h1>
                                <p className="text-gray-400 mt-1">
                                    Scan QR frames to reconstruct the image
                                </p>
                            </div>

                            <div
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${imageURL
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-blue-500/20 text-blue-400"
                                    }`}
                            >
                                {imageURL ? "Completed" : "Scanning"}
                            </div>
                        </div>

                        {/* Camera */}

                        <div className="relative overflow-hidden rounded-2xl border border-white/10">

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-[430px] object-cover bg-black"
                            />

                            {!imageURL && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="w-64 h-64 border-4 border-cyan-400 rounded-xl animate-pulse"></div>
                                </div>
                            )}
                        </div>

                        {/* Progress */}

                        <div className="mt-6">

                            <div className="flex justify-between mb-2 text-sm text-gray-400">
                                <span>Receiving Chunks</span>
                                <span>
                                    {received}/{total || "--"}
                                </span>
                            </div>

                            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                                    style={{
                                        width: total
                                            ? `${(received / total) * 100}%`
                                            : "0%",
                                    }}
                                />
                            </div>

                            <p className="text-center text-gray-500 mt-4">
                                {total
                                    ? `${Math.round(
                                        (received / total) * 100
                                    )}% Completed`
                                    : "Waiting for first QR..."}
                            </p>
                        </div>
                    </div>

                    {/* Preview Card */}

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

                        <h2 className="text-3xl font-bold text-white mb-2">
                            Reconstructed Image
                        </h2>

                        <p className="text-gray-400 mb-6">
                            Your received image will appear here.
                        </p>

                        {imageURL ? (
                            <div className="rounded-2xl overflow-hidden border border-green-400/30 bg-black">

                                <img
                                    src={imageURL}
                                    alt="Recovered"
                                    className="w-full object-contain max-h-[520px]"
                                />

                                <button
                                    onClick={downloadImage}
                                    className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    ⬇️ Download Image
                                </button>

                            </div>
                        ) : (
                            <div className="h-[520px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center">

                                <div className="text-7xl mb-6">🖼️</div>

                                <h3 className="text-2xl text-white font-semibold">
                                    Waiting for Image
                                </h3>

                                <p className="text-gray-500 mt-2 text-center max-w-xs">
                                    Once every QR chunk has been scanned, the complete image
                                    will automatically appear here.
                                </p>

                            </div>
                        )}

                    </div>

                </div>
            </div>
        </>
    );
}