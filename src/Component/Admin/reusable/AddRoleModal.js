import React, { useState, useEffect } from "react";

// Define modules + actions once
const modules = ["events", "gallery", "members", "category", "setting", "dashboard", "meetings", "documents", "registration"];
const actions = ["view", "add", "edit", "delete"];

const AddRoleModal = ({ role, onClose, onSave }) => {
  const [roleName, setRoleName] = useState(role?.name || "");
  const [permissions, setPermissions] = useState(
    role?.permissions || Object.fromEntries(modules.map(m => [m, {}]))
  );

  useEffect(() => {
    if (role) {
      setRoleName(role.name || "");
      setPermissions(role.permissions || Object.fromEntries(modules.map(m => [m, {}])));
    }
  }, [role]);

  const handleCheckboxChange = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action],
      },
    }));
  };
  const handleSave = () => {
    if (!roleName.trim()) {
      alert("Role name is required");
      return;
    }

    const permissionList = [];
    for (const module of modules) {
      const allActions = module === "gallery" ? [...actions, "share", "post"] : actions;
      for (const action of allActions) {
        if (permissions[module]?.[action]) {
          permissionList.push(`${action}_${module}`);
        }
      }
    }

    const payload = {
      name: roleName.trim(),
      permissions: permissionList,
    };

    console.log("Saving role payload:", payload);
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-[#292929]">
          {role ? "Edit Role" : "Add Role"}
        </h3>

        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Role Name"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
        />

        {/* Permissions Grid */}
        <div className="overflow-auto">
          <table className="w-full text-sm border border-gray-300 mt-2">
            <thead className="bg-[#F2E6DA] text-[#292929]">
              <tr>
                <th className="text-left px-3 py-2">Module</th>
                {actions.map((action) => (
                  <th key={action} className="px-3 py-2 capitalize">{action}</th>
                ))}
                <th className="px-3 py-2 capitalize">Share</th>
                <th className="px-3 py-2 capitalize">Post</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module} className="border-t border-gray-200">
                  <td className="font-medium px-3 py-2 capitalize text-[#292929]">
                    {module}
                  </td>
                  {actions.map((action) => (
                    <td key={action} className="text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.[action] || false}
                        onChange={() => handleCheckboxChange(module, action)}
                        className="accent-[#F48F0F]"
                      />
                    </td>
                  ))}
                  {/* Share Column */}
                  <td className="text-center">
                    {module === "gallery" ? (
                      <input
                        type="checkbox"
                        checked={permissions[module]?.["share"] || false}
                        onChange={() => handleCheckboxChange(module, "share")}
                        className="accent-[#F48F0F]"
                      />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  {/* Post Column */}
                  <td className="text-center">
                    {module === "gallery" ? (
                      <input
                        type="checkbox"
                        checked={permissions[module]?.["post"] || false}
                        onChange={() => handleCheckboxChange(module, "post")}
                        className="accent-[#F48F0F]"
                      />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#F48F0F] text-white rounded-lg text-sm shadow"
          >
            {role ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
