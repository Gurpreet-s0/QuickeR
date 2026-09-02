import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Navbar from './Navbar'

const Sender = () => {
    const [file, setfile] = useState(null)
    const [qrImages, setQrImages] = useState([])
    const [currentQR, setCurrentQR] = useState(0);
    const [speed, setspeed] = useState(100)
    const [chunksize, setchunksize] = useState(700)
    function uploadHandler(e) {
        setfile(e.target.files[0])
    }
    function uint8ToBase64(uint8Array) {
        let binary = "";

        for (const byte of uint8Array) {
            binary += String.fromCharCode(byte);
        }

        return btoa(binary);
    }
    useEffect(() => {

        if (qrImages.length === 0) return;

        const interval = setInterval(() => {

            setCurrentQR(prev => {

                if (prev === qrImages.length - 1)
                    return 0;

                return prev + 1;

            });

        }, speed);

        return () => clearInterval(interval);

    }, [qrImages, speed]);
    async function submitHandler(e) {
        e.preventDefault()
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const CHUNK_SIZE = chunksize;
        const total = Math.ceil(bytes.length / CHUNK_SIZE);
        const qrChunks = [];
        for (let i = 0; i < total; i++) {

            const chunk = bytes.slice(
                i * CHUNK_SIZE,
                (i + 1) * CHUNK_SIZE
            );

            qrChunks.push({
                index: i,
                total,
                data: uint8ToBase64(chunk)
            });

        }

        const generatedQRs = [];

        for (const chunk of qrChunks) {

            const payload = {
                index: chunk.index,
                total: chunk.total,
                data: chunk.data
            };

            const qr = await QRCode.toDataURL(
                JSON.stringify(payload)
            );

            generatedQRs.push({
                image: qr,
                payload
            });

        }
        setQrImages(generatedQRs);

    }
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* QR Preview */}
                    <div className="order-1 lg:order-2 bg-zinc-900 rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col items-center justify-center shadow-2xl min-h-[400px] lg:min-h-[700px]">

                        {qrImages.length > 0 ? (
                            <>
                                <img
                                    src={qrImages[currentQR].image}
                                    alt="QR Code"
                                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl shadow-xl"
                                />

                                <h2 className="mt-6 text-xl sm:text-2xl lg:text-3xl font-bold">
                                    {currentQR + 1} / {qrImages.length}
                                </h2>

                                <progress
                                    value={currentQR + 1}
                                    max={qrImages.length}
                                    className="w-full h-3 mt-5 qr-progress"
                                />

                                <p className="mt-3 text-sm text-zinc-400 text-center">
                                    {currentQR + 1} / {qrImages.length} (
                                    {Math.round(((currentQR + 1) / qrImages.length) * 100)}%)
                                </p>

                                <p className="mt-3 text-sm text-zinc-400">
                                    {Math.round(
                                        ((currentQR + 1) / qrImages.length) * 100
                                    )}
                                    % Completed
                                </p>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="text-6xl sm:text-7xl lg:text-8xl">
                                    📤
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold mt-4">
                                    Ready to Transfer
                                </h2>

                                <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-sm mx-auto">
                                    Select an image, configure the transfer settings, and generate
                                    QR codes to start sending your file.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="order-2 lg:order-1 bg-zinc-900 rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl">

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                            QuickeR
                        </h1>

                        <p className="text-sm sm:text-base text-zinc-400 mt-2">
                            Offline QR File Transfer
                        </p>

                        <form
                            onSubmit={submitHandler}
                            className="mt-6 lg:mt-8 space-y-6"
                        >

                            {/* Upload */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
                                    Upload Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={uploadHandler}
                                    className="w-full rounded-xl bg-zinc-800 border border-zinc-700 file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:rounded-lg file:mr-4 p-2 text-sm"
                                />
                            </div>

                            {/* Chunk Size */}

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-medium">
                                        Chunk Size
                                    </label>

                                    <span className="text-zinc-400">
                                        {chunksize} bytes
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={20}
                                    max={1000}
                                    value={chunksize}
                                    onChange={(e) =>
                                        setchunksize(Number(e.target.value))
                                    }
                                    className="w-full accent-blue-500"
                                />
                            </div>

                            {/* Speed */}

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-medium">
                                        QR Speed
                                    </label>

                                    <span className="text-zinc-400">
                                        {speed} ms
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={50}
                                    max={2000}
                                    step={50}
                                    value={speed}
                                    onChange={(e) =>
                                        setspeed(Number(e.target.value))
                                    }
                                    className="w-full accent-blue-500"
                                />
                            </div>

                            {/* Generate Button */}

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition py-3 sm:py-4 text-base sm:text-lg font-semibold"
                            >
                                Generate QR Codes
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </>

    );
}

export default Sender