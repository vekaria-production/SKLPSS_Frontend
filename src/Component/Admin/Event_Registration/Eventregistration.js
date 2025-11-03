import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { motion } from "framer-motion";
import axios from "axios";
import beepFile from "../../../assets/beep.mp3";

export default function QrScanner() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const beep = new Audio(beepFile);

  // Start scanning
  const startScan = async () => {
    try {
      if (scanning) return;
      setStatus("");
      setLoading(false);
      setScanning(true);

      // Initialize reader
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const selectedDeviceId =
        devices.find((d) =>
          facingMode === "environment"
            ? d.label.toLowerCase().includes("back")
            : d.label.toLowerCase().includes("front")
        )?.deviceId || devices[0]?.deviceId;

      if (!selectedDeviceId) {
        setStatus("⚠️ No camera found");
        setScanning(false);
        return;
      }

      // Continuous scan using decodeFromVideoDevice()
      reader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, async (result, err) => {
        if (result) {
          // Stop scan quickly to prevent multiple reads
          reader.reset();
          setScanning(false);
          setLoading(true);

          const qrToken = result.getText();

          try {
            const res = await axios.post(
              `${process.env.REACT_APP_NETWORK}/verify-registration`,
              { qr_token: qrToken }
            );
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
      });
    } catch (error) {
      console.error("Camera error:", error);
      setStatus("⚠️ Unable to access camera");
      setScanning(false);
    }
  };

  const stopScan = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setScanning(false);
    setStatus("🔴 Scan stopped");
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === "environment" ? "user" : "environment");
    if (scanning) {
      stopScan();
      setTimeout(startScan, 300); // restart with new camera
    }
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

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

        <div className="rounded-lg overflow-hidden mb-4 bg-black relative">
          <video ref={videoRef} className="w-full h-64 object-cover" autoPlay muted />
        </div>

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

        {loading && <p className="text-blue-600 mt-3 font-medium">⏳ Checking...</p>}
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
