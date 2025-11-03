import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { motion } from "framer-motion";
import axios from "axios";

export default function QrScanner() {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // "user" for front, "environment" for back

  // preload beep sound
  const beep = new Audio("/beep.mp3"); // Put a short beep.mp3 file in /public folder

  const startScan = async () => {
    try {
      setStatus("");
      setLoading(false);
      setScanning(true);

      codeReader.current = new BrowserMultiFormatReader();

      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        async (result, err, controls) => {
          if (result) {
            codeReader.current.reset();
            setScanning(false);
            setLoading(true);

            const qrToken = result.getText();

            try {
              const res = await axios.post("http://localhost:8000/api/verify-registration", {
                qr_token: qrToken,
              });

              // ✅ Play beep sound
              beep.play();

              setStatus(`✅ Verified: ${res.data.name || "Valid registration"}`);
            } catch (err) {
              if (err.response?.status === 404) {
                setStatus("❌ Invalid or unregistered QR code");
              } else {
                setStatus("⚠️ Server connection error");
              }
            } finally {
              setLoading(false);
            }
          }
        },
        { video: { facingMode } }
      );
    } catch (error) {
      console.error("Camera error:", error);
      setStatus("⚠️ Unable to access camera");
      setScanning(false);
    }
  };

  const stopScan = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setScanning(false);
    setStatus("🔴 Scan stopped");
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === "environment" ? "user" : "environment");
    if (scanning) {
      stopScan();
      setTimeout(startScan, 300); // restart scan with new camera
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Event QR Scanner
        </h2>

        {/* Video Preview */}
        <div className="rounded-lg overflow-hidden mb-4 bg-black relative">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            muted
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          {!scanning ? (
            <button
              onClick={startScan}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Start Scan
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Stop Scan
            </button>
          )}

          <button
            onClick={toggleCamera}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            {facingMode === "environment" ? "Front" : "Rear"}
          </button>
        </div>

        {/* Status Message */}
        {loading && (
          <p className="text-blue-600 mt-3 font-medium">⏳ Checking...</p>
        )}
        {status && !loading && (
          <p
            className={`mt-3 font-medium ${
              status.startsWith("✅")
                ? "text-green-700"
                : status.startsWith("❌")
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {status}
          </p>
        )}
      </motion.div>
    </section>
  );
}
