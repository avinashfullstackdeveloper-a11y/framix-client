// User Profile Management admin page

import React, { useEffect, useState, useCallback } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
        title: "User deleted",
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

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Profile Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            {currentUser?.role === "admin" && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u._id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                {u.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-400">Inactive</span>
                )}
              </TableCell>
              {currentUser?.role === "admin" && (
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === u._id}
                    onClick={() => handleDelete(u._id)}
                  >
                    {deletingId === u._id ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <div className="mt-4 text-muted-foreground">No users found.</div>
      )}
    </div>
  );
};

export default UserProfileManagementPage;