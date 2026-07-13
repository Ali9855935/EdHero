import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import PageTransition from '../../components/common/PageTransition';
import { CardSkeleton } from '../../components/common/Loader';
import ErrorPage from '../../components/common/ErrorPage';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { getLeadById, updateLeadStatus, addLeadNote } from '../../services/api/leads';
import LeadFormModal from './LeadFormModal';
import showToast from '../../components/common/Toast';
import { 
  ArrowLeft, 
  Edit2, 
  Mail, 
  User, 
  DollarSign, 
  Building2, 
  Plus, 
  FileText,
  Calendar
} from 'lucide-react';

export const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const { data: lead, isLoading, isError, refetch } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLeadById(id || ''),
    enabled: !!id,
  });

  const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' },
  ];

  // Quick Status Change Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: any) => {
      return updateLeadStatus(id || '', newStatus);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      showToast.success('Pipeline status updated', `Pipeline status set to ${data.status.toUpperCase()}.`);
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to change status.');
    }
  });

  // Add Note Mutation
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      return addLeadNote(id || '', content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      showToast.success('Note added', 'The note has been appended to the activity log.');
      setNewNoteContent('');
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to append note.');
    }
  });

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addNoteMutation.mutate(newNoteContent);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-4xl space-y-6">
          <CardSkeleton />
        </div>
      </PageTransition>
    );
  }

  if (isError || !lead) {
    return (
      <PageTransition>
        <ErrorPage
          message="Failed to retrieve lead details from the pipeline."
          onRetry={() => refetch()}
        />
      </PageTransition>
    );
  }

  // Sort timeline events chronologically (newest at bottom for history flow, or newest first - timeline requests newest first)
  // Let's combine notes and log activities. The API already combines notes added log and status changes.
  const timelineEvents = [...(lead.activity || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl">
        {/* Header navigation bar */}
        <div className="flex items-center justify-between border-b border-neutralDark-800 pb-4">
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-2 text-xs font-semibold text-neutralDark-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Pipeline
          </button>
          
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setEditModalOpen(true)}
          >
            <Edit2 size={14} />
            Edit Opportunity
          </Button>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-neutralDark-850 pb-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-lg shadow-brand-500/5">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{lead.company}</h3>
                    <p className="text-xs text-neutralDark-400 mt-0.5">Opportunity Opportunity</p>
                  </div>
                </div>

                <div className="w-40">
                  <Select
                    options={statusOptions}
                    value={lead.status}
                    onChange={(val) => val && updateStatusMutation.mutate(val)}
                    searchable={false}
                    clearable={false}
                  />
                </div>
              </div>

              {/* Read Only Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Contact Person</span>
                  <div className="flex items-center gap-2 text-neutralDark-200">
                    <User size={16} className="text-neutralDark-400" />
                    <span>{lead.contactName}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Email Address</span>
                  <div className="flex items-center gap-2 text-neutralDark-200">
                    <Mail size={16} className="text-neutralDark-400" />
                    <span>{lead.contactEmail}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Estimated Deal Value</span>
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <DollarSign size={18} className="text-emerald-500" />
                    <span>${lead.value.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Assigned Representative</span>
                  <div className="flex items-center gap-2 text-neutralDark-200">
                    <ShieldIcon size={16} />
                    <span>{lead.rep}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Input Area */}
            <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <FileText size={16} className="text-brand-500" />
                Notes History
              </h4>

              <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                <textarea
                  placeholder="Enter a new update note regarding this lead..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full h-24 px-4 py-3 bg-neutralDark-950 border border-neutralDark-800 rounded-lg text-sm text-white placeholder-neutralDark-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={addNoteMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Add Note
                  </Button>
                </div>
              </form>

              {/* Render Notes list */}
              <div className="space-y-3 pt-2">
                {lead.notes?.length === 0 ? (
                  <p className="text-xs text-neutralDark-500 text-center py-4">No notes have been logged for this lead.</p>
                ) : (
                  lead.notes?.map((note) => (
                    <div key={note.id} className="p-3.5 bg-neutralDark-950 border border-neutralDark-850/60 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs text-neutralDark-500">
                        <span className="font-semibold text-neutralDark-400">Representative Update</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-sm text-neutralDark-200 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Timeline Panel (Right 1 column) */}
          <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl h-fit space-y-6">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <Calendar size={16} className="text-brand-500" />
              Activity Log
            </h4>

            {timelineEvents.length === 0 ? (
              <p className="text-xs text-neutralDark-500 text-center py-6">No activity log found.</p>
            ) : (
              <div className="relative pl-6 ml-3 text-left">
                {/* Simulated vertical line animating in */}
                <motion.div
                  variants={{
                    hidden: { scaleY: 0 },
                    visible: { 
                      scaleY: 1, 
                      transition: { duration: 0.4, ease: 'easeOut' } 
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  className="absolute left-0 top-2 bottom-2 w-[1px] bg-brand-500/30 origin-top"
                />

                <div className="space-y-6">
                  {timelineEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      custom={index}
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        visible: (i) => ({
                          opacity: 1,
                          x: 0,
                          transition: { delay: i * 0.05, duration: 0.2 }
                        })
                      }}
                      initial="hidden"
                      animate="visible"
                      className="relative"
                    >
                      {/* Timeline Node dot */}
                      <span className="absolute -left-[30px] top-1.5 h-2 w-2 rounded-full bg-brand-500 shadow-md shadow-brand-500/50" />
                      
                      <div className="space-y-1">
                        <div className="text-[10px] font-semibold text-neutralDark-500 uppercase tracking-wider">{event.date}</div>
                        <p className="text-xs text-neutralDark-200 leading-normal">{event.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <LeadFormModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          leadToEdit={lead}
        />
      </div>
    </PageTransition>
  );
};

// Internal icon component to avoid Shield TS compile clash
const ShieldIcon = ({ size }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 16}
    height={size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-neutralDark-400"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default LeadDetails;
