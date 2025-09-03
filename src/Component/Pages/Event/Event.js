import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../UI/Footer/Footer";
// import events from "../../../assets/eventsarray";
import Back from "../../UI/Back_button/Back";
import LoadingSpinner from "../../UI/LoadingSpiner/LoadingSpinner";
import ContactModal from "../../UI/ContactModal/ContactModal"; // 👈 You need to create this modal
import axios from "axios";
import LazyImage from "../../UI/LazyImage/LazyImage";
import { getDriveImageUrl } from "../../../utils/getGoogleDriveImage";

const statusClasses = {
  upcoming: "bg-blue-100 text-blue-500",
  completed: "bg-orange-100 text-orange-500",
  ongoing: "bg-yellow-100 text-yellow-600",
};

function formatDateTime(isoString) {
  const date = new Date(isoString);

  // Format date part (DD MMMM YYYY)
  const optionsDate = {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  };
  const formattedDate = date.toLocaleDateString('en-GB', optionsDate);

  // Format time part (12hr)
  const optionsTime = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

  return `${formattedDate} ${formattedTime}`;
}

const ITEMS_PER_PAGE = 6;

function getPageNumbers(currentPage, totalPages) {
  
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = [];
  if (currentPage > 2) pages.push(1);
  if (currentPage > 3) pages.push("left-ellipsis");
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (currentPage < totalPages - 2) pages.push("right-ellipsis");
  if (currentPage < totalPages - 1) pages.push(totalPages);
  return pages;
}

const EventsPage = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const currentDate = new Date();
  // const [filteredEvents, setFilteredEvents] = useState([]);

  const filteredEvents = useMemo(() => {
    
    const term = search.toLowerCase();
    return events.filter((ev) => {
      // // console.log(ev);
      if (filter === "Upcoming" && ev.status !== "Upcoming") return false;
      if (filter === "Past" && ev.status !== "Past") return false;
      if (filter === "Ongoing" && ev.status !== "Ongoing") return false;
      if (
        term &&
        !(
          ev.Name.toLowerCase().includes(term) ||
          ev.Description.toLowerCase().includes(term)
        )
      )
        return false;
      return true;
    });
  }, [filter, search, events]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const pagedEvents = filteredEvents.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const pageNumbers = getPageNumbers(page, totalPages);

  useEffect(() => {
    setLoading(true);
    setFadeIn(false);
    const timer = setTimeout(() => {
      setLoading(false);
      setFadeIn(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [filter, search, page]);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const handleEventClick = (event) => {
    if (event.status === "Past" || event.status === "Ongoing") {
      const encodedTitle = encodeURIComponent(event.Name.replace(/\s+/g, "_"));
      navigate(`/Gallery/${event.ID}/${encodedTitle}`, {state: { event}} );
    } else if (event.status === "Upcoming") {
      setSelectedEventTitle(event.Name);
      setModalOpen(true);
    }
  };

  useEffect(() => {



    async function getEvents({offset=0, limit=100} ={}){

      try {
          const response = await axios.get(`http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/getEventList`, {
            params: {  offset, limit },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          let data = response.data.events
          if (typeof data === 'string') {
            data = JSON.parse(data).events;
          }
        
        data.map((ev) => {
          const fromDate = new Date(ev.From);
          const toDate = new Date(ev.To);

          if (fromDate > currentDate) {
            ev.status = "Upcoming";
          } else if (toDate < currentDate) {
            ev.status = "Past";
          } else {
            ev.status = "Ongoing";
          }

          ev.From = formatDateTime(ev.From);
          ev.To = formatDateTime(ev.From);
        })


        setEvents(data);
        // setFilteredEvents(data);
        // console.log("Fetched API data:", data);
        // return data;
      } catch (error) {
        console.info("Reload");
        return null;
      
        
      }

    }

    getEvents();
    
  }, [])

  

  return (
    <>
      <div className="bg-white text-gray-800 font-sans min-h-screen mb-12">
        <Back />

        <section className="text-center px-4 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-2">Our Events</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Stay connected with our vibrant community. Discover celebrations,
            gatherings, and learning opportunities.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <input
              type="search"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              aria-label="Search events"
            />
            <div className="flex gap-3">
              {["All", "Upcoming", "Past", "Ongoing"].map((label) => (
                <button
                  key={label}
                  onClick={() => setFilter(label)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    filter === label
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-pressed={filter === label}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>


          {loading ? (
            <LoadingSpinner />
          ) : pagedEvents.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-opacity duration-500 ${
                fadeIn ? "opacity-100" : "opacity-0"
              }`}
            >
              {pagedEvents.map((event, idx) => {
                
                const StatusTag = (
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      statusClasses[event.status.toLowerCase()] ||
                       ""
                    }`}
                  >
                    {event.status}
                  </span>
                );
                // // console.log(event)
                return (
                  <div
                    key={idx}
                    className="bg-white rounded shadow p-4 text-left cursor-pointer hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    style={{
                      minHeight: "220px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    tabIndex={0}
                    role="button"
                    onClick={() => handleEventClick(event)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEventClick(event);
                    }}
                    aria-label={`View details for ${event.Name}`}
                  >
                    <div className="w-full h-40 mb-4 flex-shrink-0">
                      <LazyImage
                        src={event.Poster}
                        alt={`Event poster for ${event.Name}`}
                        className="h-40"
                      />
                    </div>

                    <h3 className="font-bold text-sm mb-1">{event.Name}</h3>
                    <p className="text-sm text-gray-600 flex-grow">
                      {event.Description}
                    </p>
                    <div className="flex justify-between items-center text-xs mt-3">
                      <span className="flex items-center gap-1">
                        📅 {event.From}
                      </span>
                      {StatusTag}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic mt-20">
              No events found matching your criteria.
            </p>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2 flex-wrap select-none">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition"
                aria-label="Previous page"
              >
                &lt;
              </button>

              {pageNumbers.map((num, idx) => {
                if (num === "left-ellipsis" || num === "right-ellipsis") {
                  return (
                    <span key={idx} className="px-3 py-1 select-none">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => setPage(num)}
                    aria-current={page === num ? "page" : undefined}
                    className={`px-3 py-1 border rounded transition ${
                      page === num
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition"
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          )}
        </section>
      </div>

      <ContactModal
        isOpen={modalOpen}
        eventTitle={selectedEventTitle}
        onClose={() => setModalOpen(false)}
      />

      <Footer />
    </>
  );
};

export default EventsPage;
