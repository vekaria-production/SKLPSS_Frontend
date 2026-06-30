import React, { useEffect, useState } from "react";
import SidebarLayout from "../reusable/SidebarLayout";
import axios from "axios";
import { FaFilter } from "react-icons/fa";
import DocumentTable from "./DocumentTable";
import DocumentFilters from "./DocumentFilters";
import UploadDocumentModal from "./UploadDocumentModal";
import EditDocumentModal from "./EditDocumentModal";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import useDebounce from "../../../hooks/useDebounce";

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    status: "",
  });
  const [showFiltersRow, setShowFiltersRow] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const fetchDocuments = async (nameVal = debouncedSearchTerm, filterOpts = filters) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_NETWORK}/documents`,
        {
          params: {
            name: nameVal || undefined,
            category: filterOpts.category || undefined,
            status: filterOpts.status || undefined,
            offset: 0,
            limit: 1000,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments(debouncedSearchTerm, filters);
  }, [debouncedSearchTerm, filters.category, filters.status]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_NETWORK}/documents/${deleteTarget.DocumentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDocuments((prev) =>
        prev.filter((d) => d.DocumentId !== deleteTarget.DocumentId)
      );
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete document");
    }
  };

  return (
    <SidebarLayout>
      <div className="w-full bg-[var(--color-bg)] p-3">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Document Management</h1>
          <button className="btn-primary" onClick={() => setShowUpload(true)}>
            Upload Documents
          </button>
        </div>

        {/* Table */}
        <DocumentTable
          documents={documents}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          showFiltersRow={showFiltersRow}
          setShowFiltersRow={setShowFiltersRow}
        />

        {/* Upload */}
        {showUpload && (
          <UploadDocumentModal
            onClose={() => setShowUpload(false)}
            onUploaded={() => fetchDocuments(debouncedSearchTerm, filters)}
          />
        )}

        {/* Edit */}
        {editTarget && (
          <EditDocumentModal
            document={editTarget}
            onClose={() => setEditTarget(null)}
            onUpdated={() => fetchDocuments(debouncedSearchTerm, filters)}
          />
        )}

        {/* Delete */}
        {deleteTarget && (
          <DeleteConfirmation
            title="Delete Document"
            message={`Delete "${deleteTarget.DocumentName}"?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default DocumentManagement;
