import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '../../components/common/PageTransition';
import { CardSkeleton } from '../../components/common/Loader';
import ErrorPage from '../../components/common/ErrorPage';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { getUserById } from '../../services/api/users';
import UserFormModal from './UserFormModal';
import { ArrowLeft, Edit2, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';

export const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-2xl">
          <CardSkeleton />
        </div>
      </PageTransition>
    );
  }

  if (isError || !user) {
    return (
      <PageTransition>
        <ErrorPage
          message="Failed to retrieve user details from the database."
          onRetry={() => refetch()}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl">
        {/* Header navigation bar */}
        <div className="flex items-center justify-between border-b border-neutralDark-800 pb-4">
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 text-xs font-semibold text-neutralDark-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Users
          </button>
          
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setEditModalOpen(true)}
          >
            <Edit2 size={14} />
            Edit Profile
          </Button>
        </div>

        {/* User Card container */}
        <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-4 border-b border-neutralDark-850 pb-6">
            <div className="h-16 w-16 rounded-full bg-brand-500 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20">
              {user.name.toUpperCase().charAt(0)}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">{user.name}</h3>
              <div className="flex items-center gap-2">
                <Badge label={user.role} />
                <Badge label={user.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Email Address</span>
              <div className="flex items-center gap-2 text-neutralDark-200">
                <Mail size={16} className="text-neutralDark-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">System Access Role</span>
              <div className="flex items-center gap-2 text-neutralDark-200">
                <Shield size={16} className="text-neutralDark-400" />
                <span>{user.role}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Status</span>
              <div className="flex items-center gap-2 text-neutralDark-200">
                {user.status === 'active' ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span>Active Account</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-accent-500" />
                    <span>Deactivated / Suspended</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">User ID</span>
              <div className="text-neutralDark-300 font-mono text-xs bg-neutralDark-950 px-2 py-1.5 rounded-lg border border-neutralDark-850 inline-block">
                {user.id}
              </div>
            </div>
          </div>
        </div>

        <UserFormModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          userToEdit={user}
        />
      </div>
    </PageTransition>
  );
};

export default UserDetails;
