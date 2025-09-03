import React, { useState, useEffect } from "react";
import { Share2, Trash2, CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getDriveImageUrl } from "./../../../utils/getGoogleDriveImage";
import ImageComponent from "./../../UI/LazyImage/ImageComponent";

const PhotoGridDisplay = ({
  images = [],
  onImageClick,
  onDelete,
  onSelect,
  selectedIndexes = [],
  lastPhotoRef, // Added for infinite scrolling
  }) => {

  const location = useLocation();
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(
      location.pathname === "/Admin" || location.pathname.startsWith("/Admin/")
    );
  }, [location]);

  // Cleanup for File URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((src, index) => {
        if (src instanceof File) {
          URL.revokeObjectURL(src);
        }
      });
    };
  }, [images]);

  async function deleteImage(imageId) {
    try {
      await axios.delete(
        `http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/deleteImage`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params :{
            imageId: imageId
          }
        }
      );
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      throw new Error(error.response?.data?.detail || "Failed to delete image");
    }
  }

  return (
  <div className="flex flex-wrap gap-4 justify-start">
    {images.map((src, index) => {
      const isSelected = selectedIndexes.includes(index);
      const imageUrl = src instanceof File ? URL.createObjectURL(src) : src;
      const isLast = index === images.length - 1;

      return (
        <div
          key={index}
          ref={isLast ? lastPhotoRef : null}
          onClick={() => {
            if (isAdmin && onSelect) onSelect(index);
            else if (onImageClick) onImageClick(index);
          }}
          className={`w-64 h-64 relative group rounded-xl overflow-hidden shadow bg-white cursor-pointer transition duration-300 ${
            isSelected ? "ring-4 ring-blue-800" : ""
          }`}
        >
          <ImageComponent src={imageUrl} alt={`Image ${index}`} />

          {/* Top-right buttons (Delete + Share) */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
            {isAdmin && (
              <button
                className="bg-black/60 p-1 rounded hover:bg-black/80 z-10"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    if (!(src instanceof File)) {
                      await deleteImage(src);
                    }
                    onDelete?.(index);
                  } catch (error) {
                    alert(error.message);
                  }
                }}
              >
                <Trash2 size={16} className="text-orange-500" />
              </button>
            )}
            <button
              className="bg-black/60 p-1 rounded hover:bg-black/80 z-10"
              onClick={(e) => {
                e.stopPropagation();
                const shareUrl =
                  src instanceof File ? imageUrl : getDriveImageUrl(src);
                if (navigator.share) {
                  navigator.share({ url: shareUrl });
                } else if (
                  navigator.clipboard &&
                  navigator.clipboard.writeText
                ) {
                  navigator.clipboard
                    .writeText(shareUrl)
                    .then(() => alert("Link copied to clipboard!"))
                    .catch((err) =>
                      alert("Failed to copy: " + err.message)
                    );
                } else {
                  alert("Clipboard not supported in this browser.");
                }
              }}
            >
              <Share2 size={16} className="text-white" />
            </button>
          </div>

          {/* Selection checkmark overlay */}
          {isSelected && isAdmin && (
            <div className="absolute top-2 left-2 bg-white/90 rounded-full p-1 z-10">
              <CheckCircle size={18} className="text-blue-600" />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

};

export default PhotoGridDisplay;