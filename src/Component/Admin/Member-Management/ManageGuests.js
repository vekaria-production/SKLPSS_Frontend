import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import MemberModal from "../Member-Management/MemberModal";
import axios from "axios";
import { useOptions } from "../../../hooks/useOptions";
import useDebounce from "../../../hooks/useDebounce";

const ManageGuests = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mode, setMode] = useState(""); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalIsGuest, setModalIsGuest] = useState(true);

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
    Position: false,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showFiltersRow, setShowFiltersRow] = useState(false);
  const [filters, setFilters] = useState({ Gender: "" });

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
    setModalIsGuest(true);
    setMode("add");
    setFormData({
      membership_id: generateNewId(),
      Fname: "",
      LName: "",
      Dob: "",
      Gender: "M",
      Contact: "",
      Email: "",
      Position: 6, // Fixed to Guest position ID
      BloodGroup: "",
    });
  };

  const handleEditClick = (member) => {
    setModalIsGuest(true);
    setMode("edit");
    setFormData({ ...member });
  };

  const handleConvertClick = (member) => {
    setModalIsGuest(false);
    setMode("edit");
    setFormData({ ...member, Position: "" });
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

      setMembers((prev) => prev.filter((m) => m.Id !== id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting guest:", error);
      alert("Failed to delete guest. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_NETWORK}/getMemberList`, {
          params: {
            limit: 10000,
            position: 6, // Fixed to only query Guests
            name: debouncedSearchTerm || undefined,
            contact: debouncedContactFilter || undefined,
            email: debouncedEmailFilter || undefined,
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
        console.error("Error fetching guests:", error);
      }
    }
    fetchMembers();
  }, [debouncedSearchTerm, debouncedContactFilter, debouncedEmailFilter, filters.Gender]);

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-2 pb-0 min-h-[550px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Guest Management</h1>
          <button
            onClick={handleAddClick}
            className="bg-[#F48F0F] text-white md:px-4 px-2 py-1 md:py-2 rounded-xl hover:opacity-90"
          >
            Add New Guest
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleConvertClick(m)}
                  className="bg-[#F48F0F]/10 text-[#F48F0F] border border-[#F48F0F] px-2 py-0.5 rounded hover:bg-[#F48F0F] hover:text-white transition text-xs font-semibold"
                >
                  Convert
                </button>
                <FaEdit
                  className="text-[#F48F0F] cursor-pointer"
                  onClick={() => handleEditClick(m)}
                />
                <FaTrash
                  className="text-[#F48F0F] cursor-pointer"
                  onClick={() => setDeleteTarget(m)}
                />
              </div>
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
            if (col.key === "actions") {
              if (filters.Gender || searchTerm || contactFilter || emailFilter) {
                return (
                  <button
                    onClick={() => {
                      setFilters({ Gender: "" });
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
            isGuest={modalIsGuest}
          />
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <DeleteConfirmation
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.Id)}
            title="Delete Guest"
            message={`Are you sure you want to delete ${deleteTarget.Fname} ${deleteTarget.LName || ""}?`}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ManageGuests;
