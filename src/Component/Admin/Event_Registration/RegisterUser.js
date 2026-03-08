import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { UserPlus, X } from "lucide-react";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function RegisterUser() {
  const [eventData, setEventData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [memberId, setMemberId] = useState("");
  
  // Registration result states
  const [isRegistering, setIsRegistering] = useState(false);
  const [qrToken, setQrToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const now = new Date();

  async function fetchEvents() {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getEventList`, {
        params: { offset: 0, limit: 100 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let data = response.data;
      if (typeof data === 'string') data = JSON.parse(data);

      if (data && data.events) {
        const updatedEvents = data.events.map(event => {
          const fromDate = new Date(event.From);
          const toDate = new Date(event.To);
          let status = '';

          if (fromDate > now) {
            status = 'upcoming';
          } else if (toDate >= now) {
            status = 'ongoing';
          } else {
            status = 'completed';
          }

          const formattedFromTime = fromDate.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
          });
          const formattedToTime = toDate.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
          });

          return {
            ...event,
            Status: status,
            FormattedFromTime: formattedFromTime,
            FormattedToTime: formattedToTime,
          };
        });
        setEventData(updatedEvents);
      }
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const openRegisterModal = (event) => {
    setSelectedEvent(event);
    setPhoneNumber("");
    setMemberId("");
    setQrToken(null);
    setErrorMsg("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setQrToken(null);
    setErrorMsg("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setErrorMsg("Phone number is required");
      return;
    }

    setIsRegistering(true);
    setErrorMsg("");
    setQrToken(null);

    try {
      let url = `${process.env.REACT_APP_NETWORK}/register_event/${selectedEvent.ID}?phone_number=${encodeURIComponent(phoneNumber)}`;
      if (memberId) {
        url += `&member_id=${encodeURIComponent(memberId)}`;
      }

      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data && res.data.qr_token) {
        setQrToken(res.data.qr_token);
      } else {
        setErrorMsg("Registration successful but no QR token returned form server.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setErrorMsg(err.response.data.detail);
      } else {
        setErrorMsg("An error occurred during registration. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const filteredEvents = eventData.filter((event) => {
    return event.Name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-6 relative min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Register User for Event</h1>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center bg-white rounded-full px-4 py-2 border border-gray-300 w-full sm:max-w-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by Event Name"
              className="outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Event Table */}
        {loading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F48F0F]"></div>
          </div>
        ) : (
          <CustomTable
            cols={[
              { key: "Name", label: "Event Name" },
              { key: "FormattedFromTime", label: "From" },
              { key: "FormattedToTime", label: "To" },
              { key: "Category", label: "Category" },
              { key: "Status", label: "Status" },
            ]}
            rows={filteredEvents.map((event) => ({
              ...event,
              actions: (
                <button
                  onClick={() => openRegisterModal(event)}
                  className="flex items-center justify-center gap-2 bg-[#F48F0F] text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90 transition-opacity"
                  title="Register a user for this event"
                >
                  <UserPlus size={16} />
                  <span>Register User</span>
                </button>
              ),
            }))}
            visibleCols={{
              Name: true,
              FormattedFromTime: true,
              FormattedToTime: true,
              Category: true,
              Status: true,
            }}
          />
        )}

        {/* Registration Modal */}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
              {/* Header */}
              <div className="bg-[#FDF8F3] px-6 py-4 border-b border-[#E1D5C9] flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#292929]">
                  Register for {selectedEvent.Name}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800 transition"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {qrToken ? (
                  // Success State: Show QR Code
                  <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
                    <div className="text-green-600 font-semibold text-lg flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">✓</span>
                      Registration Successful!
                    </div>
                    <p className="text-sm text-center text-gray-500 mb-2">
                      Please save or screenshot this QR code for check-in.
                    </p>
                    <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl inline-block shadow-sm">
                      <QRCodeSVG
                        value={qrToken}
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"Q"}
                        includeMargin={false}
                      />
                    </div>
                    <div className="w-full mt-4">
                      <button
                        onClick={closeModal}
                        className="w-full bg-gray-100 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  // Form State
                  <form onSubmit={handleRegister} className="space-y-4">
                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {errorMsg}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 555-0199"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F48F0F] focus:border-transparent transition text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Member ID <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        placeholder="e.g. SKL001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F48F0F] focus:border-transparent transition text-sm"
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isRegistering || !phoneNumber}
                        className={`px-4 py-2 text-sm font-medium text-white bg-[#F48F0F] rounded-lg transition ${
                          isRegistering || !phoneNumber
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#e1800d]"
                        }`}
                      >
                        {isRegistering ? "Registering..." : "Register"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
