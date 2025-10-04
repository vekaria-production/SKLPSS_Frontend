// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import Lightbox from "react-image-lightbox";
// import "react-image-lightbox/style.css";
// import Back from "../../UI/Back_button/Back";
// import LoadingSpinner from "../../UI/LoadingSpiner/LoadingSpinner";
// import PhotoGridDisplay from "../../UI/PhotoGrid/PhotoGridDisplay";
// import axios from "axios";

// const GalleryEvent = () => {
//   const { Id } = useParams();
//   const location = useLocation();
//   const event = location.state?.event;

//   const [eventData, setEventData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [photoIndex, setPhotoIndex] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const [offset, setOffset] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   const limit = 10; // Number of images to fetch per request

//   // ✅ Normalize images into proper Google Drive links
//   const images = eventData.map((item) =>
//     item.Link.startsWith("http")
//       ? item.Link
//       : `https://lh3.googleusercontent.com/d/${item.Link}=w4000?authuser=0`
//   );

//   // ✅ Fetch images
//   const fetchEventImages = useCallback(
//     async (currentOffset) => {
//       if (!hasMore || isLoadingMore) return;
//       setIsLoadingMore(true);

//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_NETWORK}/getEventImages/${Id}?offset=${currentOffset}&limit=${limit}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         let data = response.data;
//         if (typeof data === "string") {
//           data = JSON.parse(data);
//         }

//         setEventData((prevData) => [...prevData, ...data]);
//         setOffset((prev) => prev + limit);
//         if (data.length < limit) setHasMore(false);
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       } finally {
//         setIsLoading(false);
//         setIsLoadingMore(false);
//       }
//     },
//     [Id, hasMore, isLoadingMore]
//   );

//   // ✅ Reset when Id changes
//   useEffect(() => {
//     setEventData([]);
//     setOffset(0);
//     setHasMore(true);
//     setIsLoading(true);
//     fetchEventImages(0);
//   }, [Id, fetchEventImages]);

//   // ✅ Infinite scroll with debounce
//   useEffect(() => {
//     let timeout;
//     const handleScroll = () => {
//       if (timeout) clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         if (
//           window.innerHeight + document.documentElement.scrollTop >=
//             document.documentElement.offsetHeight - 100 &&
//           hasMore &&
//           !isLoadingMore
//         ) {
//           fetchEventImages(offset);
//         }
//       }, 200);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       if (timeout) clearTimeout(timeout);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [fetchEventImages, offset, hasMore, isLoadingMore]);

//   // ✅ Empty / loading states
//   if (isLoading && !eventData.length) return <LoadingSpinner />;
//   if (!eventData.length && !isLoading)
//     return (
//       <div className="text-center text-red-500">
//         No images found for this event
//       </div>
//     );

//   return (
//     <div className="bg-[#FDF8F3] min-h-screen px-4 sm:px-8 py-5">
//       <Back />
//       <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
//         {event?.Name || "Event Gallery"}
//       </h1>
//       <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
//         {event?.Description || "View images from this event."}
//       </p>

//       <PhotoGridDisplay
//         images={images}
//         onImageClick={(index) => {
//           setPhotoIndex(index);
//           setIsOpen(true);
//         }}
//       />

//       {isLoadingMore && (
//         <div className="text-center my-4">
//           <LoadingSpinner />
//         </div>
//       )}

//       {isOpen && images.length > 0 && (
//         <Lightbox
//           mainSrc={images[photoIndex]}
//           nextSrc={images[(photoIndex + 1) % images.length]}
//           prevSrc={images[(photoIndex + images.length - 1) % images.length]}
//           onCloseRequest={() => setIsOpen(false)}
//           onMovePrevRequest={() =>
//             setPhotoIndex((photoIndex + images.length - 1) % images.length)
//           }
//           onMoveNextRequest={() =>
//             setPhotoIndex((photoIndex + 1) % images.length)
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default GalleryEvent;


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import PhotoGridDisplay from "../../UI/PhotoGrid/PhotoGridDisplay";
// import SidebarLayout from "./../../Admin/reusable/SidebarLayout";
import axios from "axios";
// import { compressImages } from "./../../Admin/reusable/ImageCompressor";

const uploadImages = async (files, Id) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file); // "files" must match the FastAPI parameter name
  });

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_NETWORK}/updateEventImage/${Id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

const GalleryEvent = () => {
  const { Id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Track if more images are available
  const limit = 10; // Number of images to fetch per request
  const observer = useRef(); // For IntersectionObserver
  const location = useLocation();
  const events = location.state?.event;

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
      // console.log("Fetched photos:", data);
      setPhotos((prev) => [...prev, ...data.map(item => item.Link)]);
      // setPhotos(data.map(item => item.Link));

      setOffset(currentOffset + limit);
      setHasMore(data.length === limit); // If fewer images than limit, no more data
    } catch (error) {
      console.info("No more photos loaded.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [Id, hasMore, isLoading]);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // Skip if already run (ignores StrictMode double)
    hasRun.current = true;

    setSelectedEvent(events);
    setPhotos([]);
    setOffset(0);
    setHasMore(true);
    fetchCategories(0);
  }, [Id, events]); // Dependencies unchanged

  // IntersectionObserver setup for infinite scrolling
  const lastPhotoRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Fetching more photos...");
          fetchCategories(offset);

        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchCategories, offset]
  );

  // const handleAddPhotos = async (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   setIsLoading(true);
  //   try {
  //     const compressedFiles = await compressImages(files);
  //     await uploadImages(compressedFiles, Id);

  //     // Option A: Re-fetch but don't clear first
  //     setOffset(0);
  //     setHasMore(true);
  //     await fetchCategories(0);   // ⬅️ await ensures photos refill before render
  //   } catch (error) {
  //     console.error("Failed to upload images:", error);
  //     alert("Failed to upload images: " + (error.response?.data?.detail || error.message));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  // const handleDelete = (index) => {
  //   setPhotos((prev) => prev.filter((_, i) => i !== index));
  // };

  return (
    // <SidebarLayout>
      <div className="min-h-screen bg-[#FdF8F3] text-[#292929] p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-center w-full">
            {selectedEvent ? selectedEvent.Name : "Unknown Title"}
          </h1>

        </div>

        <PhotoGridDisplay images={photos}  lastPhotoRef={lastPhotoRef} />

        {isLoading && (
          <div className="text-center my-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-2">Loading more images...</p>
          </div>
        )}

        {!hasMore && photos.length > 0 && (
          <div className="text-center my-4">
            <p>No more images to load.</p>
          </div>
        )}
      </div>
 
  );
};

export default GalleryEvent;