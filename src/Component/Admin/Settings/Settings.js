

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import SidebarLayout from "../reusable/SidebarLayout";
import CustomTable from "../reusable/CustomTable";
import DeleteConfirmation from "../reusable/DeleteConfirmation";
import AddRoleModal from "../reusable/AddRoleModal";
import EditUserModal from "../reusable/EditUserModal";
import axios from "axios";

function convertRoles(data) {

  return data.map(role => {
    const permissions = {};

    role.permissions.forEach(p => {
      const [action, ...resourceParts] = p.split("_");
      const resource = resourceParts.join("_");

      if (!permissions[resource]) {
        permissions[resource] = {};
      }
      permissions[resource][action] = true;
    });

    return {
      id: role.id,
      name: role.name,
      permissions
    };
  });
}

const currentUser = { id: 1, name: "Yagnik", role: "admin" }; // Replace with auth context later

// const initialRoles = [
//   {
//     id: "admin",
//     name: "Admin",
//     permissions: {
//       events: { view: true, add: true, edit: true, delete: true },
//       gallery: { view: true, add: true, edit: true, delete: false },
//       members: { view: true, add: true, edit: true, delete: false },
//     },
//   },
//   {
//     id: "editor",
//     name: "Editor",
//     permissions: {
//       events: { view: true, add: true, edit: false, delete: false },
//       gallery: { view: true, add: true, edit: false, delete: false },
//       members: { view: true, add: false, edit: false, delete: false },
//     },
//   },
// ];

const initialUsers = [
  { id: 1, name: "Yagnik", email: "yagnik@example.com", role: "admin" },
];

const Settings = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState(initialUsers);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  async function handleDelete(){
    if (!itemToDelete) return;
    console.log(itemToDelete);
    if (itemToDelete.roles) {
          try {
                await axios.delete(`${process.env.REACT_APP_NETWORK}/users/${itemToDelete.id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              });

          } catch (error) {
              console.info("Reload");
              return null;
          }    
    } else {
          try {
                await axios.delete(`${process.env.REACT_APP_NETWORK}/roles/${itemToDelete.id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              });

          } catch (error) {
              console.info("Reload");
              return null;
          } 
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
    fetchRoles();
    fetchUsers();
  };

  // 🔽 Save user (create or update)
  const saveUser = async (user) => {
    try {
      if (selectedUser) {
        // 🔄 Update
        await axios.put(`${process.env.REACT_APP_NETWORK}/users/${selectedUser.id}`, user, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        // ➕ Create
        await axios.post(`${process.env.REACT_APP_NETWORK}/users`, user, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      await fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setShowEditUserModal(false);
      setSelectedUser(null);
    }
  };

  // 🔽 Save role (create or update)
  const saveRole = async (role) => {
    console.log(role);
    try {
      if (selectedRole) {
        // 🔄 Update existing role
        await axios.put(
          `${process.env.REACT_APP_NETWORK}/roles/${selectedRole.id}`,
          role, // { name: "Editor", permissions: ["view_event", "add_gallery"] }
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // ➕ Create new role
        await axios.post(
          `${process.env.REACT_APP_NETWORK}/roles`,
          role, // { name: "Editor", permissions: ["view_event", "add_gallery"] }
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      // ✅ Refresh roles from backend (instead of local update)
      await fetchRoles();

    } catch (error) {
      console.error("Error saving role:", error);
    } finally {
      setShowRoleModal(false);
      setSelectedRole(null);
    }
  };

  async function fetchRoles() {
          try {
            // Fetch members
            const roles = await axios.get(
              `${process.env.REACT_APP_NETWORK}/roles`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            
            let roleData = roles.data;
            if (typeof membersData === 'string') {
              roleData = JSON.parse(roleData);
            }
            // console.log(convertRoles(roleData));
            setRoles(convertRoles(roleData));
            console.log(roleData);
            // return roleData
            // setMembersList(membersData);

            // Use the position from useOptions
            // setPositionList(position);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
  }

  async function fetchUsers() {
          try {
            // Fetch members
            const users = await axios.get(
              `${process.env.REACT_APP_NETWORK}/users`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            
            let userData = users.data;
            if (typeof membersData === 'string') {
              userData = JSON.parse(userData);
            }
            // console.log(userData);
            setUsers(userData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
  }

  useEffect(() => {


    fetchRoles();
    fetchUsers();
  }, [])

  const roleCols = [
    {
      key: "name",
      label: "Role Name",
    },
    {
      key: "modules",
      label: "Modules Access",
      render: (_, row) =>
        Object.entries(row.permissions)
          .filter(([, perms]) => Object.values(perms).some(Boolean))
          .map(([mod]) => mod.charAt(0).toUpperCase() + mod.slice(1))
          .join(", "),
    },
  ];

  const userCols = [
    { key: "username", label: "User Name" },
    // { key: "email", label: "Email" },
    { key: "roles", label: "Roles" },
  ];


  // if (currentUser?.name !== "Administrator") {
  if (currentUser?.role !== "admin") {
    
    return (
      <SidebarLayout>
        <div className="p-6 text-center text-gray-600 text-lg">
          ⚠️ You do not have permission to access this page.
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-4 sm:p-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#292929]">Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage roles and user access.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-4 py-2 border border-[#F48F0F] text-[#F48F0F] bg-white hover:bg-[#fff4e0] rounded-lg text-sm shadow-sm"
              onClick={() => setShowRoleModal(true)}
            >
              <Plus size={16} /> Add Type
            </button>
            <button
              className="flex items-center gap-1 px-4 py-2 bg-[#F48F0F] text-white hover:bg-[#dc7d00] rounded-lg text-sm shadow-sm"
              onClick={() => setShowEditUserModal(true)}
            >
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>

        {/* Roles Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-[#292929]">Roles</h3>
          <CustomTable
            cols={roleCols}
            rows={roles.map((role) => ({
              ...role,
              actions:
                role.id === 1 ? (
                  <span className="text-gray-400 italic text-sm">
                    Protected
                  </span>
                ) : (
                  <>
                    <button
                      className="text-[#F48F0F] flex items-center text-sm"
                      onClick={() => {
                        setSelectedRole(role);
                        setShowRoleModal(true);
                      }}
                    >
                      <Pencil size={14} className="mr-1" />
                    </button>
                    <button
                      className="text-red-500 flex items-center text-sm"
                      onClick={() => {
                        setItemToDelete(role);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={14} className="mr-1" />
                    </button>
                  </>
                ),
            }))}
          />
        </section>

        {/* Users Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-[#292929]">Users</h3>
          <CustomTable
            cols={userCols}
            rows={users.map((user) => ({
              ...user,
              actions: (
                <>
                  <button
                    className="text-[#F48F0F] hover:underline flex items-center text-sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditUserModal(true);
                    }}
                  >
                    <Pencil size={14} className="mr-1" />
                  </button>
                  <button
                    className="text-red-500 hover:underline flex items-center text-sm"
                    onClick={() => {
                      setItemToDelete(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 size={14} className="mr-1" />
                  </button>
                </>
              ),
            }))}
          />
        </section>

        {/* Add Role Modal */}
        {showRoleModal && (
          <AddRoleModal
            role={selectedRole}
            onClose={() => {
              setShowRoleModal(false);
              setSelectedRole(null);
            }}
            onSave={saveRole}   // ✅ API call happens only in Settings
          />
        )}


        {/* Edit User Modal */}
        {showEditUserModal && (
          <EditUserModal
            user={selectedUser}
            roles={roles}
            onClose={() => {
              setShowEditUserModal(false);
              setSelectedUser(null);
            }}
            onSave={saveUser} // ✅ API save
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteConfirmation
            title="Confirm Deletion"
            message="Are you sure you want to delete this item?"
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default Settings;
