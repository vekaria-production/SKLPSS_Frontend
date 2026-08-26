import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog, FaIdCard, FaPrint, FaCheck, FaTimes } from "react-icons/fa";
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

  const [showArrangeModal, setShowArrangeModal] = useState(false);
  const [localPositions, setLocalPositions] = useState([]);
  const [cutoffId, setCutoffId] = useState("");
  const [savingPositions, setSavingPositions] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

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

  const { position = [], refresh } = useOptions();

  const designationOptions = position.filter((p) => p[0] !== 6).map((p) => p[0]);

  useEffect(() => {
    if (showArrangeModal) {
      const mapped = position.map(([id, name, parentId, sortOrder = 0, isVisible = true]) => ({
        Id: id,
        Name: name,
        Parent: parentId,
        SortOrder: sortOrder,
        IsVisible: isVisible
      })).sort((a, b) => a.SortOrder - b.SortOrder);
      
      setLocalPositions(mapped);
      
      const visiblePositions = mapped.filter(p => p.IsVisible);
      if (visiblePositions.length > 0) {
        setCutoffId(visiblePositions[visiblePositions.length - 1].Id);
      } else {
        setCutoffId("");
      }
    }
  }, [showArrangeModal, position]);

  const handleShiftUp = (index) => {
    if (index === 0) return;
    const newList = [...localPositions];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    
    const updated = newList.map((p, i) => ({ ...p, SortOrder: i + 1 }));
    setLocalPositions(updated);
  };

  const handleShiftDown = (index) => {
    if (index === localPositions.length - 1) return;
    const newList = [...localPositions];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    
    const updated = newList.map((p, i) => ({ ...p, SortOrder: i + 1 }));
    setLocalPositions(updated);
  };

  const handleCutoffChange = (selectedId) => {
    setCutoffId(selectedId);
    if (!selectedId) {
      setLocalPositions(prev => prev.map(p => ({ ...p, IsVisible: false })));
      return;
    }
    const cutoffIndex = localPositions.findIndex(p => p.Id === Number(selectedId));
    const updated = localPositions.map((p, i) => ({
      ...p,
      IsVisible: i <= cutoffIndex
    }));
    setLocalPositions(updated);
  };

  const handleToggleVisible = (id) => {
    const updated = localPositions.map(p => {
      if (p.Id === id) {
        return { ...p, IsVisible: !p.IsVisible };
      }
      return p;
    });
    setLocalPositions(updated);
  };

  const handleSavePositions = async () => {
    setSavingPositions(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_NETWORK}/updatePositionList`,
        localPositions.map(p => ({
          Id: p.Id,
          Name: p.Name,
          SortOrder: p.SortOrder,
          IsVisible: p.IsVisible
        })),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      refresh("PositionList");
      setShowArrangeModal(false);
      alert("Designations saved successfully!");
    } catch (error) {
      console.error("Error updating designations:", error);
      alert("Failed to save designations. Please try again.");
    } finally {
      setSavingPositions(false);
    }
  };

  const handleDeletePosition = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_NETWORK}/deletePosition/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setLocalPositions(prev => prev.filter(p => p.Id !== id));
      refresh("PositionList");
      alert("Designation deleted successfully!");
    } catch (error) {
      console.error("Error deleting designation:", error);
      const msg = error.response?.data?.detail || "Failed to delete designation.";
      alert(msg);
    }
  };

  const startEditing = (p) => {
    setEditingId(p.Id);
    setEditingName(p.Name);
  };

  const saveEditingName = (id) => {
    if (!editingName.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    setLocalPositions(prev => prev.map(p => {
      if (p.Id === id) {
        return { ...p, Name: editingName.trim() };
      }
      return p;
    }));
    setEditingId(null);
    setEditingName("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };
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
      MName: "",
      LName: "",
      Dob: "",
      Gender: "M",
      Contact: "",
      OfficeNumber: "",
      Email: "",
      Position: "",
      BloodGroup: "",
      Address: "",
      Village: "",
      Island: "",
      District: "",
      Occupation: "",
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowArrangeModal(true)}
              className="border border-[#F48F0F] text-[#F48F0F] bg-white md:px-4 px-2 py-1 md:py-2 rounded-xl hover:bg-[#fff4e0] transition-colors font-medium text-sm cursor-pointer"
            >
              Arrange Designations
            </button>
            <button
              onClick={handleAddClick}
              className="bg-[#F48F0F] text-white md:px-4 px-2 py-1 md:py-2 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm cursor-pointer"
            >
              Add New Member
            </button>
          </div>
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
            Fname: [m.Fname, m.MName, m.LName].filter(Boolean).join(" "),
            Gender: m.Gender === "M" ? "Male" : m.Gender === "F" ? "Female" : "Other",
            Position: getPositionName(m.Position),
            actions: (
              <>
                <FaIdCard
                  size={18}
                  className="text-[#F48F0F] hover:text-[#dc7d00] cursor-pointer mr-3 transition-colors"
                  title="Generate ID Card"
                  onClick={() => setSelectedCardMember(m)}
                />
                <FaEdit
                  size={18}
                  className="text-[#F48F0F] hover:text-[#dc7d00] cursor-pointer mr-3 transition-colors"
                  onClick={() => handleEditClick(m)}
                />
                <FaTrash
                  size={18}
                  className="text-red-500 hover:text-red-600 cursor-pointer transition-colors"
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
                  width: 320px !important;
                  height: 480px !important;
                }
              }
            `}</style>
            
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 flex flex-col items-center">
              {/* ID Card Render Area */}
              <div className="print-card-container w-[400px] h-[600px] rounded-3xl overflow-hidden shadow-xl flex justify-center items-center">
                <img
                  src={`${process.env.REACT_APP_NETWORK}/get_member_card/${selectedCardMember.Id}?format=png`}
                  alt="Member ID Card"
                  className="w-full h-full object-cover"
                />
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

        {showArrangeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-[#292929]">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Arrange Designations & Visibility</h2>
                <button
                  onClick={() => setShowArrangeModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {/* Visibility Cutoff Dropdown */}
                <div className="bg-orange-50/50 border border-[#F48F0F]/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F48F0F]">Front Page Visibility Cutoff</h3>
                    <p className="text-xs text-gray-500 mt-0.5 font-normal">Select the lowest designation that should be visible on the public committee tree.</p>
                  </div>
                  <select
                    value={cutoffId}
                    onChange={(e) => handleCutoffChange(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:border-[#F48F0F] outline-none min-w-[200px]"
                  >
                    <option value="">None (Hide All)</option>
                    {localPositions.map(p => (
                      <option key={p.Id} value={p.Id}>{p.Name}</option>
                    ))}
                  </select>
                </div>

                 {/* List Table */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm border-collapse text-left">
                    <thead className="bg-[#EDE4DC] text-[#292929]">
                      <tr>
                        <th className="px-4 py-2.5 font-bold">Designation</th>
                        <th className="px-4 py-2.5 font-bold text-center w-[120px]">Order</th>
                        <th className="px-4 py-2.5 font-bold text-center w-[120px]">Visible</th>
                        <th className="px-4 py-2.5 font-bold text-center w-[120px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {localPositions.map((p, idx) => (
                        <tr key={p.Id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {editingId === p.Id ? (
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:border-[#F48F0F] outline-none w-full font-normal"
                              />
                            ) : (
                              <span>{p.Name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center gap-1.5">
                              <button
                                onClick={() => handleShiftUp(idx)}
                                disabled={idx === 0}
                                className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:hover:bg-gray-100 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() => handleShiftDown(idx)}
                                disabled={idx === localPositions.length - 1}
                                className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:hover:bg-gray-100 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={p.IsVisible}
                              onChange={() => handleToggleVisible(p.Id)}
                              className="accent-[#F48F0F] w-4.5 h-4.5 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              {editingId === p.Id ? (
                                <>
                                  <button
                                    onClick={() => saveEditingName(p.Id)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                                    title="Save"
                                  >
                                    <FaCheck size={14} />
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Cancel"
                                  >
                                    <FaTimes size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditing(p)}
                                    className="p-1.5 text-[#F48F0F] hover:bg-orange-50 rounded transition-colors cursor-pointer"
                                    title="Edit Name"
                                  >
                                    <FaEdit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePosition(p.Id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowArrangeModal(false)}
                  disabled={savingPositions}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePositions}
                  disabled={savingPositions}
                  className="bg-[#F48F0F] hover:bg-[#dc7d00] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {savingPositions ? "Saving..." : "Save Changes"}
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
