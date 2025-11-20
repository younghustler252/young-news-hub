import React, { useState, useMemo } from "react";
import {
  useAllUsers,
  useToggleUserBan,
  useToggleAdminRole,
} from "../../hooks/useAdmin";
import { toast } from "react-hot-toast";
import { FullScreenSpinner } from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import { format } from "date-fns";
import { UserCheck, UserX, ShieldOff, Shield } from "lucide-react";

const UserManagement = () => {
  const [filter, setFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); // "ban" | "unban" | "promote" | "demote"
  const [banReason, setBanReason] = useState("");

  const { data, isLoading, isError } = useAllUsers();
  const { mutate: toggleBan, isPending: isBanLoading } = useToggleUserBan();
  const { mutate: toggleRole, isPending: isRoleLoading } = useToggleAdminRole();

  const userList = data?.users || [];

  // Filtering with memo for performance
  const filteredUsers = useMemo(() => {
    const term = filter.toLowerCase();
    return userList.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term)
    );
  }, [filter, userList]);

  if (isLoading) return <FullScreenSpinner />;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load users.
      </div>
    );

  const openActionModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);

    if (action === "ban") setBanReason("");
  };

  const handleConfirmAction = () => {
    if (!selectedUser) return;

    if (actionType === "ban") {
      toggleBan(
        { userId: selectedUser._id, action: "ban", reason: banReason },
        {
          onSuccess: (res) => toast.success(res.message),
          onError: (err) => toast.error(err.message),
        }
      );
    }

    if (actionType === "unban") {
      toggleBan(
        { userId: selectedUser._id, action: "unban" },
        {
          onSuccess: (res) => toast.success(res.message),
          onError: (err) => toast.error(err.message),
        }
      );
    }

    if (actionType === "promote" || actionType === "demote") {
      const newRole = actionType === "promote" ? "admin" : "user";

      toggleRole(
        { userId: selectedUser._id, role: newRole },
        {
          onSuccess: () =>
            toast.success(
              actionType === "promote"
                ? "User promoted to admin"
                : "User demoted"
            ),
          onError: (err) => toast.error(err.message),
        }
      );
    }

    setSelectedUser(null);
    setActionType(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <input
          type="text"
          placeholder="Search user..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none w-full md:w-64"
        />
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No users found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white shadow-sm rounded-lg border">
              <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        {user.role === "admin" ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                            <Shield size={14} /> Admin
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                            <ShieldOff size={14} /> User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.isBanned ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                            <UserX size={14} /> Banned
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                            <UserCheck size={14} /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {user.createdAt
                          ? format(new Date(user.createdAt), "PP")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            openActionModal(
                              user,
                              user.isBanned ? "unban" : "ban"
                            )
                          }
                          disabled={isBanLoading}
                          className={`px-3 py-1 rounded-md flex items-center gap-1 text-sm ${
                            user.isBanned
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {user.isBanned ? (
                            <UserCheck size={16} />
                          ) : (
                            <UserX size={16} />
                          )}
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>

                        <button
                          onClick={() =>
                            openActionModal(
                              user,
                              user.role === "admin" ? "demote" : "promote"
                            )
                          }
                          disabled={isRoleLoading}
                          className={`px-3 py-1 rounded-md flex items-center gap-1 text-sm ${
                            user.role === "admin"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <ShieldOff size={16} />
                          ) : (
                            <Shield size={16} />
                          )}
                          {user.role === "admin" ? "Demote" : "Promote"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow-sm p-4 border flex flex-col space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium text-gray-800">{user.name}</h2>
                    <span className="text-gray-500 text-sm">
                      {user.createdAt
                        ? format(new Date(user.createdAt), "PP")
                        : "-"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm">{user.email}</p>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <Shield size={14} />
                      ) : (
                        <ShieldOff size={14} />
                      )}
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>

                    <span
                      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        user.isBanned
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBanned ? (
                        <UserX size={14} />
                      ) : (
                        <UserCheck size={14} />
                      )}
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() =>
                        openActionModal(user, user.isBanned ? "unban" : "ban")
                      }
                      disabled={isBanLoading}
                      className={`px-3 py-1 rounded-md flex items-center gap-1 text-sm ${
                        user.isBanned
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {user.isBanned ? (
                        <UserCheck size={16} />
                      ) : (
                        <UserX size={16} />
                      )}
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>

                    <button
                      onClick={() =>
                        openActionModal(
                          user,
                          user.role === "admin" ? "demote" : "promote"
                        )
                      }
                      disabled={isRoleLoading}
                      className={`px-3 py-1 rounded-md flex items-center gap-1 text-sm ${
                        user.role === "admin"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <ShieldOff size={16} />
                      ) : (
                        <Shield size={16} />
                      )}
                      {user.role === "admin" ? "Demote" : "Promote"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!actionType}
        onClose={() => {
          setSelectedUser(null);
          setActionType(null);
        }}
        title={
          actionType === "ban"
            ? "Ban User"
            : actionType === "unban"
            ? "Unban User"
            : actionType === "promote"
            ? "Promote to Admin"
            : "Demote User"
        }
      >
        <div className="space-y-3">
          <p>
            Are you sure you want to <strong>{actionType}</strong>{" "}
            {selectedUser?.name}?
          </p>

          {actionType === "ban" && (
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Enter ban reason (optional)"
            />
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setSelectedUser(null);
                setActionType(null);
              }}
              className="px-4 py-2 bg-gray-100 rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
