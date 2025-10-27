// User Profile Management admin page

import React, { useEffect, useState, useCallback } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Trash2, User, Mail, Shield, Activity } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserProfileManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{ users: User[] }>(`${API_URL}/api/user`);
      setUsers(data.users || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch users";
      setError(msg);
      toast({
        title: "Failed to fetch users",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setDeletingId(id);
    setError(null);
    try {
      await apiRequest(`${API_URL}/api/user/${id}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast({
        title: "User deleted successfully",
        variant: "default",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete user";
      setError(msg);
      toast({
        title: "Failed to delete user",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="text-[#FF479C]">User Profile</span> Management
        </h1>
        <p className="text-base sm:text-lg text-[#767676] max-w-2xl mx-auto">
          Manage user accounts, roles, and permissions across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 text-center hover:border-[#FF479C] transition-all duration-300">
          <div className="flex justify-center mb-3">
            <User className="w-8 h-8 text-[#FF479C]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{users.length}</h3>
          <p className="text-sm text-[#767676]">Total Users</p>
        </div>
        
        <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 text-center hover:border-[#FF479C] transition-all duration-300">
          <div className="flex justify-center mb-3">
            <Shield className="w-8 h-8 text-[#FF479C]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {users.filter(u => u.role === 'admin').length}
          </h3>
          <p className="text-sm text-[#767676]">Admin Users</p>
        </div>
        
        <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 text-center hover:border-[#FF479C] transition-all duration-300">
          <div className="flex justify-center mb-3">
            <Activity className="w-8 h-8 text-[#FF479C]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {users.filter(u => u.isActive).length}
          </h3>
          <p className="text-sm text-[#767676]">Active Users</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#3A3A3A]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF479C]" />
            User Accounts
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#3A3A3A] hover:bg-transparent">
                <TableHead className="text-[#FF479C] font-medium py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </div>
                </TableHead>
                <TableHead className="text-[#FF479C] font-medium py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </TableHead>
                <TableHead className="text-[#FF479C] font-medium py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </div>
                </TableHead>
                <TableHead className="text-[#FF479C] font-medium py-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Status
                  </div>
                </TableHead>
                {currentUser?.role === "admin" && (
                  <TableHead className="text-[#FF479C] font-medium py-4 text-center">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow 
                  key={u._id} 
                  className="border-b border-[#3A3A3A] hover:bg-[#1A1A1A] transition-all duration-300 group"
                >
                  <TableCell className="py-4 text-white font-medium">
                    {u.name}
                  </TableCell>
                  <TableCell className="py-4 text-[#767676]">
                    {u.email}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin' 
                        ? 'bg-[#FF479C] text-[#282828]' 
                        : 'bg-[#3A3A3A] text-white'
                    }`}>
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-[#3A3A3A] text-[#767676]'
                    }`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  {currentUser?.role === "admin" && (
                    <TableCell className="py-4 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === u._id}
                        onClick={() => handleDelete(u._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                      >
                        {deletingId === u._id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            Deleting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </div>
                        )}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-[#767676] mx-auto mb-4" />
            <p className="text-[#767676] text-lg">No users found</p>
            <p className="text-[#767676] text-sm mt-1">There are no users to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileManagementPage;