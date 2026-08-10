import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LazyImage from '../../UI/LazyImage/LazyImage';
import ContactModal from '../../UI/ContactModal/ContactModal';

function getMonthName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long' });
}

function getDay(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  return String(day).padStart(2, '0');
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function getEvents({ offset = 0, limit = 100 } = {}) {
      try {
        const currentDate = new Date();
        const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getEventList`, {
          params: { offset, limit, from_date: currentDate.toISOString() },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        let data = response.data.events;
        if (typeof data === 'string') {
          data = JSON.parse(data).events;
        }

        data.forEach((ev) => {
          const fromDate = new Date(ev.From);
          const toDate = new Date(ev.To);

          if (fromDate > currentDate) {
            ev.status = "Upcoming";
          } else if (toDate < currentDate) {
            ev.status = "Past";
          } else {
            ev.status = "Ongoing";
          }
        });

        setEvents(data);
      } catch (error) {
        console.info("Failed to fetch events:", error);
      }
    }

    getEvents();
  }, []);

  const upcomingEvents = events.filter((ev) => ev.status === "Upcoming");

  return (
    <section className="text-center px-[5vw] mb-20 max-w-[90vw] mx-auto font-sans">
      <h2 className="mb-4 text-[clamp(2rem,5vw,2.75rem)] font-extrabold text-[#292929] tracking-tight">
        Upcoming <span className="text-[#F48F0F]">Events</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base leading-relaxed">
        Join us in our upcoming community celebrations and cultural programs. Be sure to register to secure your passes!
      </p>

      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedEvent(event);
                setModalOpen(true);
              }}
              className="bg-white rounded-2xl shadow-md border border-[#e4e4e4] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col text-left cursor-pointer group"
            >
              {/* Poster header image */}
              <div className="h-48 w-full overflow-hidden bg-orange-50 relative flex-shrink-0">
                <LazyImage
                  src={event.Poster}
                  alt={event.Name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Date Badge Overlay */}
                <div className="absolute top-3 left-3 bg-[#F48F0F] text-white text-center rounded-xl py-2 px-3 flex flex-col items-center justify-center font-bold shadow-md leading-tight select-none">
                  <span className="text-[10px] uppercase tracking-wider">{getMonthName(event.From).slice(0, 3)}</span>
                  <span className="text-lg">{getDay(event.From)}</span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#F48F0F] transition-colors truncate">
                  {event.Name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 flex-grow">
                  {event.Description || "Join us for this special occasion. Click to view full details and registration options."}
                </p>
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F48F0F] uppercase tracking-wider">
                    Click to Register
                  </span>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#e4e4e4] rounded-2xl p-10 max-w-lg mx-auto shadow-sm text-center">
          <span className="text-4xl block mb-3">📅</span>
          <p className="text-gray-600 font-semibold mb-2">No Upcoming Events</p>
          <p className="text-sm text-gray-400">
            We are currently planning our next gatherings. Follow our social channels for updates!
          </p>
        </div>
      )}

      <div className="flex justify-center mt-10">
        <Link to="/events">
          <button className="bg-transparent border-2 border-[#F48F0F] text-[#F48F0F] hover:bg-[#F48F0F] hover:text-white py-3 px-8 rounded-full font-bold tracking-wide text-xs uppercase shadow transition duration-300 cursor-pointer">
            View All Events
          </button>
        </Link>
      </div>

      <ContactModal
        isOpen={modalOpen}
        event={selectedEvent}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
