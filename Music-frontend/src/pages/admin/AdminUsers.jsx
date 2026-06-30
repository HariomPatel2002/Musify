import { useState } from 'react';
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import { Trash2, Shield } from 'lucide-react';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetUsersQuery({ page, limit: 20, search });
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by username or email..."
        className="w-full max-w-md rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      {isLoading ? <Spinner /> : (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-[#2A2A2A]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((user) => (
                <tr key={user._id} className="border-b border-gray-50 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#242424]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-semibold">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole({ id: user._id, role: e.target.value })}
                      className="text-xs rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="artist">Artist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => { if (confirm('Delete this user?')) deleteUser(user._id); }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.pagination?.totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm ${page === i + 1 ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-[#242424]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
