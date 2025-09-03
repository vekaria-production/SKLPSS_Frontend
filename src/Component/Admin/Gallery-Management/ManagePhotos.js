import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import PhotoGridDisplay from "../../UI/PhotoGrid/PhotoGridDisplay";
import SidebarLayout from "../reusable/SidebarLayout";
import axios from "axios";
import { compressImages } from "../reusable/ImageCompressor";

const uploadImages = async (files, Id) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file); // "files" must match the FastAPI parameter name
  });

  try {
    const response = await axios.post(
      `http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/updateEventImage/${Id}`,
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

const ManagePhotos = () => {
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
        `http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/getEventImages/${Id}?offset=${currentOffset}&limit=${limit}`,
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

  const handleAddPhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      const compressedFiles = await compressImages(files);
      await uploadImages(compressedFiles, Id);

      // Option A: Re-fetch but don't clear first
      setOffset(0);
      setHasMore(true);
      await fetchCategories(0);   // ⬅️ await ensures photos refill before render
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert("Failed to upload images: " + (error.response?.data?.detail || error.message));
    } finally {
      setIsLoading(false);
    }
  };


  const handleDelete = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-[#FdF8F3] text-[#292929] p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-center w-100">
            {selectedEvent ? selectedEvent.Name : "Unknown Title"}
          </h1>
          <label
            className={`bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-center rounded-md cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Uploading..." : "Add photos"}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleAddPhotos}
              disabled={isLoading}
            />
          </label>
        </div>

        <PhotoGridDisplay images={photos} onDelete={handleDelete} lastPhotoRef={lastPhotoRef} />

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
    </SidebarLayout>
  );
};

export default ManagePhotos;