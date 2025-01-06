"use client";

// pages/users.tsx
import { useState, useEffect } from "react";

type User = {
  _id: string;
  username: string;
  email: string;
  wallet_address: string;
  created_at: string;
  last_login_time: string;
  total_articles: number;
  total_reviews: number;
  total_courses: number;
  status: string;
  role: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    wallet_address: "",
  });
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch all users when the page loads
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    if (data?.message === "User created successfully!") {
      setUsers([...users, data.data]);
      setNewUser({ username: "", email: "", password: "", wallet_address: "" });
    } else {
      alert(data?.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const response = await fetch("/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await response.json();
    if (data?.message === "User deleted successfully") {
      setUsers(users.filter((user) => user._id !== userId));
    } else {
      alert(data?.message);
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: editUser?._id,
        updates: editUser,
      }),
    });

    const data = await response.json();
    if (data?.message === "User updated successfully") {
      setUsers(
        users.map((user) => (user._id === editUser?._id ? editUser : user))
      );
      setEditUser(null);
    } else {
      alert(data?.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <form onSubmit={handleCreateUser} className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New User</h2>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border rounded"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
          <input
            type="email"
            className="w-full p-3 border rounded"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="w-full p-3 border rounded"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <input
            type="text"
            className="w-full p-3 border rounded"
            placeholder="Wallet Address"
            value={newUser.wallet_address}
            onChange={(e) =>
              setNewUser({ ...newUser, wallet_address: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded"
          >
            Create User
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.status}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-400 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border rounded"
                placeholder="Username"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
                required
              />
              <input
                type="email"
                className="w-full p-3 border rounded"
                placeholder="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                className="w-full p-3 border rounded"
                placeholder="Wallet Address"
                value={editUser.wallet_address}
                onChange={(e) =>
                  setEditUser({ ...editUser, wallet_address: e.target.value })
                }
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-3 rounded"
              >
                Update User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
