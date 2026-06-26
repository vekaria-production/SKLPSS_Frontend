import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import CustomTable from "../reusable/CustomTable";
import CategoryModal from "./CategoryModal";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import SidebarLayout from "../reusable/SidebarLayout";
import events from "../../../assets/eventsarray";
import axios from "axios";
import useDebounce from "../../../hooks/useDebounce";

const ManageCategories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [eventsList] = useState(events);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFiltersRow, setShowFiltersRow] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const handleSave = (cat) => {
    
    setCategoryList((prev) => {

    return prev.some((c) => c.id === cat.id)
        ? prev.map((c) => (c.id === cat.id ? cat : c))
        : [...prev, cat];
    });
  };

  async function handleDelete(){
    try {
        await axios.delete(`${process.env.REACT_APP_NETWORK}/Categorys/${deleteTarget.Id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

    } catch (error) {
      console.info("Reload");
      return null;
    }    
    
    setRefresh(!refresh);
    setShowDelete(false);
  };

  const handleViewEvents = (categoryId) => {
    const linked = eventsList.filter((e) => e.category === categoryId);
    if (linked.length === 0) {
      alert("No events linked with this category.");
    } else {
      alert("Linked Events:\n" + linked.map((e) => `- ${e.title}`).join("\n"));
    }
  };

  const categoryCols = [
    { key: "Name", label: "Category", filterable: true },
    {
      key: "event_count",
      label: "Events",
    },
  ];

  async function fetchCategories(nameVal = debouncedSearchTerm) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_NETWORK}/Categorys`, {
        params: { name: nameVal || undefined },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      console.log("Fetched Categories:", data);
      setCategoryList(data);
    } catch (error) {
      console.info("Reload");
      return null;
    }
  }

  useEffect(() => {
    fetchCategories(debouncedSearchTerm);
  }, [debouncedSearchTerm, refresh]);
  
  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Categories</h2>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-[#F48F0F] text-white rounded"
          >
            Add Category
          </button>
        </div>

        <CustomTable
          cols={categoryCols}
          rows={categoryList.map((row) => ({
            ...row,
            actions: (
              <div className="flex gap-3 items-center">
                {/* <button
                  onClick={() => handleViewEvents(row.Id)}
                  className="text-blue-500 hover:scale-105 transition"
                  title="View Events"
                >
                  <Eye size={16} />
                </button> */}
                <button
                  onClick={() => {
                    setSelectedCategory(row);
                    setShowModal(true);
                  }}
                  className="text-[#F48F0F] hover:scale-105 transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    const isUsed = eventsList.some(
                      (e) => e.category === row.Id
                    );
                    if (isUsed) {
                      alert("Can't delete, events are using this category.");
                    } else {
                      setDeleteTarget(row);
                      setShowDelete(true);
                    }
                  }}
                  className="text-red-500 hover:scale-105 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          }))}
          showFiltersRow={showFiltersRow}
          onToggleFilters={() => setShowFiltersRow(!showFiltersRow)}
          filterRow={showFiltersRow ? (col) => {
            if (col.key === "Name") {
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
            if (col.key === "actions") {
              if (searchTerm) {
                return (
                  <button
                    onClick={() => setSearchTerm("")}
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

        {showModal && (
          <CategoryModal
            category={selectedCategory}
            onSave={(cat) => {
              handleSave(cat);
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
            // refresh={() => setRefresh(!refresh)}
          />
        )}

        {showDelete && (
          <DeleteConfirmation
            title="Delete Category"
            message={`Delete ${deleteTarget.Name}? This action cannot be undone.`}
            onCancel={() => setShowDelete(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ManageCategories;
