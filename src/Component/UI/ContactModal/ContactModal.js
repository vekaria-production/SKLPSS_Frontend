import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, Calendar, ArrowRight, CheckCircle2, Download, AlertCircle } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, event }) => {
  const showSelfRegister = false; // Toggle to show/hide online QR ticket self-registration

  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber('');
      setError('');
      setQrToken('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{7,15}$/.test(phoneNumber)) {
      setError('Please enter a valid phone number (7-15 digits).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NETWORK}/register_event/${event.ID}?phone_number=${phoneNumber}`
      );
      setQrToken(response.data.qr_token);
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.detail;
      if (msg && msg.includes('Already')) {
        setError('This phone number is already registered for this event.');
      } else {
        setError(msg || 'Failed to register. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/2482525370?text=Hello%20SKLPSS,%20I%20would%20like%20to%20register%20for%20the%20upcoming%20event:%20${encodeURIComponent(event.Name)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col font-sans">
        
        {/* Header section with brand accent */}
        <div className="bg-gradient-to-r from-[#F48F0F] to-orange-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold transition cursor-pointer select-none"
            aria-label="Close modal"
          >
            &times;
          </button>
          <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
            Upcoming Event Pass
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-2 truncate" title={event.Name}>
            {event.Name}
          </h2>
        </div>

        {/* Modal Content body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[75vh]">
          
          {success ? (
            /* Successful Registration Screen */
            <div className="flex flex-col items-center justify-center text-center py-4 space-y-5 animate-fadeIn">
              <div className="bg-green-100 text-green-600 p-3 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Registration Confirmed!</h3>
                <p className="text-sm text-gray-500 mt-1.5">Your virtual ticket passes have been successfully generated.</p>
              </div>

              {/* QR Code display */}
              <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-inner flex items-center justify-center select-none">
                <QRCodeSVG value={qrToken} size={150} />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <a
                  href={`${process.env.REACT_APP_NETWORK}/registration_qr_image/${qrToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#F48F0F] hover:bg-[#e1810c] text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-md transition duration-200"
                >
                  <Download size={18} /> Download Ticket Pass
                </a>
                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form & Coordinator Info */
            <>
              {/* Coordinator contact box */}
              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                <Calendar className="text-[#F48F0F] mt-0.5 flex-shrink-0" size={20} />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Event Coordinator Contact</p>
                  <p className="text-gray-600 mt-1">📞 +248 2 525 370</p>
                  <p className="text-gray-600">📧 support@sklpss.org</p>
                </div>
              </div>

              {/* Form Option 1: Direct self register */}
              {showSelfRegister && (
                <form onSubmit={handleRegister} className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Option 1: Quick QR Code Self-Register
                  </h3>
                  
                  <div className="relative">
                    <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase">
                      Enter Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 2525370"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F48F0F] focus:border-[#F48F0F] transition"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#F48F0F] hover:bg-[#e1810c] text-white font-bold w-full py-3 rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-md transition duration-200 disabled:opacity-50 cursor-pointer text-sm"
                  >
                    {loading ? 'Processing...' : 'Register and Get Ticket'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
              )}

              {/* Separator */}
              {showSelfRegister && (
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 font-bold uppercase py-2">
                  <div className="h-px bg-gray-200 flex-grow"></div>
                  <span>Or</span>
                  <div className="h-px bg-gray-200 flex-grow"></div>
                </div>
              )}

              {/* Form Option 2: WhatsApp link */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  {showSelfRegister ? "Option 2: Register on WhatsApp" : "Register for this Event"}
                </h3>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold w-full py-3.5 rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-md transition duration-200 text-sm cursor-pointer"
                >
                  <Phone size={16} /> Register via WhatsApp Chat
                </a>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ContactModal;
