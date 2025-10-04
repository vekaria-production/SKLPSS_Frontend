import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilter, FaCog } from "react-icons/fa";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
// import initialMembers from "../../../assets/MembersArray";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import MemberModal from "../Member-Management/MemberModal";
import axios from "axios";
const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState(null);
  const [mode, setMode] = useState(""); 
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    membership_id: true,
    name: true,
    Dob: true,
    Gender: true,
    mobile: true,
    Email: true,
    designation: true,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ Position: "", Gender: "" });

  const designationOptions = [...new Set(members.map((m) => m.Position))];
  const genderOptions = [...new Set(members.map((m) => m.Gender))];

  const filteredMembers = members.filter((member) => {
    const matchName = member.Fname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchDesignation = filters.Position
      ? member.Position === filters.Position
      : true;
    const matchGender = filters.Gender
      ? member.Gender.toLowerCase() === filters.Gender.toLowerCase()
      : true;
    return matchName && matchDesignation && matchGender;
  });

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
      name: "",
      Dob: "",
      Gender: "M",
      Contact: "",
      Email: "",
      designation: "",
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

  const handleSaveForm = () => {
    if (mode === "edit") {
      const updated = members.map((m) =>
        m.membership_id === formData.membership_id ? formData : m
      );
      setMembers(updated);
    } else if (mode === "add") {
      setMembers((prev) => [...prev, formData]);
      alert(`Membership Id: ${formData.membership_id}`);
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        let data = response.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        // // console.log("Fetched API data:", data);
        // return data;
        setMembers(data);
        console.log("Fetched Categories:", data);
        // setCategoryList(data);
      } catch (error) {
        console.info("Reload");
        return null;
      }

    }
    fetchMembers();
  }, []);

  return (
    <SidebarLayout>
      <div className="w-full bg-[#FDF8F3] p-2 pb-0  overflow-hidden">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-semibold">Member Management</h1>
          <button
            onClick={handleAddClick}
            className="bg-[#F48F0F] text-white md:px-4 px-2 py-1 md:py-2 rounded-xl hover:opacity-90"
          >
            Add New Member
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative">
          <div className="flex items-center bg-white rounded-full px-4 py-2 w-full sm:max-w-md border border-gray-300">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by Name"
              className="outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="relative">
              <FaFilter
                className="text-[#F48F0F] cursor-pointer text-xl hover:opacity-70"
                onClick={() => setShowFilters(!showFilters)}
              />
              {showFilters && (
                <div className="absolute top-10 right-0 w-72 max-w-[90vw] bg-white shadow-lg rounded-md p-4 z-20 border border-gray-200 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1">
                      Designation
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={filters.designation}
                      onChange={(e) =>
                        setFilters({ ...filters, designation: e.target.value })
                      }
                    >
                      <option value="">All</option>
                      {designationOptions.map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={filters.Gender}
                      onChange={(e) =>
                        setFilters({ ...filters, Gender: e.target.value })
                      }
                    >
                      <option value="">All</option>
                      {genderOptions.map((g, i) => (
                        <option key={i} value={g}>
                          {g === "M" ? "Male" :  g === "F" ? "Female" : "Other"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <FaCog
                className="text-[#F48F0F] cursor-pointer text-xl hover:opacity-70"
                onClick={() => setShowSettings(!showSettings)}
              />
              {showSettings && (
                <div className="absolute top-8 right-0 bg-white shadow-lg rounded-md p-4 z-20 border border-gray-200">
                  {Object.keys(visibleColumns).map((col) => (
                    <label key={col} className="block text-sm mb-2 capitalize">
                      <input
                        type="checkbox"
                        checked={visibleColumns[col]}
                        onChange={() =>
                          setVisibleColumns({
                            ...visibleColumns,
                            [col]: !visibleColumns[col],
                          })
                        }
                        className="mr-2"
                      />
                      Show {col.replace("_", " ")}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        
        <CustomTable
          cols={[
            // { key: "Id", label: "ID" },
            { key: "Fname", label: "Name" },
            // { key: "Dob", label: "Date of Birth" },
            // { key: "Gender", label: "Gender" },
            { key: "Contact", label: "Mobile" },
            { key: "Email", label: "Email" },
            // { key: "Position", label: "Designation" },
          ]}

          rows={filteredMembers.map((m) => ({
            ...m,
            Gender: m.Gender === "M" ? "Male" : m.Gender === "F" ? "Female" : "Other",
            actions: (
              <>
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
        />

        {/* Edit/Add Modal */}
        {formData && (
          <MemberModal
            mode={mode}
            formData={formData}
            setFormData={setFormData}
            onCancel={handleCancelForm}
            onSave={handleSaveForm}
          />
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <DeleteConfirmation
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => handleDelete(deleteTarget.Id)}
            title="Delete Member"
            message={`Are you sure you want to delete ${deleteTarget.name}?`}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ManageMembers;
