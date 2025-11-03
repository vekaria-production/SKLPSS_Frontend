import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { motion } from "framer-motion";
import axios from "axios";
import beepFile from "../../../assets/beep.mp3";

export default function QrScanner() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);        // BrowserMultiFormatReader instance
  const controlsRef = useRef(null);      // possible controls object returned by some methods
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const beep = useRef(null);

  useEffect(() => {
    beep.current = new Audio(beepFile);
    return () => {
      // cleanup on unmount
      stopScan();
      if (readerRef.current && typeof readerRef.current.reset === "function") {
        try { readerRef.current.reset(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unified stop that tries several approaches depending on ZXing version
  const stopScan = async () => {
    try {
      // 1) If controlsRef has stop()
      if (controlsRef.current && typeof controlsRef.current.stop === "function") {
        try { controlsRef.current.stop(); } catch (e) { console.warn("controls.stop() failed", e); }
      }

      // 2) If readerRef has stopContinuousDecode()
      if (readerRef.current && typeof readerRef.current.stopContinuousDecode === "function") {
        try { await readerRef.current.stopContinuousDecode(); } catch (e) { console.warn("stopContinuousDecode() failed", e); }
      }

      // 3) If readerRef has reset()
      if (readerRef.current && typeof readerRef.current.reset === "function") {
        try { readerRef.current.reset(); } catch (e) { console.warn("reset() failed", e); }
      }

      // 4) If readerRef has close() (older/newer variants)
      if (readerRef.current && typeof readerRef.current.close === "function") {
        try { readerRef.current.close(); } catch (e) { console.warn("close() failed", e); }
      }

      // 5) Clear refs
      controlsRef.current = null;
      // don't null readerRef.current here in case we reuse it; leaving it is fine
    } catch (err) {
      console.warn("stopScan error:", err);
    } finally {
      setScanning(false);
      setStatus("🔴 Scan stopped");
    }
  };

  const startScan = async () => {
    try {
      if (scanning) return;
      setStatus("");
      setLoading(false);
      setScanning(true);

      // create or reuse reader instance
      if (!readerRef.current) readerRef.current = new BrowserMultiFormatReader();

      const reader = readerRef.current;

      // list devices
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const device = devices.find((d) =>
        facingMode === "environment"
          ? d.label.toLowerCase().includes("back")
          : d.label.toLowerCase().includes("front")
      ) || devices[0];

      if (!device) {
        setStatus("⚠️ No camera found");
        setScanning(false);
        return;
      }

      const deviceId = device.deviceId;
      console.log("📷 Using device:", device.label || device.deviceId);

      // helper to handle a successful detection
      const handleResult = async (qrToken) => {
        console.log("🎯 Scanned QR Token:", qrToken);
        try {
          // stop scanning immediately (use unified stop)
          await stopScan();
        } catch (e) {
          console.warn("stop after result failed:", e);
        }

        // play beep
        try { beep.current && beep.current.play().catch(()=>{}); } catch {}

        setLoading(true);
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_NETWORK}/verify_qr/${qrToken}`
          );
          setStatus(`✅ Verified: ${res.data.name || "Valid registration"}`);
        } catch (err) {
          if (err?.response?.status === 404) {
            setStatus("❌ Invalid or unregistered QR code");
          } else {
            setStatus("⚠️ Server connection error");
          }
        } finally {
          setLoading(false);
        }
      };

      // 1) Prefer decodeContinuously if available (fast)
      if (typeof reader.decodeContinuously === "function") {
        console.log("Using decodeContinuously()");
        // decodeContinuously returns controls in some versions, or may be void.
        // The callback receives (result, err) similar to others.
        const controlsOrPromise = await reader.decodeContinuously(
          deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              const txt = result.getText();
              handleResult(txt);
            }
            if (error && error.name) {
              // ignore transient decode errors
            }
          }
        );
        controlsRef.current = controlsOrPromise || null;
        return;
      }

      // 2) Fallback to decodeFromVideoDevice (very common API)
      if (typeof reader.decodeFromVideoDevice === "function") {
        console.log("Using decodeFromVideoDevice()");
        // decodeFromVideoDevice may return a controls object or a promise
        const maybeControls = reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              const txt = result.getText();
              handleResult(txt);
            }
            // ignore errors
          }
        );

        // sometimes decodeFromVideoDevice returns a Promise/controls; store it
        controlsRef.current = maybeControls || null;
        return;
      }

      // 3) If neither function exists, try decodeFromConstraints (older/newer variants)
      if (typeof reader.decodeFromConstraints === "function") {
        console.log("Using decodeFromConstraints()");
        const constraints = { video: { deviceId: deviceId } };
        const maybeControls = await reader.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result, error) => {
            if (result) handleResult(result.getText());
          }
        );
        controlsRef.current = maybeControls || null;
        return;
      }

      // 4) Last-resort: throw
      throw new Error("No compatible decode method found on ZXing Browser reader.");
    } catch (error) {
      console.error("Camera error:", error);
      setStatus("⚠️ Unable to access camera");
      setScanning(false);
    }
  };

  const toggleCamera = async () => {
    setFacingMode((fm) => (fm === "environment" ? "user" : "environment"));
    if (scanning) {
      await stopScan();
      setTimeout(() => startScan(), 300);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center"
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Event QR Scanner</h2>

        <div className="rounded-lg overflow-hidden mb-4 bg-black relative">
          <video ref={videoRef} className="w-full h-64 object-cover" autoPlay muted />
        </div>

        <div className="flex justify-center gap-3">
          {!scanning ? (
            <button onClick={startScan} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Start Scan
            </button>
          ) : (
            <button onClick={stopScan} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
              Stop Scan
            </button>
          )}

          <button onClick={toggleCamera} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            {facingMode === "environment" ? "Front" : "Rear"}
          </button>
        </div>

        {loading && <p className="text-blue-600 mt-3 font-medium">⏳ Checking...</p>}
        {status && !loading && (
          <p className={`mt-3 font-medium ${status.startsWith("✅") ? "text-green-700" : status.startsWith("❌") ? "text-red-600" : "text-gray-700"}`}>{status}</p>
        )}
      </motion.div>
    </section>
  );
}
