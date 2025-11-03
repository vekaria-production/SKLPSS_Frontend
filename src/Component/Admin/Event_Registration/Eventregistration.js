import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import beepFile from "../../../assets/beep.mp3";

export default function QrScanner() {
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [flashColor, setFlashColor] = useState("");
  const lastResultRef = useRef(null);
  const beep = new Audio(beepFile);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      try {
        codeReader.current.stopContinuousDecode();
      } catch {}
    };
  }, []);

  // Start scanning
  const startScan = async () => {
    try {
      setStatus("");
      setLoading(false);
      setScanning(true);

      // stop if already active
      try {
        await codeReader.current.stopContinuousDecode();
      } catch {}

      const videoConstraints = {
        facingMode,
        frameRate: { ideal: 30, max: 60 }, // faster frames
        width: { ideal: 640 },
        height: { ideal: 480 },
      };

      await codeReader.current.decodeContinuously(
        videoRef.current,
        { video: videoConstraints },
        async (result, error) => {
          if (result) {
            const qrToken = result.getText();

            // Prevent duplicate detections
            if (lastResultRef.current === qrToken) return;
            lastResultRef.current = qrToken;

            await codeReader.current.stopContinuousDecode();
            setScanning(false);
            setLoading(true);

            try {
              const res = await axios.post(
                `${process.env.REACT_APP_NETWORK}/verify-registration`,
                { qr_token: qrToken }
              );

              beep.play();
              flash("green");
              setStatus(`✅ Verified: ${res.data.name || "Valid registration"}`);
            } catch (err) {
              flash("red");
              if (err.response?.status === 404) {
                setStatus("❌ Invalid or unregistered QR code");
              } else {
                setStatus("⚠️ Server connection error");
              }
            } finally {
              setLoading(false);
            }
          }
        }
      );
    } catch (error) {
      console.error("Camera error:", error);
      setStatus("⚠️ Unable to access camera");
      setScanning(false);
    }
  };

  // Stop scanning
  const stopScan = async () => {
    try {
      await codeReader.current.stopContinuousDecode();
      setScanning(false);
      setStatus("🔴 Scan stopped");
    } catch (error) {
      console.warn("Error stopping scan:", error);
    }
  };

  // Toggle between front/rear camera
  const toggleCamera = async () => {
    setFacingMode(facingMode === "environment" ? "user" : "environment");
    if (scanning) {
      await stopScan();
      setTimeout(startScan, 300);
    }
  };

  // Flash color border effect
  const flash = (color) => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(""), 400);
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center relative"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Event QR Scanner
        </h2>

        {/* Video Preview */}
        <div className="relative rounded-lg overflow-hidden mb-4 bg-black">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            muted
          />
          <AnimatePresence>
            {flashColor && (
              <motion.div
                key="flash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 border-[6px] rounded-lg ${
                  flashColor === "green" ? "border-green-500" : "border-red-500"
                }`}
              />
            )}
          </AnimatePresence>
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
