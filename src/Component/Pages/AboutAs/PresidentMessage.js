import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PresidentMessage() {
  const [president, setPresident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function fetchPresident() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_NETWORK}/getMemberList`,
          {
            params: {
              position: 1, // ID 1 is President
              limit: 1
            }
          }
        );
        let data = response.data;
        if (typeof data === 'string') data = JSON.parse(data);
        
        if (Array.isArray(data) && data.length > 0) {
          setPresident(data[0]);
        } else {
          setPresident(null);
        }
      } catch (error) {
        console.error("Error fetching president data:", error);
        setPresident(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPresident();
  }, []);

  if (loading) {
    return null; // Don't show anything during load to avoid UI flickers
  }

  if (!president) {
    return null; // Hide section entirely if no President is found
  }

  const presidentName = `${president.Fname || ""} ${president.LName || ""}`.trim();
  const showImage = president.Image && !imgError;

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-3 gap-6 items-center">
        <div className="w-full flex justify-center">
          {showImage ? (
            <img
              src={president.Image}
              alt="President"
              className="rounded-lg w-full max-h-[350px] object-cover border border-gray-100"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full min-h-[200px] h-full rounded-lg flex items-center justify-center bg-[#EDE4DC] text-[#F48F0F] text-lg font-bold px-4 py-8 text-center uppercase tracking-wider border border-[#F48F0F]/20 select-none">
              President
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-gray-800">President's Message</h3>
          <p className="text-gray-700 mt-2 text-sm leading-relaxed">
            It brings me great pride and heartfelt joy to address you as the President of our vibrant Shree Kutchi Leva Patel Samaj Seychelles. Our organization has always stood as a beacon of unity, tradition, and shared purpose—
            bridging generations and preserving the essence of our cultural identity. <br /><br />
            As we move forward, our focus remains clear: to empower our youth through education, support our elders
            with respect, and foster togetherness through meaningful activities. This website marks a new chapter—a
            digital space where our values meet modern connectivity, making it easier than ever to stay informed,
            involved, and inspired. <br /><br />
            I warmly invite each of you to take part, share your voice, and continue building a legacy that reflects
            who we are—resilient, respectful, and rooted in community spirit.
          </p>
          <p className="mt-4 font-bold text-gray-900">{presidentName}</p>
          <p className="text-sm text-gray-500">President</p>
        </div>
      </div>
    </section>
  );
}
