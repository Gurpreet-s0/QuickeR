import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const Sender = () => {
    const [file, setfile] = useState(null)
    const [qrImages, setQrImages] = useState([])
    const [currentQR, setCurrentQR] = useState(0);
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

        }, 100);

        return () => clearInterval(interval);

    }, [qrImages]);
    async function submitHandler(e) {
        e.preventDefault()
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const CHUNK_SIZE = 700;
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
        <div>
            <form onSubmit={(e) => {
                submitHandler(e)
            }} action="" id="form">
                <label htmlFor="imageUpload">Select an image:</label>
                <input
                    onChange={(e) => {
                        uploadHandler(e)
                    }}
                    type="file"
                    id="imageUpload"
                    name="image"
                    accept="image/*"
                    required
                />
                <button type="submit">Upload</button>
            </form>


            {qrImages.length > 0 && (
                <div>
                    <img
                        src={qrImages[currentQR].image}
                        width={350}
                    />

                    <h2>
                        {currentQR + 1} / {qrImages.length}
                    </h2>
                </div>
            )}
        </div>

    )
}

export default Sender