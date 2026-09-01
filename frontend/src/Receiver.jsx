import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";

export default function Receiver() {
    const videoRef = useRef(null);

    // Stores all received chunks
    const receivedChunks = useRef(new Map());

    const [received, setReceived] = useState(0);
    const [total, setTotal] = useState(0);
    const [imageURL, setImageURL] = useState("");
    
    function reconstructImage(totalChunks) {
        let base64 = ""
        for (let i = 0; i < totalChunks; i++) {
            base64 += receivedChunks.current.get(i).data
            console.log(receivedChunks.current.get(i).data)
        }
        console.log(base64)
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
        <div>
            <video
                ref={videoRef}
                style={{ width: 350 }}
            />

            <h2>
                {received}/{total}
            </h2>

            {imageURL && (
                <img src={imageURL} alt="Recovered" />
            )}
        </div>
    );
}