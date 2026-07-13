import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import { TableSkeleton } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorPage from '../../components/common/ErrorPage';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import type { TableColumn } from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UserFormModal from './UserFormModal';
import { getUsers, getRoles, updateUser } from '../../services/api/users';
import type { UserItem } from '../../services/api/users';
import showToast from '../../components/common/Toast';
import { Users, UserPlus, Search } from 'lucide-react';

export const UserList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [forcedState, setForcedState] = useState<'success' | 'loading' | 'error' | 'empty'>('success');

  // Modal control states
  const [formOpen, setFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserItem | null>(null);
  const [statusToggleUser, setStatusToggleUser] = useState<UserItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // TanStack Query list fetch
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', forcedState],
    queryFn: async () => {
      if (forcedState === 'loading') {
        await new Promise(() => {}); // Keeps loading forever for testing
      }
      if (forcedState === 'error') {
        throw new Error('Database connection failed. Please try again.');
      }
      if (forcedState === 'empty') {
        return [];
      }
      return getUsers();
    },
    retry: false,
  });

  // Activate/Deactivate Mutation with Optimistic Updates & Rollback
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: 'active' | 'inactive' }) => {
      // Simulate network error for user ID '3' (Bob Johnson) to demo rollback
      if (id === '3') {
        await new Promise((resolve) => setTimeout(resolve, 800));
        throw new Error('Database toggle status failed.');
      }
      return updateUser(id, { status: newStatus });
    },
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['users', forcedState] });
      const previousUsers = queryClient.getQueryData<UserItem[]>(['users', forcedState]);
      if (previousUsers) {
        queryClient.setQueryData<UserItem[]>(
          ['users', forcedState],
          previousUsers.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
        );
      }
      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users', forcedState], context.previousUsers);
      }
      showToast.error('Failed to update status', 'Simulated server error. Rolling back changes.');
    },
    onSuccess: (data) => {
      showToast.success('Status updated', `${data.name}'s status has been set to ${data.status}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Filter dynamic lists
  const filteredUsers = (data || []).filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus = !statusFilter || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditClick = (user: UserItem) => {
    setUserToEdit(user);
    setFormOpen(true);
  };

  const handleAddClick = () => {
    setUserToEdit(null);
    setFormOpen(true);
  };

  const handleToggleStatusClick = (user: UserItem) => {
    setStatusToggleUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmToggle = () => {
    if (statusToggleUser) {
      const newStatus = statusToggleUser.status === 'active' ? 'inactive' : 'active';
      toggleStatusMutation.mutate({ id: statusToggleUser.id, newStatus });
      setConfirmOpen(false);
      setStatusToggleUser(null);
    }
  };

  // Table Columns Definition
  const columns: TableColumn<UserItem>[] = [
    {
      key: 'name',
      header: 'User Info',
      sortable: true,
      render: (_, user) => (
        <div>
          <div className="font-semibold text-white">{user.name}</div>
          <div className="text-xs text-neutralDark-400 mt-0.5">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status, user) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatusClick(user);
          }}
          className="cursor-pointer"
          title="Toggle status"
        >
          <Badge label={status} />
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, user) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="text-brand-400 hover:text-brand-300 font-semibold"
            onClick={() => handleEditClick(user)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutralDark-400 hover:text-white font-semibold"
            onClick={() => navigate(`/users/${user.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="text-brand-500" size={24} />
              Users Management
            </h2>
            <p className="text-xs text-neutralDark-400">
              Manage system access roles, user logs, and statuses.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={handleAddClick}>
              <UserPlus size={14} />
              Add User
            </Button>
          </div>
        </div>

        {/* State selector controls for verification */}
        {import.meta.env.DEV && (
          <div className="p-3 bg-neutralDark-900 border border-neutralDark-800 rounded-xl flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-neutralDark-400 uppercase tracking-wider">
              Simulate States:
            </span>
            <div className="flex gap-2 flex-wrap">
              {(['success', 'loading', 'error', 'empty'] as const).map((state) => (
                <Button
                  key={state}
                  variant={forcedState === state ? 'primary' : 'secondary'}
                  size="sm"
                  className="uppercase tracking-wider text-xs"
                  onClick={() => setForcedState(state)}
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter controls */}
        {forcedState === 'success' && (
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutralDark-500 z-10" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select
                placeholder="All Roles"
                options={[
                  { label: 'All Roles', value: '' },
                  ...getRoles()
                ]}
                value={roleFilter}
                onChange={(val) => setRoleFilter(val)}
                clearable={false}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                placeholder="All Statuses"
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                clearable={false}
              />
            </div>
          </div>
        )}

        {/* 3 States Render */}
        {isLoading ? (
          <TableSkeleton cols={4} rows={10} />
        ) : isError ? (
          <ErrorPage 
            message="We were unable to load the users list from the server database." 
            onRetry={() => refetch()} 
          />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No Users Found"
            description={
              searchTerm 
                ? `No user records matching "${searchTerm}" could be located.` 
                : "No system users have been registered yet. Click 'Add User' to begin."
            }
            icon={<Users size={28} />}
          />
        ) : (
          /* Success Data Table */
          <Table 
            columns={columns} 
            data={filteredUsers} 
            pageSize={10} 
            emptyMessage="No users match search criteria" 
            onRowClick={(row) => navigate(`/users/${row.id}`)}
          />
        )}

        {/* Form Modal (Add / Edit) */}
        <UserFormModal
          isOpen={formOpen}
          onClose={() => {
            setFormOpen(false);
            setUserToEdit(null);
          }}
          userToEdit={userToEdit}
        />

        {/* Confirm Toggle Status Modal */}
        <ConfirmDialog
          isOpen={confirmOpen}
          onClose={() => {
            setConfirmOpen(false);
            setStatusToggleUser(null);
          }}
          onConfirm={handleConfirmToggle}
          title={statusToggleUser?.status === 'active' ? 'Deactivate User Account' : 'Activate User Account'}
          description={`Are you sure you want to ${
            statusToggleUser?.status === 'active' ? 'deactivate' : 'activate'
          } the user account for ${statusToggleUser?.name}?`}
          confirmText={statusToggleUser?.status === 'active' ? 'Deactivate' : 'Activate'}
        />
      </div>
    </PageTransition>
  );
};

export default UserList;
