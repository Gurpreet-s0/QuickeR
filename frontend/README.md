# 🚀 QuickeR

## 🚀 Live Demo

Try QuickeR online: **[Live Demo](https://quicke-r.vercel.app/)**

> **Transfer files instantly using QR codes. No Internet. No Bluetooth. No Wi-Fi.**

QuickeR is an offline file transfer application that converts any file into a sequence of QR codes. Another device running QuickeR scans these QR codes, reconstructs the original binary data, and recreates the file without requiring any network connection.

It demonstrates how binary data can be chunked, serialized, transmitted through optical communication (QR Codes), and reconstructed back into its original form.

---

## ✨ Features

- 📤 Transfer files completely offline
- 📷 Automatic QR code slideshow
- 📥 Real-time QR scanning
- 📦 Binary chunking & reconstruction
- 🔄 Automatic file reassembly
- ⚡ Adjustable chunk size
- ⏱️ Adjustable QR slideshow speed
- 🖼️ Image reconstruction from scanned QR codes
- 🔁 Duplicate chunk detection using `Map`

---

# 📖 How It Works

The sender converts a selected file into raw binary data, divides it into smaller chunks, encodes every chunk as Base64, and generates a QR code for each chunk.

The receiver continuously scans these QR codes, stores every chunk using its index, reconstructs the original binary sequence, and recreates the original file.

```text
                SENDER

       Select File
            │
            ▼
      ArrayBuffer
            │
            ▼
       Uint8Array
            │
            ▼
      Split into Chunks
            │
            ▼
    Encode each Chunk
        into Base64
            │
            ▼
   Generate QR Codes
            │
            ▼
     Automatic Slideshow
═══════════════════════════════════════
        Optical Transfer
═══════════════════════════════════════
            ▲
            │
     Camera Scanning
            │
            ▼
      Decode QR Code
            │
            ▼
      Parse JSON Data
            │
            ▼
 Store Chunk using Index
        inside Map
            │
            ▼
 Receive all Chunks?
      │            │
      │ No         │ Yes
      ▼            ▼
 Continue      Merge Chunks
 Scanning           │
                    ▼
            Reconstruct Bytes
                    │
                    ▼
               Create Blob
                    │
                    ▼
            Original File
```

---

# 🧠 Tech Stack

- React
- JavaScript (ES6)
- QRCode
- qr-scanner
- HTML5
- CSS3

---

# 📂 Project Structure

```
QuickeR
│
├── Sender
│   ├── Select File
│   ├── Convert to Binary
│   ├── Generate QR Codes
│   └── QR Slideshow
│
├── Receiver
│   ├── Camera Scanner
│   ├── Read QR Codes
│   ├── Store Chunks
│   └── Reconstruct File
│
└── Shared
    └── QR Payload Protocol
```

---

# 📦 QR Payload Format

Each QR code contains a JSON payload like:

```json
{
  "index": 5,
  "total": 24,
  "data": "Base64EncodedChunk"
}
```

Where:

| Field | Description |
|-------|-------------|
| `index` | Position of the chunk |
| `total` | Total number of chunks |
| `data` | Base64 encoded binary data |

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/QuickeR.git
```

Go into the project

```bash
cd QuickeR
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

# 📸 Usage

### Sender

1. Open the **Sender** page.
2. Select a file.
3. Adjust chunk size and QR speed.
4. Click **Generate QR**.
5. The QR slideshow starts automatically.

### Receiver

1. Open the **Receiver** page.
2. Allow camera permission.
3. Point the camera at the sender's screen.
4. Wait until all chunks are received.
5. The original file is reconstructed automatically.

---

# 🏗️ Concepts Used

This project explores several important Computer Science concepts:

- Binary Data
- ArrayBuffer
- Uint8Array
- Base64 Encoding
- Chunking
- JSON Serialization
- QR Encoding
- Optical Data Transmission
- Hash Map (`Map`)
- Blob
- Object URLs
- File Reconstruction

---

# 🚧 Future Improvements

- 📄 Support every file type
- 🎥 Video transfer
- 🎵 Audio transfer
- 📦 File compression before encoding
- ⚡ Binary QR mode (reduce QR count)
- 🔒 Encryption
- ✅ Error correction & checksum verification
- 🔁 Resume interrupted transfers
- 📊 Live transfer statistics
- 📱 Mobile optimized UI
- 🌙 Better animations

---

# 💡 Why QuickeR?

QuickeR is more than just a QR code generator. It demonstrates how files can be transmitted through visual communication by treating QR codes as packets in a transport protocol.

The project recreates many concepts used in real-world networking, including chunking, packet ordering, serialization, duplicate detection, and data reconstruction, all without relying on an internet connection.

---

# 🤝 Contributing

Contributions are welcome!

Feel free to fork the repository, open issues, or submit pull requests to improve the project.

---

# ⭐ Support

If you found this project interesting, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.