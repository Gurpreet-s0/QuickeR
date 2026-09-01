import React, { useState } from 'react'
import QRCode from 'qrcode'

const Sender = () => {
    const [file, setfile] = useState(null)
    const [qrImages, setQrImages] = useState([])
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
    async function submitHandler(e) {
        e.preventDefault()
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const CHUNK_SIZE = 900;
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


            {qrImages.map((qr) => (
                <div key={qr.payload.index}>
                    <img src={qr.image} />
                    <p>
                        {qr.payload.index + 1} / {qr.payload.total}
                    </p>
                </div>
            ))}
        </div>

    )
}

export default Sender