import React, { useState, useEffect, useRef } from "react";
import SidebarLayout from "../reusable/SidebarLayout";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// import categories from "../../../assets/EventCategories";
import axios from 'axios';
import { useOptions } from "../../../hooks/useOptions"
import { getDriveImageUrl } from "./../../../utils/getGoogleDriveImage"

const EventForm = () => {

  const location = useLocation();
  
  var events = location.state?.event;

  const navigate = useNavigate();
  const { Type, Id } = useParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    fromDate: "",
    toDate: "",
    status: "",
    category: "",
    description: "",
    });

  const [coverImage, setCoverImage] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
    
  const {
    categories: categoriesData,
    refresh,
    loading: optionsLoading,
    errors: optinoErrors
  } = useOptions();

  const categories = categoriesData.map(([id, name]) => ({ id, name }));
  console.log(categories)
  // Determine Edit Mode and Pre-fill Data
  useEffect(() => {
    if (Type === "Edit-Event" && Id && events) {
      setIsEditMode(true);
      // // console.log(events, "Get Events")
      const eventToEdit = events
      // console.log(eventToEdit)
      if (eventToEdit) {
        // // console.log(eventToEdit, "Data")
        setFormData({
          title: eventToEdit.Name,
          fromDate: eventToEdit.From || eventToEdit.date || "",
          toDate: eventToEdit.To || eventToEdit.date || "",
          status: eventToEdit.Status || "",
          category: eventToEdit.Category || "",
          description: eventToEdit.Description || "",
        });
        if (eventToEdit.Poster) {

          setCoverImage(eventToEdit.Poster);

        }
      }
    }
  }, [Type, Id, events]);

  // Auto-status calculation
  useEffect(() => {
    const today = new Date();
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    console.log(formData)
    let newStatus = "";
    if (from && to) {
      if (today < from) newStatus = "Upcoming";
      else if (today >= from && today <= to) newStatus = "Ongoing";
      else if (today > to) newStatus = "Past";
    }
    setFormData((prev) => ({ ...prev, status: newStatus }));
  }, [formData.fromDate, formData.toDate]);

  const validateForm = () => {
    const requiredFields = [
      "title",
      "fromDate",
      "toDate",
      "category",
      "description",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const isNew = !isEditMode;
    const formPayload = new FormData();
    // console.log(categories.find((item) => item.name == formData.category)?.id)
    formPayload.append("Name", formData.title);
    formPayload.append("From", formData.fromDate);
    formPayload.append("To", formData.toDate);
    formPayload.append("Status", formData.status);
    formPayload.append("CategoryID", categories.find((item) => item.name == formData.category)?.id  );  // Fixed typo: Sategory → Category
    formPayload.append("Description", formData.description);

    if (coverImage instanceof File) {
      formPayload.append("Poster", coverImage);
    } else if (!isNew && !coverImage) {
      // User deleted the image during update
      formPayload.append("coverRemoved", "true");
    }
    // for (let [key, value] of formPayload.entries()) {
    //   console.log(key, value);
    // }
    console.log(Id)
    try {
      const url = isNew
        ? `http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/event`
        : `http://${process.env.REACT_APP_NETWORK}:${process.env.REACT_APP_PORT}/updateEvent/${Id}`;

      const method = isNew ? "post" : "put";

      const response = await axios({
        method: method,
        url: url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        data: formPayload,
      });

      alert(isNew ? "Event added!" : "Event updated!");
      navigate(-1);
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to save event.");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
// console.log(categories)
  return (
    <SidebarLayout>
      <div className="p-6 min-h-screen max-w-5xl mx-auto rounded-xl border border-[#E1D5C9] bg-[#fdf8f3]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {isEditMode ? "Edit Event" : "Schedule New Event"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Save
            </button>
          </div>
        </div>

        {/* Event Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Event Title:</label>

          {isEditMode ? (
            <input
              type="text"
              value={formData.title}
              disabled
              className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md bg-gray-100 cursor-not-allowed"
            />
          ) : (
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md bg-white"
            />
          )}

          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium mb-1">From Date:</label>
            <input
              type="datetime-local"
              value={formData.fromDate}
              onChange={(e) =>
                setFormData({ ...formData, fromDate: e.target.value })
              }
              className={`w-full px-3 py-2 border ${
                errors.fromDate ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400`}
            />
            {errors.fromDate && (
              <p className="text-red-500 text-sm">{errors.fromDate}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">To Date:</label>
            <input
              type="datetime-local"
              value={formData.toDate}
              onChange={(e) =>
                setFormData({ ...formData, toDate: e.target.value })
              }
              className={`w-full px-3 py-2 border ${
                errors.toDate ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400`}
            />
            {errors.toDate && (
              <p className="text-red-500 text-sm">{errors.toDate}</p>
            )}
          </div>
        </div>

        {/* Status & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium mb-1">Status:</label>
            <input
              type="text"
              value={formData.status}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Category:</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`w-full px-3 py-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400`}
            >

              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.Id}>
                  {category.name}

                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Event Description</label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="This will appear in the gallery page of this event"
            className={`w-full px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Upload Section */}
        <div className="flex items-center justify-between mb-2">
          <label className="font-medium">Upload cover photo:</label>
          {["Ongoing", "Past"].includes(formData.status) && (
            <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">
              Add photos <br /> for gallery
            </button>
          )}
        </div>

        <div
          className="border-2 border-dashed border-gray-400 rounded-xl p-8 bg-white flex flex-col items-center justify-center text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            hidden
          />

          {!coverImage ? (
            <>
              <button
                className="bg-[#F48F0F] text-white px-4 py-1 rounded-md hover:bg-orange-600"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                  }
                }}
              >
                Browse
              </button>
              <p className="mt-2 text-sm text-gray-600">OR Drop Here</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-1">Selected Image:</p>
              <img
                src={coverImage instanceof File
                      ? URL.createObjectURL(coverImage)
                      : coverImage
                    }
                alt="Preview"
                className="max-h-40 rounded-md shadow mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Replace
                </button>
                <button
                  onClick={() => {
                    setCoverImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = null;
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default EventForm;
