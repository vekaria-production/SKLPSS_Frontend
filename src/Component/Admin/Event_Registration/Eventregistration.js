import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { motion } from "framer-motion";
import axios from "axios";

export default function QrScanner() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async (result) => {
    if (result?.text && result.text !== data) {
      setData(result.text);
      setStatus("Verifying registration...");
      setError("");
      setLoading(true);

      try {
        const res = await axios.post("http://localhost:8000/api/verify-registration", {
          qr_token: result.text,
        });

        setStatus(`✅ Verified: ${res.data.name || "Valid registration"}`);
      } catch (err) {
        if (err.response?.status === 404) {
          setStatus("❌ Invalid or unregistered QR code");
        } else {
          setError("⚠️ Server connection error");
        }
      } finally {
        setLoading(false);
      }
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
          Scan Event QR Code
        </h2>

        <div className="rounded-lg overflow-hidden mb-4">
          <QrReader
            onResult={(result, error) => {
              if (result) handleScan(result);
              if (error) console.warn(error);
            }}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        </div>

        {loading && <p className="text-blue-600 font-medium">⏳ Checking...</p>}
        {status && !loading && (
          <p
            className={`font-medium ${
              status.startsWith("✅")
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </motion.div>
    </section>
  );
}