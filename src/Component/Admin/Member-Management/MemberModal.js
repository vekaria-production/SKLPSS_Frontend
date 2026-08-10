import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOptions } from "../../../hooks/useOptions";
import { getDriveImageUrl } from "./../../../utils/getGoogleDriveImage"


const MemberModal = ({ mode, formData, setFormData, onCancel, onSave, isGuest }) => {
  const [errors, setErrors] = useState({});
  // const [positions, setPositions] = useState([]);
  const {
    position,
    refresh,
    loading: optionsLoading,
    errors: optinoErrors
  } = useOptions();
  // console.log("Positions from useOptions:", position);
  const [preview, setPreview] = useState(null);
  const [modalIsGuest, setModalIsGuest] = useState(isGuest);
  const [countryCode, setCountryCode] = useState("+248");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    setErrors({});
  }, [formData]);

  useEffect(() => {
    if (formData?.Contact) {
      const contactStr = String(formData.Contact).trim();
      if (contactStr.startsWith("+91")) {
        setCountryCode("+91");
        setPhoneNumber(contactStr.slice(3).trim());
      } else if (contactStr.startsWith("91") && contactStr.length === 12) {
        setCountryCode("+91");
        setPhoneNumber(contactStr.slice(2).trim());
      } else if (contactStr.startsWith("+248")) {
        setCountryCode("+248");
        setPhoneNumber(contactStr.slice(4).trim());
      } else if (contactStr.startsWith("248") && contactStr.length === 10) {
        setCountryCode("+248");
        setPhoneNumber(contactStr.slice(3).trim());
      } else {
        setCountryCode("+248");
        setPhoneNumber(contactStr);
      }
    } else {
      setCountryCode("+248");
      setPhoneNumber("");
    }
  }, [formData?.Contact]);

  const handlePhoneChange = (newCode, newNumber) => {
    setCountryCode(newCode);
    setPhoneNumber(newNumber);
    const cleanNum = newNumber.trim();
    const fullContact = cleanNum ? `${newCode}${cleanNum}` : "";
    setFormData((prev) => ({ ...prev, Contact: fullContact }));
  };

  if (!formData) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.Fname?.trim()) newErrors.Fname = "First name is required.";
    if (!formData.LName?.trim()) newErrors.LName = "Last name is required.";
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email || "")) {
      newErrors.Email = "Invalid email.";
    }

    const cleanPhone = (phoneNumber || "").trim().replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.Contact = "Mobile number is required.";
    } else if (countryCode === "+248" && cleanPhone.length !== 7) {
      newErrors.Contact = "Use a 7-digit Seychelles mobile number.";
    } else if (countryCode === "+91" && cleanPhone.length !== 10) {
      newErrors.Contact = "Use a 10-digit Indian mobile number.";
    } else if (cleanPhone.length < 5 || cleanPhone.length > 15) {
      newErrors.Contact = "Invalid mobile number length.";
    }

    if (!formData.Gender) newErrors.Gender = "Gender is required.";
    if (!formData.Dob) newErrors.Dob = "Date of birth is required.";
    if (!formData.Position) newErrors.Position = "Designation is required.";
    return newErrors;
  };


  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const isEdit = mode === "edit";
    const payload = new FormData();

    // Normalize values for backend
    const genderValue =
      formData.Gender === "M" || formData.Gender === "F" ? formData.Gender : null;
    const positionValue = formData.Position ? Number(formData.Position) : null;

    // Append fields
    const appendIfValid = (key, value) => {
      if (value !== null && value !== undefined && value !== "") {
        payload.append(key, value);
      }
    };

    appendIfValid("Fname", formData.Fname);
    appendIfValid("MName", formData.MName);
    appendIfValid("LName", formData.LName);
    appendIfValid("Gender", genderValue);
    appendIfValid("Dob", new Date(formData.Dob).toISOString().slice(0, 10));
    appendIfValid("Position", positionValue);
    appendIfValid("Email", formData.Email);
    appendIfValid("Contact", formData.Contact);
    appendIfValid("BloodGroup", formData.BloodGroup);
    appendIfValid("Address", formData.Address);
    appendIfValid("Village", formData.Village);
    appendIfValid("Occupation", formData.Occupation);

    // File upload (only if present)
    if (formData.Image instanceof File) {
      payload.append("profileImage", formData.Image);
    }

    // Endpoint URL & method
    const url = isEdit
      ? `${process.env.REACT_APP_NETWORK}/updateMember/${formData.Id}`
      : `${process.env.REACT_APP_NETWORK}/addMember`;

    try {
      const response = await axios({
        method: isEdit ? "put" : "post",
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Pass updated/added member back to parent
      onSave(response.data);

    } catch (error) {
      console.error("Error submitting form:", error);
      const message =
        error.response?.data?.detail ||
        `Failed to ${isEdit ? "update" : "add"} member. Please try again.`;
      alert(message);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto">
      <div className="bg-white w-full max-w-2xl mx-auto my-10 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4">
          {mode === "edit"
            ? modalIsGuest
              ? "Edit Guest"
              : "Edit Member"
            : modalIsGuest
            ? "Add New Guest"
            : "Add New Member"}
        </h2>

        <div className="space-y-4">

          {/* First, Middle & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                name="Fname"
                type="text"
                value={formData.Fname || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              {errors.Fname && <p className="text-red-500 text-sm">{errors.Fname}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Middle Name</label>
              <input
                name="MName"
                type="text"
                value={formData.MName || ""}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                name="LName"
                type="text"
                value={formData.LName || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              {errors.LName && <p className="text-red-500 text-sm">{errors.LName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="Email"
              type="email"
              value={formData.Email || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.Email && <p className="text-red-500 text-sm">{errors.Email}</p>}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <div className="flex gap-2 items-center">
              <select
                value={countryCode}
                onChange={(e) => handlePhoneChange(e.target.value, phoneNumber)}
                className="bg-gray-100 border rounded px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F48F0F] cursor-pointer"
              >
                <option value="+248">🇸🇨 +248</option>
                <option value="+91">🇮🇳 +91</option>
              </select>
              <input
                name="ContactNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(countryCode, e.target.value)}
                placeholder={countryCode === "+248" ? "7-digit number" : "10-digit number"}
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F48F0F]"
              />
            </div>
            {errors.Contact && <p className="text-red-500 text-sm mt-1">{errors.Contact}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <div className="flex gap-4 mt-1">
              {["M", "F"].map((g) => (
                <label key={g} className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="Gender"
                    value={g}
                    checked={formData.Gender === g}
                    onChange={handleChange}
                  />
                  {g === "M" ? "Male" : "Female"}
                </label>
              ))}
            </div>
            {errors.Gender && <p className="text-red-500 text-sm">{errors.Gender}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              name="Dob"
              type="date"
              value={formData.Dob || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.Dob && <p className="text-red-500 text-sm">{errors.Dob}</p>}
          </div>

          {/* Designation */}
          {!modalIsGuest ? (
            <div>
              <label className="block text-sm font-medium">Designation</label>
              <select
                name="Position"
                value={formData.Position || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select Designation</option>
                {position
                  .filter((pos) => pos[0] !== 6)
                  .map((pos) => (
                    <option key={pos[0]} value={pos[0]}>{pos[1]}</option>
                  ))}
              </select>
              {errors.Position && <p className="text-red-500 text-sm">{errors.Position}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium">Designation</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="Guest"
                  disabled
                  className="flex-1 bg-gray-100 border rounded px-3 py-2 text-sm"
                />
                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalIsGuest(false);
                      setFormData((prev) => ({ ...prev, Position: "" }));
                    }}
                    className="px-3 py-2 text-sm bg-[#F48F0F] text-white rounded hover:opacity-90 font-medium transition"
                  >
                    Convert to Member
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Blood Group & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Blood Group</label>
              <select
                name="BloodGroup"
                value={formData.BloodGroup || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Occupation</label>
              <input
                name="Occupation"
                type="text"
                value={formData.Occupation || ""}
                onChange={handleChange}
                placeholder="Enter occupation"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Local Address & Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Local Address</label>
              <input
                name="Address"
                type="text"
                value={formData.Address || ""}
                onChange={handleChange}
                placeholder="Enter local address"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Village</label>
              <input
                name="Village"
                type="text"
                value={formData.Village || ""}
                onChange={handleChange}
                placeholder="Enter village"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, Image: file })); // store the actual File object
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreview(reader.result); // for preview only
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border rounded px-3 py-2 text-sm"
            />

          {formData.Image && (
            <div className="mt-2">
              <p className="text-sm mb-1">Preview:</p>
              <img
                src={
                  formData.Image instanceof File
                    ? URL.createObjectURL(formData.Image)
                    : formData.Image
                }
                alt="Preview"
                className="h-32 w-32 object-cover rounded border"
              />
            </div>
          )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm rounded bg-[#F48F0F] text-white hover:opacity-90"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MemberModal;
