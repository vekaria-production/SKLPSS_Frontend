import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import SidebarLayout from "../reusable/SidebarLayout";
import axios from "axios";
import { compressImages } from "../reusable/ImageCompressor";
import { FaCheck, FaTimes, FaTrash, FaClock } from "react-icons/fa";
import { useAuth } from "../../../Context/Auth/AuthContext";

const uploadImages = async (files, Id) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await axios.post(
    `${process.env.REACT_APP_NETWORK}/updateEventImage/${Id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

const StatusBadge = ({ approved }) => {
  if (approved === true)
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <FaCheck size={9} /> Approved
      </span>
    );
  if (approved === false)
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        <FaClock size={9} /> Pending
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
      <FaClock size={9} /> Pending
    </span>
  );
};

const ManagePhotos = () => {
  const { permissions } = useAuth();
  const hasPermission = (field) => permissions.includes(field);

  const { Id } = useParams();
  const [photos, setPhotos] = useState([]); // [{Id, Link, Approved}]
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [deletingLink, setDeletingLink] = useState(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const limit = 20;
  const observer = useRef();
  const location = useLocation();
  const events = location.state?.event;

  // Facebook post states
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [facebookMessage, setFacebookMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // Fetch all images (including pending) for admin
  const fetchPhotos = useCallback(
    async (currentOffset) => {
      if (!hasMore || isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_NETWORK}/getEventImages/${Id}/pending?offset=${currentOffset}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let data = response.data;
        if (typeof data === "string") data = JSON.parse(data);
        setPhotos((prev) => [...prev, ...data]);
        setOffset(currentOffset + limit);
        setHasMore(data.length === limit);
      } catch (error) {
        console.info("No more photos loaded.");
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [Id, hasMore, isLoading]
  );

  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    setSelectedEvent(events);
    setPhotos([]);
    setOffset(0);
    setHasMore(true);
    fetchPhotos(0);
  }, [Id, events]);

  // Infinite scroll
  const lastPhotoRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPhotos(offset);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchPhotos, offset]
  );

  // Upload new photos (auto-approved by backend for admin)
  const handleAddPhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsLoading(true);
    try {
      const compressedFiles = await compressImages(files);
      await uploadImages(compressedFiles, Id);
      // Refresh
      setPhotos([]);
      setOffset(0);
      setHasMore(true);
      hasRun.current = false;
      fetchPhotos(0);
    } catch (error) {
      alert("Failed to upload images: " + (error.response?.data?.detail || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Approve or reject a single image
  const handleApprove = async (imageId, approved) => {
    setApprovingId(imageId);
    try {
      await axios.patch(
        `${process.env.REACT_APP_NETWORK}/approveImage/${imageId}?approved=${approved}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPhotos((prev) =>
        prev.map((p) => (p.Id === imageId ? { ...p, Approved: approved } : p))
      );
    } catch (error) {
      alert("Failed to update approval status.");
    } finally {
      setApprovingId(null);
    }
  };

  // Delete image
  const handleDelete = async (link) => {
    setDeletingLink(link);
    try {
      await axios.delete(
        `${process.env.REACT_APP_NETWORK}/deleteImage?imageId=${encodeURIComponent(link)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPhotos((prev) => prev.filter((p) => p.Link !== link));
    } catch (error) {
      alert("Failed to delete image.");
    } finally {
      setDeletingLink(null);
    }
  };

  const pendingCount = photos.filter(
    (p) => p.Approved === false || p.Approved === null || p.Approved === undefined
  ).length;

  const handleFacebookPostSubmit = async () => {
    if (selectedPhotos.length === 0) {
      alert("Please select at least one image to post on Facebook.");
      return;
    }
    setIsPosting(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_NETWORK}/postEventToFacebook`,
        {
          message: facebookMessage,
          images: selectedPhotos,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Post shared successfully on Facebook!");
      
      // Update local state to mark photos as posted to Facebook
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          selectedPhotos.includes(photo.Link)
            ? { ...photo, PostedToFacebook: true }
            : photo
        )
      );

      setShowFacebookModal(false);
      setFacebookMessage("");
      setSelectedPhotos([]);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to post to Facebook: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-[#FDF8F3] text-[#292929] p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{selectedEvent?.Name || "Event Gallery"}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {photos.length} image{photos.length !== 1 ? "s" : ""}
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-semibold">
                  · {pendingCount} pending approval
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {hasPermission("share_gallery") && (
              <button
                onClick={() => {
                  if (selectedPhotos.length === 0) {
                    alert("Please select at least one image to post on Facebook.");
                    return;
                  }
                  setShowFacebookModal(true);
                }}
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share on Facebook ({selectedPhotos.length})
              </button>
            )}

            {hasPermission("post_gallery") && (
              <label
                className={`flex-shrink-0 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg cursor-pointer font-medium transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Uploading..." : "+ Add Photos"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleAddPhotos}
                  disabled={isLoading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Photo Grid with per-image controls */}
        {photos.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No images yet</p>
            <p className="text-sm">Upload photos or share the public link for members to upload</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {photos.map((photo, index) => {
              const isLast = index === photos.length - 1;
              const isPending = photo.Approved !== true;
              return (
                <div
                  key={photo.Id}
                  ref={isLast ? lastPhotoRef : null}
                  className={`relative group rounded-xl overflow-hidden shadow-sm border-2 transition-all duration-200 ${
                    isPending
                      ? "border-amber-300 bg-amber-50"
                      : "border-transparent bg-white"
                  }`}
                >
                  {/* Select Checkbox (Overlay top-right) */}
                  {hasPermission("share_gallery") && (
                    <div className="absolute top-2 right-2 z-10 flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-[#1877F2] cursor-pointer rounded border-gray-300 focus:ring-[#1877F2]"
                        checked={selectedPhotos.includes(photo.Link)}
                        onChange={() => {
                          if (selectedPhotos.includes(photo.Link)) {
                            setSelectedPhotos(selectedPhotos.filter((link) => link !== photo.Link));
                          } else {
                            setSelectedPhotos([...selectedPhotos, photo.Link]);
                          }
                        }}
                      />
                    </div>
                  )}
                  {/* Image */}
                  <div
                    className="aspect-square cursor-zoom-in"
                    onClick={() => setLightboxSrc(photo.Link)}
                  >
                    <img
                      src={photo.Link}
                      alt=""
                      className={`w-full h-full object-cover transition-opacity duration-200 ${
                        isPending ? "opacity-70" : "opacity-100"
                      }`}
                      loading="lazy"
                    />
                    {isPending && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <FaClock className="text-amber-400 text-2xl drop-shadow" />
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <StatusBadge approved={photo.Approved} />
                    
                    {/* Facebook Posted Badge */}
                    {photo.PostedToFacebook === true && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-white bg-[#1877F2] border border-[#1877F2]/30 px-1.5 py-0.5 rounded-full shadow-sm w-fit">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Posted
                      </span>
                    )}
                  </div>

                  {/* Action buttons overlay */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Approve / Reject */}
                    <div className="flex gap-1.5">
                      {photo.Approved !== true && (
                        <button
                          title="Approve"
                          disabled={approvingId === photo.Id}
                          onClick={() => handleApprove(photo.Id, true)}
                          className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow"
                        >
                          <FaCheck size={10} />
                        </button>
                      )}
                      {photo.Approved !== false && (
                        <button
                          title="Reject"
                          disabled={approvingId === photo.Id}
                          onClick={() => handleApprove(photo.Id, false)}
                          className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors shadow"
                        >
                          <FaTimes size={10} />
                        </button>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      title="Delete"
                      disabled={deletingLink === photo.Link}
                      onClick={() => handleDelete(photo.Link)}
                      className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-8 gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-[#F48F0F] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading images...</span>
          </div>
        )}

        {!hasMore && photos.length > 0 && (
          <p className="text-center text-gray-400 text-sm py-6">All images loaded</p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightboxSrc(null)}
          >
            &times;
          </button>
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Facebook Post Modal */}
      {showFacebookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] text-[#292929]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <h2 className="font-bold text-xl text-gray-800">Create Facebook Post</h2>
              </div>
              <button 
                onClick={() => {
                  if (!isPosting) {
                    setShowFacebookModal(false);
                    setFacebookMessage("");
                  }
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Selected Images Thumbnails */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Selected Images ({selectedPhotos.length})
                </label>
                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                  {selectedPhotos.map((url, index) => {
                    const isAlreadyPosted = photos.find((p) => p.Link === url)?.PostedToFacebook;
                    return (
                      <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {isAlreadyPosted && (
                          <div className="absolute bottom-0.5 left-0.5 bg-[#1877F2] text-white rounded-full p-1 shadow-sm" title="Already shared on Facebook">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            const newSelection = selectedPhotos.filter((p) => p !== url);
                            setSelectedPhotos(newSelection);
                            if (newSelection.length === 0) {
                              setShowFacebookModal(false);
                              setFacebookMessage("");
                            }
                          }}
                          className="absolute top-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center text-[10px] transition-colors"
                          title="Remove"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message Box */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Write something...
                </label>
                <textarea
                  value={facebookMessage}
                  onChange={(e) => setFacebookMessage(e.target.value)}
                  placeholder="What's on your mind? Type your post description here..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition-all resize-none h-32 bg-white"
                  disabled={isPosting}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFacebookModal(false);
                  setFacebookMessage("");
                }}
                disabled={isPosting}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFacebookPostSubmit}
                disabled={isPosting}
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPosting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post to Facebook"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
};

export default ManagePhotos;