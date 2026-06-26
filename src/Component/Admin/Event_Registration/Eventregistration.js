import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import beepFile from "../../../assets/beep.mp3";
import SidebarLayout from "../reusable/SidebarLayout";
import {
  FaCamera,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaInfoCircle
} from "react-icons/fa";

export default function QrScanner() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);        // BrowserMultiFormatReader instance
  const controlsRef = useRef(null);      // possible controls object returned by some methods
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [result, setResult] = useState(null); // { status, phone_number, checked_in_at, message }
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
      if (controlsRef.current && typeof controlsRef.current.stop === "function") {
        try { controlsRef.current.stop(); } catch (e) { console.warn("controls.stop() failed", e); }
      }
      if (readerRef.current && typeof readerRef.current.stopContinuousDecode === "function") {
        try { await readerRef.current.stopContinuousDecode(); } catch (e) { console.warn("stopContinuousDecode() failed", e); }
      }
      if (readerRef.current && typeof readerRef.current.reset === "function") {
        try { readerRef.current.reset(); } catch (e) { console.warn("reset() failed", e); }
      }
      if (readerRef.current && typeof readerRef.current.close === "function") {
        try { readerRef.current.close(); } catch (e) { console.warn("close() failed", e); }
      }
      controlsRef.current = null;
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
      setResult(null);
      setLoading(false);
      setScanning(true);

      if (!readerRef.current) readerRef.current = new BrowserMultiFormatReader();
      const reader = readerRef.current;

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

      const handleResult = async (qrToken) => {
        console.log("🎯 Scanned QR Token:", qrToken);
        try {
          await stopScan();
        } catch (e) {
          console.warn("stop after result failed:", e);
        }

        try { beep.current && beep.current.play().catch(()=>{}); } catch {}

        setLoading(true);
        setResult(null);
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_NETWORK}/verify_qr/${qrToken}`
          );
          setResult(res.data);
        } catch (err) {
          if (err?.response?.status === 404) {
            setResult({ status: "Invalid", message: "Invalid or unregistered QR code" });
          } else {
            setResult({ status: "Error", message: "Server connection error" });
          }
        } finally {
          setLoading(false);
        }
      };

      if (typeof reader.decodeContinuously === "function") {
        const controlsOrPromise = await reader.decodeContinuously(
          deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              handleResult(result.getText());
            }
          }
        );
        controlsRef.current = controlsOrPromise || null;
        return;
      }

      if (typeof reader.decodeFromVideoDevice === "function") {
        const maybeControls = reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              handleResult(result.getText());
            }
          }
        );
        controlsRef.current = maybeControls || null;
        return;
      }

      if (typeof reader.decodeFromConstraints === "function") {
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
    <SidebarLayout>
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>

      <div className="w-full bg-[#FDF8F3] p-4 sm:p-6 min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Event Check-In</h1>
          <p className="text-sm text-gray-500 mt-1">Scan visitor QR codes to verify registrations and log attendance.</p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-5xl w-full">
          {/* Camera Column (Left - 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bg-white border border-gray-100 rounded-3xl p-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-[#F48F0F]" />
              
              <div className="relative w-full aspect-square sm:aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-2xl"
                  autoPlay
                  muted
                  playsInline
                />

                {/* Laser scan line */}
                {scanning && (
                  <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#F48F0F] to-transparent animate-scan z-10 shadow-lg shadow-[#F48F0F]/50" />
                )}

                {/* Target Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[3px] border-transparent rounded-2xl">
                  {/* Top Left */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#F48F0F] rounded-tl-lg" />
                  {/* Top Right */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#F48F0F] rounded-tr-lg" />
                  {/* Bottom Left */}
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#F48F0F] rounded-bl-lg" />
                  {/* Bottom Right */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#F48F0F] rounded-br-lg" />
                </div>

                {/* Stopped Overlay */}
                {!scanning && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4">
                    <div className="p-4 bg-white/10 rounded-full mb-3 backdrop-blur-md">
                      <FaCamera className="text-4xl text-gray-300" />
                    </div>
                    <span className="text-white font-medium">Camera is inactive</span>
                    <span className="text-gray-400 text-xs mt-1">Start scanning to activate camera feed</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${scanning ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    {scanning ? 'Active Scanning' : 'Inactive'}
                  </span>
                </div>

                <button
                  onClick={toggleCamera}
                  disabled={!scanning}
                  className="flex items-center gap-2 bg-[#F48F0F]/10 text-[#F48F0F] border border-[#F48F0F]/20 px-3.5 py-1.5 rounded-xl hover:bg-[#F48F0F] hover:text-white transition duration-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSync /> Switch to {facingMode === "environment" ? "Front" : "Rear"}
                </button>
              </div>
            </div>
          </div>

          {/* Verification Status Panel Column (Right - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="w-full h-full bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Scan Verification</h3>

                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <FaSpinner className="text-4xl text-[#F48F0F] animate-spin mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-600">Verifying ticket details...</p>
                      <p className="text-xs text-gray-400 mt-1">Connecting to authentication server</p>
                    </motion.div>
                  )}

                  {!loading && result && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {result.status === "Access Granted" && (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-green-500" />
                          <div className="flex items-center gap-3 text-green-700 font-bold text-lg mb-2">
                            <FaCheckCircle className="text-2xl" />
                            <span>ACCESS GRANTED</span>
                          </div>
                          <p className="text-xs text-green-600 font-semibold mb-4">Verification succeeded. Welcome to the event!</p>
                          
                          <div className="space-y-2.5 text-xs text-gray-600 border-t border-green-200/50 pt-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-400 uppercase">Phone</span>
                              <span className="font-bold text-gray-800">{result.phone_number}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-400 uppercase">Checked In</span>
                              <span className="font-bold text-gray-800">{result.checked_in_at ? new Date(result.checked_in_at).toLocaleTimeString() : "Just Now"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.status === "Already Checked In" && (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                          <div className="flex items-center gap-3 text-amber-700 font-bold text-lg mb-2">
                            <FaExclamationTriangle className="text-2xl" />
                            <span>ALREADY CHECKED IN</span>
                          </div>
                          <p className="text-xs text-amber-600 font-semibold mb-4">This ticket has already been used for entry.</p>
                          
                          <div className="space-y-2.5 text-xs text-gray-600 border-t border-amber-200/50 pt-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-400 uppercase">Phone</span>
                              <span className="font-bold text-gray-800">{result.phone_number}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-400 uppercase">First Checked In</span>
                              <span className="font-bold text-gray-800">{result.checked_in_at ? new Date(result.checked_in_at).toLocaleTimeString() : "Unknown"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.status === "Invalid" && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                          <div className="flex items-center gap-3 text-red-700 font-bold text-lg mb-2">
                            <FaTimesCircle className="text-2xl" />
                            <span>INVALID TICKET</span>
                          </div>
                          <p className="text-xs text-red-600 font-semibold mb-1 leading-relaxed">
                            No active registration record found matching this QR token signature. Access denied.
                          </p>
                        </div>
                      )}

                      {result.status === "Error" && (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-500" />
                          <div className="flex items-center gap-3 text-gray-700 font-bold text-lg mb-2">
                            <FaInfoCircle className="text-2xl" />
                            <span>NETWORK ERROR</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            Unable to verify registration. Please check the network connection.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setResult(null);
                          startScan();
                        }}
                        className="w-full bg-[#F48F0F] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#F48F0F]/15 mt-2"
                      >
                        Scan Next
                      </button>
                    </motion.div>
                  )}

                  {!loading && !result && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      {scanning ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-orange-50 text-[#F48F0F] flex items-center justify-center mx-auto mb-3 animate-pulse">
                            <FaCamera />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">Awaiting QR scan...</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">Align the ticket QR code within the frame to verify attendance.</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
                            <FaInfoCircle />
                          </div>
                          <p className="text-sm font-semibold text-gray-600">Scanner Inactive</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">Click the "Start Scanning" button below to turn on the camera.</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Toggle Controls */}
              {!result && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  {!scanning ? (
                    <button
                      onClick={startScan}
                      className="w-full bg-[#F48F0F] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#F48F0F]/20"
                    >
                      Start Scanning
                    </button>
                  ) : (
                    <button
                      onClick={stopScan}
                      className="w-full bg-red-500 text-white font-semibold py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/10"
                    >
                      Stop Scanning
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
