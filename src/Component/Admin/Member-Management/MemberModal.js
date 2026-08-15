import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOptions } from "../../../hooks/useOptions";
import { 
  X, 
  User, 
  PhoneCall, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Camera, 
  ShieldCheck, 
  Mail, 
  Building2, 
  HeartPulse, 
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";

const MemberModal = ({ mode, formData, setFormData, onCancel, onSave, isGuest }) => {
  const [errors, setErrors] = useState({});
  const {
    position,
    refresh,
    loading: optionsLoading,
    errors: optionErrors
  } = useOptions();

  const [preview, setPreview] = useState(null);
  const [modalIsGuest, setModalIsGuest] = useState(isGuest);

  const [countryCode, setCountryCode] = useState("+248");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [officeCountryCode, setOfficeCountryCode] = useState("+248");
  const [officePhoneNumber, setOfficePhoneNumber] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    setErrors({});
  }, [formData]);

  // Sync Mobile Number with Country Code
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

  // Sync Office Number with Country Code
  useEffect(() => {
    if (formData?.OfficeNumber) {
      const officeStr = String(formData.OfficeNumber).trim();
      if (officeStr.startsWith("+91")) {
        setOfficeCountryCode("+91");
        setOfficePhoneNumber(officeStr.slice(3).trim());
      } else if (officeStr.startsWith("91") && officeStr.length === 12) {
        setOfficeCountryCode("+91");
        setOfficePhoneNumber(officeStr.slice(2).trim());
      } else if (officeStr.startsWith("+248")) {
        setOfficeCountryCode("+248");
        setOfficePhoneNumber(officeStr.slice(4).trim());
      } else if (officeStr.startsWith("248") && officeStr.length === 10) {
        setOfficeCountryCode("+248");
        setOfficePhoneNumber(officeStr.slice(3).trim());
      } else {
        setOfficeCountryCode("+248");
        setOfficePhoneNumber(officeStr);
      }
    } else {
      setOfficeCountryCode("+248");
      setOfficePhoneNumber("");
    }
  }, [formData?.OfficeNumber]);

  const handlePhoneChange = (newCode, newNumber) => {
    setCountryCode(newCode);
    setPhoneNumber(newNumber);
    const cleanNum = newNumber.trim();
    const fullContact = cleanNum ? `${newCode}${cleanNum}` : "";
    setFormData((prev) => ({ ...prev, Contact: fullContact }));
  };

  const handleOfficePhoneChange = (newCode, newNumber) => {
    setOfficeCountryCode(newCode);
    setOfficePhoneNumber(newNumber);
    const cleanNum = newNumber.trim();
    const fullOffice = cleanNum ? `${newCode}${cleanNum}` : "";
    setFormData((prev) => ({ ...prev, OfficeNumber: fullOffice }));
  };

  if (!formData) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.Fname?.trim()) newErrors.Fname = "First name is required.";
    if (!formData.LName?.trim()) newErrors.LName = "Last name is required.";
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email || "")) {
      newErrors.Email = "Invalid email format.";
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

    const genderValue =
      formData.Gender === "M" || formData.Gender === "F" ? formData.Gender : null;
    const positionValue = formData.Position ? Number(formData.Position) : null;

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
    appendIfValid("OfficeNumber", formData.OfficeNumber);
    appendIfValid("BloodGroup", formData.BloodGroup);
    appendIfValid("Address", formData.Address);
    appendIfValid("Village", formData.Village);
    appendIfValid("Island", formData.Island);
    appendIfValid("District", formData.District);
    appendIfValid("Occupation", formData.Occupation);

    if (formData.Image instanceof File) {
      payload.append("profileImage", formData.Image);
    }

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FDF8F3] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#E1D5C9] flex flex-col max-h-[92vh] transition-all">
        
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 bg-gradient-to-r from-[#F48F0F] via-amber-400 to-[#e1810c] w-full" />

        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E1D5C9]/60 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F48F0F] shadow-sm">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F48F0F] bg-orange-100/60 px-2 py-0.5 rounded-full">
                  SKLPSS Member Portal
                </span>
                {modalIsGuest && (
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Guest Mode
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-[#292929] mt-0.5">
                {mode === "edit"
                  ? modalIsGuest
                    ? "Edit Guest Details"
                    : "Edit Member Profile"
                  : modalIsGuest
                  ? "Register New Guest"
                  : "Add New Community Member"}
              </h2>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
          
          {/* SECTION 1: Personal Profile */}
          <div className="bg-white p-5 rounded-2xl border border-[#E1D5C9]/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F48F0F] flex items-center justify-center">
                <User size={16} />
              </div>
              <h3 className="text-sm font-bold text-[#292929] uppercase tracking-wider">
                1. Personal Details
              </h3>
            </div>

            {/* Names Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="Fname"
                  type="text"
                  value={formData.Fname || ""}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh"
                  className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                />
                {errors.Fname && <p className="text-red-500 text-xs mt-1">{errors.Fname}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Middle Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  name="MName"
                  type="text"
                  value={formData.MName || ""}
                  onChange={handleChange}
                  placeholder="e.g. Kumar"
                  className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="LName"
                  type="text"
                  value={formData.LName || ""}
                  onChange={handleChange}
                  placeholder="e.g. Patel"
                  className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                />
                {errors.LName && <p className="text-red-500 text-xs mt-1">{errors.LName}</p>}
              </div>
            </div>

            {/* Gender & DOB Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { id: "M", label: "Male", icon: "♂" },
                    { id: "F", label: "Female", icon: "♀" }
                  ].map((g) => {
                    const isSelected = formData.Gender === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, Gender: g.id })}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F48F0F] text-white border-[#F48F0F] shadow-sm"
                            : "bg-[#FDF8F3]/50 text-gray-700 border-gray-300 hover:border-[#F48F0F]"
                        }`}
                      >
                        <span className="text-base leading-none">{g.icon}</span>
                        <span>{g.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.Gender && <p className="text-red-500 text-xs mt-1">{errors.Gender}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="Dob"
                    type="date"
                    value={formData.Dob || ""}
                    onChange={handleChange}
                    className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                  />
                </div>
                {errors.Dob && <p className="text-red-500 text-xs mt-1">{errors.Dob}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Contact & Designation */}
          <div className="bg-white p-5 rounded-2xl border border-[#E1D5C9]/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F48F0F] flex items-center justify-center">
                <PhoneCall size={16} />
              </div>
              <h3 className="text-sm font-bold text-[#292929] uppercase tracking-wider">
                2. Contact & Professional Info
              </h3>
            </div>

            {/* Mobile & Office Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <select
                    value={countryCode}
                    onChange={(e) => handlePhoneChange(e.target.value, phoneNumber)}
                    className="bg-[#FDF8F3] border border-gray-300 rounded-xl px-2.5 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F48F0F] cursor-pointer"
                  >
                    <option value="+248">🇸🇨 +248</option>
                    <option value="+91">🇮🇳 +91</option>
                  </select>
                  <input
                    name="ContactNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(countryCode, e.target.value)}
                    placeholder={countryCode === "+248" ? "e.g. 2712345" : "e.g. 9876543210"}
                    className="flex-1 bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                  />
                </div>
                {errors.Contact && <p className="text-red-500 text-xs mt-1">{errors.Contact}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Office Number <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="flex gap-2 items-center">
                  <select
                    value={officeCountryCode}
                    onChange={(e) => handleOfficePhoneChange(e.target.value, officePhoneNumber)}
                    className="bg-[#FDF8F3] border border-gray-300 rounded-xl px-2.5 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F48F0F] cursor-pointer"
                  >
                    <option value="+248">🇸🇨 +248</option>
                    <option value="+91">🇮🇳 +91</option>
                  </select>
                  <input
                    name="OfficeNumberInput"
                    type="text"
                    value={officePhoneNumber}
                    onChange={(e) => handleOfficePhoneChange(officeCountryCode, e.target.value)}
                    placeholder="Office contact"
                    className="flex-1 bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    name="Email"
                    type="email"
                    value={formData.Email || ""}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                  />
                </div>
                {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Designation / Role <span className="text-red-500">*</span>
                </label>
                {!modalIsGuest ? (
                  <select
                    name="Position"
                    value={formData.Position || ""}
                    onChange={handleChange}
                    className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none cursor-pointer"
                  >
                    <option value="">-- Select Designation --</option>
                    {position
                      .filter((pos) => pos[0] !== 6)
                      .map((pos) => (
                        <option key={pos[0]} value={pos[0]}>
                          {pos[1]}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="Guest"
                      disabled
                      className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600"
                    />
                    {mode === "edit" && (
                      <button
                        type="button"
                        onClick={() => {
                          setModalIsGuest(false);
                          setFormData((prev) => ({ ...prev, Position: "" }));
                        }}
                        className="px-3 py-2 text-xs bg-[#F48F0F] text-white rounded-xl hover:bg-[#e1810c] font-semibold transition cursor-pointer"
                      >
                        Promote to Member
                      </button>
                    )}
                  </div>
                )}
                {errors.Position && <p className="text-red-500 text-xs mt-1">{errors.Position}</p>}
              </div>
            </div>

            {/* Blood Group & Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Blood Group
                </label>
                <select
                  name="BloodGroup"
                  value={formData.BloodGroup || ""}
                  onChange={handleChange}
                  className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none cursor-pointer"
                >
                  <option value="">-- Select Blood Group --</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Occupation / Profession
                </label>
                <input
                  name="Occupation"
                  type="text"
                  value={formData.Occupation || ""}
                  onChange={handleChange}
                  placeholder="e.g. Businessman, Engineer"
                  className="w-full bg-[#FDF8F3]/50 border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Address Information */}
          <div className="bg-white p-5 rounded-2xl border border-[#E1D5C9]/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F48F0F] flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <h3 className="text-sm font-bold text-[#292929] uppercase tracking-wider">
                3. Address Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local Address Box */}
              <div className="bg-[#FDF8F3]/60 p-4 rounded-xl border border-orange-100/80 space-y-3">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Local Address
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Island</label>
                    <input
                      name="Island"
                      type="text"
                      value={formData.Island || ""}
                      onChange={handleChange}
                      placeholder="e.g. Mahé, Praslin"
                      className="w-full bg-white border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                    <input
                      name="District"
                      type="text"
                      value={formData.District || ""}
                      onChange={handleChange}
                      placeholder="e.g. Victoria, Anse Royale"
                      className="w-full bg-white border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Village Address Box */}
              <div className="bg-[#FDF8F3]/60 p-4 rounded-xl border border-orange-100/80 space-y-3">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Village Address
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Village Name</label>
                  <input
                    name="Village"
                    type="text"
                    value={formData.Village || ""}
                    onChange={handleChange}
                    placeholder="e.g. Kutch Village / Native Village"
                    className="w-full bg-white border border-gray-300 focus:border-[#F48F0F] focus:ring-2 focus:ring-[#F48F0F]/20 rounded-xl px-3 py-2 text-sm transition outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Profile Image Upload */}
          <div className="bg-white p-5 rounded-2xl border border-[#E1D5C9]/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F48F0F] flex items-center justify-center">
                <Camera size={16} />
              </div>
              <h3 className="text-sm font-bold text-[#292929] uppercase tracking-wider">
                4. Profile Avatar
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#FDF8F3]/60 p-4 rounded-2xl border border-dashed border-orange-200">
              <div className="relative group">
                <img
                  src={
                    preview ||
                    (formData.Image instanceof File
                      ? URL.createObjectURL(formData.Image)
                      : formData.Image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                  }
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F48F0F] hover:bg-[#e1810c] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all">
                  <Camera size={14} />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData((prev) => ({ ...prev, Image: file }));
                        const reader = new FileReader();
                        reader.onloadend = () => setPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Upload JPG, PNG or WEBP (Max 5MB).
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 bg-white border-t border-[#E1D5C9]/60 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-[#F48F0F] hover:bg-[#e1810c] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>{mode === "edit" ? "Save Changes" : "Create Member Record"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default MemberModal;
