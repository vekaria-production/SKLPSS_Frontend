import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../../UI/Navbar/Navbar";
import Footer from "../../UI/Footer/Footer";
import LoadingSpinner from "../../UI/LoadingSpiner/LoadingSpinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LazyImage from "../../UI/LazyImage/LazyImage";
function Gallery() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [categories, setCategories] = useState([])
  const ITEMS_PER_PAGE = 6;
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])

  const eventData = useMemo(() => {
    // // console.log(events)
    if (categoryFilter === "all") return events;
    
    return events.filter((event) => event.CategoryID === categoryFilter);
  }, [categoryFilter, events]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const pagedEvents = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, page]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter]);

  useEffect(() => {
    setLoading(true);
    setFadeIn(false);
    const timer = setTimeout(() => {
      setLoading(false);
      setFadeIn(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [categoryFilter, page]);

  useEffect(() => {

    async function getCategories() {
      // try {
        const response = await axios.get(
          `${process.env.REACT_APP_NETWORK}/CategoryList`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        let data = response.data;
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        // console.log(data);
        // 🔥 Normalize array-of-arrays → array-of-objects
        const normalized = data.data.map(([id, name]) => ({
          Id: id,
          Name: name,
        }));

        setCategories(normalized);
        // console.log("Fetched categories:", normalized);
      // } catch (error) {
      //   console.info("Reload");
      //   return null;
      // }
    }


    async function getEvents(){

      try {
        const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getEventList`, {
        params:{
          offset: 0,
          limit: 100,
          category_id: categoryFilter === "all" ? null : categoryFilter
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        let data = response.data.events;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        setEvents(data);
        setFilteredEvents(data);
        // // console.log("Fetched API data:", data);
        // return data;
      } catch (error) {
        console.info("Reload");
        return null;
      
        
      }

    }
    getCategories();
    getEvents();
    
  }, [categoryFilter])

  useEffect(() =>{
    setFilteredEvents(eventData);
  }, [eventData])

  return (
    <>
      <Navbar />
      <section className="text-center px-4 max-w-7xl mx-auto my-4">
        <h2 className="text-3xl font-bold mb-2">Moments Captured!!</h2>
        <p className="text-gray-600 mb-6">
          Explore the vibrant memories from our events and activities
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              categoryFilter === "all"
                ? "bg-[#F48F0F] text-white"
                : "text-black hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.Id}
              onClick={() => setCategoryFilter(cat.Id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                categoryFilter === cat.Id
                  ? "bg-[#F48F0F] text-white"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              {cat.Name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            {pagedEvents.map((event, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() =>
                  navigate( `/Gallery/${
                    event.ID
                  }/${encodeURIComponent(event.Name.replace(/\s+/g, "_"))}`, {state : {event}})
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/Gallery/${
                      event.Name
                    }/${encodeURIComponent(event.Name.replace(/\s+/g, "_"))}`, {state : {event}});
                  }
                }}
                className="rounded-xl shadow bg-white overflow-hidden hover:shadow-lg transform hover:scale-[1.03] transition duration-300 ease-in-out cursor-pointer"
              >
                <div className="w-full h-48 flex-shrink-0">
                  <LazyImage
                    src={event.Poster}
                    alt={event.Name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{event.Name}</h3>
                  <p className="text-sm text-gray-600">
                    {event.Description || "No description"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 border rounded ${
                  page === num ? "bg-[#F48F0F] text-white" : "hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition"
            >
              &gt;
            </button>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Gallery;
