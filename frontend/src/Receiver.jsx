import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";

export default function Receiver() {
    const [data, setdata] = useState(null)
    const videoRef = useRef();

    useEffect(() => {

        const scanner = new QrScanner(
            videoRef.current,
            result => {
                console.log("FOUND:", result);
                setdata(result.data);
            },
            {
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );

        scanner.start();

        return () => scanner.destroy();

    }, []);

    return (
        <div>
            <video
                ref={videoRef}
                style={{ width: 350 }}
            />
            <div>
                {data}
            </div>
        </div>

    );

}