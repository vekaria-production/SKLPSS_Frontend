import React from "react";
import { FaTrash, FaDownload } from "react-icons/fa";
import CustomTable from "../reusable/CustomTable";

const DocumentTable = ({ documents, onDelete }) => {
  return (
    <CustomTable
      cols={[
        { key: "DocumentName", label: "Document Name" },
        { key: "Category", label: "Category" },
        { key: "UploadedBy", label: "Uploaded By (ID)" },
        { key: "Status", label: "Status" },
        { key: "CreatedAt", label: "Uploaded On" },
      ]}
      rows={documents.map((doc) => ({
        ...doc,
        Status: doc.Status,
        CreatedAt: new Date(doc.CreatedAt).toLocaleDateString(),
        actions: (
          <>
            <FaDownload
              className="icon-action mr-3"
              onClick={() => window.open(doc.DocumentLink, "_blank")}
            />
            <FaTrash
              className="icon-action"
              onClick={() => onDelete(doc)}
            />
          </>
        ),
      }))}
    />
  );
};

export default DocumentTable;
