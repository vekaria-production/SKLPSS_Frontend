import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import PhotoGridDisplay from "../../UI/PhotoGrid/PhotoGridDisplay";
import Back from "../../UI/Back_button/Back";
import axios from "axios";

const GalleryEvent = () => {
  const { Id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const observer = useRef();
  const location = useLocation();
  const events = location.state?.event;

  // Lightbox States
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch images with pagination
  const fetchCategories = useCallback(async (currentOffset) => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NETWORK}/getEventImages/${Id}?offset=${currentOffset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      let data = response.data;

      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      const newLinks = data.map(item => item.Link);
      
      if (currentOffset === 0) {
        setPhotos(newLinks);
      } else {
        setPhotos((prev) => [...prev, ...newLinks]);
      }

      setOffset(currentOffset + limit);
      setHasMore(data.length === limit);
    } catch (error) {
      console.info("No more photos loaded.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [Id, hasMore, isLoading]);

  useEffect(() => {
    setSelectedEvent(events);
    setPhotos([]);
    setOffset(0);
    setHasMore(true);
    
    // Fetch initial chunk
    setIsLoading(false);
    // Directly run fetchCategories at offset 0
    // Bypass hasMore check for initial load by invoking API directly
    const fetchInitial = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_NETWORK}/getEventImages/${Id}?offset=0&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        let data = response.data;
        if (typeof data === 'string') data = JSON.parse(data);
        const links = data.map(item => item.Link);
        setPhotos(links);
        setOffset(limit);
        setHasMore(data.length === limit);
      } catch (error) {
        setPhotos([]);
        setHasMore(false);
      }
    };
    fetchInitial();
  }, [Id, events]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowRight") {
        setPhotoIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === "ArrowLeft") {
        setPhotoIndex((prev) => (prev + photos.length - 1) % photos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, photos.length]);

  // IntersectionObserver setup for infinite scrolling
  const lastPhotoRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchCategories(offset);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchCategories, offset]
  );

  return (
    <div className="min-h-screen bg-[#FdF8F3] text-[#292929] pb-12 font-sans">
      <Back />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Hero Banner Section */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-8 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#F48F0F]/10 w-48 h-48 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {selectedEvent ? selectedEvent.Name : "Event Gallery"}
              </h1>
              {selectedEvent && (selectedEvent.From || selectedEvent.To) && (
                <p className="text-sm text-gray-500 mt-2.5 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <span>📅</span> {selectedEvent.From} {selectedEvent.To && ` - ${selectedEvent.To}`}
                </p>
              )}
              {selectedEvent?.Description && (
                <p className="text-gray-600 mt-4 max-w-4xl text-sm sm:text-base leading-relaxed">
                  {selectedEvent.Description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Grid Section */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span>🖼️</span> Event Photos
          </h2>
          {photos.length > 0 ? (
            <PhotoGridDisplay
              images={photos}
              lastPhotoRef={lastPhotoRef}
              onImageClick={(index) => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            />
          ) : (
            !isLoading && (
              <div className="text-center py-12 text-gray-400 italic">
                No photos approved for this event yet.
              </div>
            )
          )}

          {isLoading && (
            <div className="text-center my-6 flex flex-col items-center justify-center gap-2">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F48F0F]"></div>
              <p className="text-sm text-gray-500 font-medium">Loading more images...</p>
            </div>
          )}

          {!hasMore && photos.length > 0 && (
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-400 font-medium">No more images to load.</p>
            </div>
          )}
        </div>
      </div>

      {/* Frosted Glass Lightbox */}
      {isOpen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#F48F0F] text-4xl font-bold p-2 transition-colors cursor-pointer z-50 select-none"
            aria-label="Close lightbox"
          >
            &times;
          </button>

          {/* Prev button */}
          <button
            onClick={() => setPhotoIndex((photoIndex + photos.length - 1) % photos.length)}
            className="absolute left-4 sm:left-6 text-white hover:text-[#F48F0F] text-5xl font-normal p-3 select-none transition-colors cursor-pointer z-50 bg-white/5 hover:bg-white/10 rounded-full w-14 h-14 flex items-center justify-center"
            aria-label="Previous photo"
          >
            &#8249;
          </button>

          {/* Image container */}
          <div className="max-w-[85vw] max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={photos[photoIndex]}
              alt={`Event slide ${photoIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
            />
            <span className="text-white/80 text-sm font-semibold mt-4 bg-black/40 px-3 py-1 rounded-full">
              {photoIndex + 1} / {photos.length}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}
            className="absolute right-4 sm:right-6 text-white hover:text-[#F48F0F] text-5xl font-normal p-3 select-none transition-colors cursor-pointer z-50 bg-white/5 hover:bg-white/10 rounded-full w-14 h-14 flex items-center justify-center"
            aria-label="Next photo"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryEvent;