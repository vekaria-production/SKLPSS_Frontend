import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog, FaIdCard, FaPrint } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import MemberModal from "../Member-Management/MemberModal";
import axios from "axios";
import { useOptions } from "../../../hooks/useOptions";
import useDebounce from "../../../hooks/useDebounce";
import { QRCodeSVG } from "qrcode.react";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mode, setMode] = useState(""); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedCardMember, setSelectedCardMember] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    Id: false,
    Fname: true,
    Dob: false,
    Gender: false,
    Contact: true,
    Email: true,
    Position: true,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showFiltersRow, setShowFiltersRow] = useState(false);
  const [filters, setFilters] = useState({ Position: "", Gender: "" });

  const settingsRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSettings &&
        settingsRef.current &&
        !settingsRef.current.contains(e.target)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const debouncedContactFilter = useDebounce(contactFilter, 400);
  const debouncedEmailFilter = useDebounce(emailFilter, 400);

  const { position = [] } = useOptions();

  const designationOptions = position.filter((p) => p[0] !== 6).map((p) => p[0]);
  const genderOptions = ["M", "F"];

  const getPositionName = (id) => {
    if (!position) return id;
    const pos = position.find((p) => p[0] === id);
    return pos ? pos[1] : id;
  };

  const filteredMembers = members;

  const generateNewId = () => {
    const existingIds = members.map((m) => m.membership_id);
    let count = members.length + 1;
    let id;
    do {
      id = `SKL${String(count).padStart(3, "0")}`;
      count++;
    } while (existingIds.includes(id));
    return id;
  };

  const handleAddClick = () => {
    setMode("add");
    setFormData({
      membership_id: generateNewId(),
      Fname: "",
      LName: "",
      Dob: "",
      Gender: "M",
      Contact: "",
      Email: "",
      Position: "",
    });
  };

  const handleEditClick = (member) => {
    setMode("edit");
    setFormData({ ...member });
  };

  const handleCancelForm = () => {
    setFormData(null);
    setMode("");
  };

  const handleSaveForm = (savedData) => {
    const dataToSave = savedData || formData;
    if (mode === "edit") {
      const updated = members.map((m) =>
        m.Id === dataToSave.Id ? dataToSave : m
      );
      setMembers(updated);
    } else if (mode === "add") {
      setMembers((prev) => [...prev, dataToSave]);
    }
    handleCancelForm();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_NETWORK}/deleteMember/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update frontend state only if backend deletion succeeds
      setMembers((prev) => prev.filter((m) => m.Id !== id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member. Please try again.");
    }
  };


  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getMemberList`, {
          params: {
            limit: 10000,
            excludePosition: 6,
            name: debouncedSearchTerm || undefined,
            contact: debouncedContactFilter || undefined,
            email: debouncedEmailFilter || undefined,
            position: filters.Position || undefined,
            gender: filters.Gender || undefined,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        let data = response.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }
    fetchMembers();
  }, [debouncedSearchTerm, debouncedContactFilter, debouncedEmailFilter, filters.Position, filters.Gender]);

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-2 pb-0 min-h-[550px]">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-semibold">Member Management</h1>
          <button
            onClick={handleAddClick}
            className="bg-[#F48F0F] text-white md:px-4 px-2 py-1 md:py-2 rounded-xl hover:opacity-90"
          >
            Add New Member
          </button>
        </div>

        {/* Settings */}
        <div className="flex justify-end mb-4 relative">
          <div className="relative" ref={settingsRef}>
            <FaCog
              className="text-[#F48F0F] cursor-pointer text-xl hover:opacity-70 transition-transform hover:rotate-45 duration-300"
              onClick={() => setShowSettings(!showSettings)}
            />
            {showSettings && (
              <div className="absolute top-10 right-0 w-60 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-4 z-30 border border-gray-100 transition-all duration-200 ease-out origin-top-right">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 pb-1.5 border-b border-gray-100">
                  Visible Columns
                </div>
                <div className="space-y-1.5">
                  {Object.keys(visibleColumns).map((col) => {
                    const labels = {
                      Id: "ID",
                      Fname: "Name",
                      Dob: "Date of Birth",
                      Gender: "Gender",
                      Contact: "Mobile",
                      Email: "Email",
                      Position: "Designation",
                    };
                    return (
                      <div
                        key={col}
                        onClick={() =>
                          setVisibleColumns({
                            ...visibleColumns,
                            [col]: !visibleColumns[col],
                          })
                        }
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F48F0F]/10 cursor-pointer transition-all duration-150 group"
                      >
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#F48F0F] transition-colors duration-150 select-none">
                          {labels[col] || col}
                        </span>
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                            visibleColumns[col] ? "bg-[#F48F0F]" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out transform ${
                              visibleColumns[col] ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        
        <CustomTable
          cols={[
            { key: "Id", label: "ID" },
            { key: "Fname", label: "Name", filterable: true },
            { key: "Dob", label: "Date of Birth" },
            { key: "Gender", label: "Gender", filterable: true },
            { key: "Contact", label: "Mobile", filterable: true },
            { key: "Email", label: "Email", filterable: true },
            { key: "Position", label: "Designation", filterable: true },
          ]}

          rows={filteredMembers.map((m) => ({
            ...m,
            Gender: m.Gender === "M" ? "Male" : m.Gender === "F" ? "Female" : "Other",
            Position: getPositionName(m.Position),
            actions: (
              <>
                <FaIdCard
                  className="text-[#F48F0F] cursor-pointer mr-2"
                  title="Generate ID Card"
                  onClick={() => setSelectedCardMember(m)}
                />
                <FaEdit
                  className="text-[#F48F0F] cursor-pointer mr-2"
                  onClick={() => handleEditClick(m)}
                />
                <FaTrash
                  className="text-[#F48F0F] cursor-pointer"
                  onClick={() => setDeleteTarget(m)}
                />
              </>
            ),
          }))}
          visibleCols={visibleColumns}
          showFiltersRow={showFiltersRow}
          onToggleFilters={() => setShowFiltersRow(!showFiltersRow)}
          filterRow={showFiltersRow ? (col) => {
            if (col.key === "Fname") {
              return (
                <input
                  type="text"
                  placeholder="Filter name..."
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              );
            }
            if (col.key === "Gender") {
              return (
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
                  value={filters.Gender}
                  onChange={(e) =>
                    setFilters({ ...filters, Gender: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {genderOptions.map((g, i) => (
                    <option key={i} value={g}>
                      {g === "M" ? "Male" : g === "F" ? "Female" : "Other"}
                    </option>
                  ))}
                </select>
              );
            }
            if (col.key === "Contact") {
              return (
                <input
                  type="text"
                  placeholder="Filter mobile..."
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
                  value={contactFilter}
                  onChange={(e) => setContactFilter(e.target.value)}
                />
              );
            }
            if (col.key === "Email") {
              return (
                <input
                  type="text"
                  placeholder="Filter email..."
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                />
              );
            }
            if (col.key === "Position") {
              return (
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-normal bg-white"
                  value={filters.Position}
                  onChange={(e) =>
                    setFilters({ ...filters, Position: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {designationOptions.map((d, i) => (
                    <option key={i} value={d}>
                      {getPositionName(d)}
                    </option>
                  ))}
                </select>
              );
            }
            if (col.key === "actions") {
              if (filters.Position || filters.Gender || searchTerm || contactFilter || emailFilter) {
                return (
                  <button
                    onClick={() => {
                      setFilters({ Position: "", Gender: "" });
                      setSearchTerm("");
                      setContactFilter("");
                      setEmailFilter("");
                    }}
                    className="text-xs text-[#F48F0F] hover:underline font-semibold"
                  >
                    Clear
                  </button>
                );
              }
            }
            return null;
          } : null}
        />

        {/* Edit/Add Modal */}
        {formData && (
          <MemberModal
            mode={mode}
            formData={formData}
            setFormData={setFormData}
            onCancel={handleCancelForm}
            onSave={handleSaveForm}
            isGuest={false}
          />
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <DeleteConfirmation
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.Id)}
            title="Delete Member"
            message={`Are you sure you want to delete ${deleteTarget.Fname} ${deleteTarget.LName || ""}?`}
          />
        )}

        {/* ID Card Modal */}
        {selectedCardMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                .print-card-container,
                .print-card-container * {
                  visibility: visible !important;
                }
                .print-card-container {
                  position: absolute !important;
                  left: 50% !important;
                  top: 50% !important;
                  transform: translate(-50%, -50%) !important;
                  box-shadow: none !important;
                  border: 1px solid #F48F0F !important;
                  background: #FFFDF9 !important;
                }
              }
            `}</style>
            
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 flex flex-col items-center">
              {/* ID Card Render Area */}
              <div className="print-card-container w-[320px] h-[480px] bg-gradient-to-b from-[#FFFDF9] to-[#FDF4E7] border-2 border-[#F48F0F]/30 rounded-3xl shadow-xl flex flex-col items-center p-5 relative overflow-hidden">
                {/* Background accents */}
                <div className="absolute top-[-50px] right-[-50px] w-36 h-36 bg-[#F48F0F]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-[-50px] left-[-50px] w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Header */}
                <div className="w-full flex flex-col items-center border-b border-[#F48F0F]/15 pb-3.5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#F48F0F] to-amber-500 flex items-center justify-center text-[8px] text-white font-extrabold">S</span>
                    <span className="text-sm font-extrabold tracking-wider text-gray-800 uppercase">SKLPSS</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#F48F0F]/80 uppercase tracking-[0.15em] mt-0.5">Official Identity Card</span>
                </div>

                {/* Profile Photo */}
                <div className="relative mb-3">
                  {selectedCardMember.Image ? (
                    <img
                      src={selectedCardMember.Image}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-[#F48F0F]/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F48F0F] to-amber-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-md ring-4 ring-[#F48F0F]/20 uppercase">
                      {selectedCardMember.Fname[0]}{selectedCardMember.LName ? selectedCardMember.LName[0] : ""}
                    </div>
                  )}
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 bg-[#F48F0F] text-white text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    MEMBER
                  </div>
                </div>

                {/* Name and Designation */}
                <div className="text-center w-full mb-3">
                  <h2 className="text-lg font-extrabold text-gray-800 leading-tight tracking-wide uppercase">
                    {selectedCardMember.Fname} {selectedCardMember.LName || ""}
                  </h2>
                  <div className="inline-block bg-[#F48F0F]/10 text-[#F48F0F] font-extrabold text-[10px] px-3 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">
                    {getPositionName(selectedCardMember.Position)}
                  </div>
                </div>

                {/* Dynamic QR Code */}
                <div className="mb-4">
                  <QRCodeSVG
                    value={selectedCardMember.Id.toString()}
                    size={110}
                    level="H"
                    includeMargin={true}
                    className="p-2 bg-white border border-[#F48F0F]/10 rounded-2xl shadow-sm"
                  />
                </div>

                {/* Detail Info Grid */}
                <div className="w-full grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] text-gray-600 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-gray-100/50 mt-auto">
                  <div>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">Member ID</span>
                    <span className="font-extrabold text-gray-800">#{selectedCardMember.Id}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">Blood Group</span>
                    <span className="font-extrabold text-gray-800">{selectedCardMember.BloodGroup || "N/A"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">Mobile</span>
                    <span className="font-extrabold text-gray-800">{selectedCardMember.Contact || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 w-full">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-[#F48F0F] hover:bg-[#F48F0F]/90 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#F48F0F]/15 transition-all text-sm cursor-pointer"
                >
                  <FaPrint /> Print Card
                </button>
                <button
                  onClick={() => setSelectedCardMember(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition-all text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ManageMembers;
