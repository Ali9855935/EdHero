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
import type { SelectOption } from '../../components/common/Select';
import Table from '../../components/common/Table';
import type { TableColumn } from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import LeadFormModal from './LeadFormModal';
import { getLeads, getSalesReps, updateLeadStatus } from '../../services/api/leads';
import type { LeadItem } from '../../services/api/leads';
import showToast from '../../components/common/Toast';
import { Layers, Plus, Search } from 'lucide-react';

export const LeadList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [repFilter, setRepFilter] = useState<string | null>(null);
  const [forcedState, setForcedState] = useState<'success' | 'loading' | 'error' | 'empty'>('success');

  // Modal control states
  const [formOpen, setFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<LeadItem | null>(null);

  const salesRepOptions = getSalesReps();
  
  const statusOptions: SelectOption<LeadItem['status']>[] = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' },
  ];

  // TanStack Query fetch pipeline
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leads', forcedState],
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
      return getLeads();
    },
    retry: false,
  });

  // Inline Quick Status Change Mutation
  const inlineStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: LeadItem['status'] }) => {
      return updateLeadStatus(id, newStatus);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      showToast.success('Pipeline status updated', `${data.company} status is now ${data.status.toUpperCase()}.`);
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to change status.');
    }
  });

  // Filter list
  const filteredLeads = (data || []).filter((l) => {
    const matchesSearch = l.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || l.status === statusFilter;
    const matchesRep = !repFilter || l.rep === repFilter;
    return matchesSearch && matchesStatus && matchesRep;
  });

  const handleEditClick = (lead: LeadItem) => {
    setLeadToEdit(lead);
    setFormOpen(true);
  };

  const handleCreateClick = () => {
    setLeadToEdit(null);
    setFormOpen(true);
  };

  // Table Columns Definition
  const columns: TableColumn<LeadItem>[] = [
    {
      key: 'company',
      header: 'Company Name',
      sortable: true,
      render: (_, lead) => (
        <div>
          <div className="font-semibold text-white">{lead.company}</div>
          <div className="text-xs text-neutralDark-400 mt-0.5">{lead.contactName}</div>
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Deal Value',
      sortable: true,
      render: (val) => <span className="font-medium text-neutralDark-300">${val.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Pipeline Status',
      sortable: true,
      render: (status) => <Badge label={status} />,
    },
    {
      key: 'rep',
      header: 'Assigned Rep',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Created Date',
      sortable: true,
    },
    {
      key: 'update',
      header: 'Quick Update',
      align: 'right',
      render: (_, lead) => (
        <div className="w-36 inline-block text-left" onClick={(e) => e.stopPropagation()}>
          <Select<LeadItem['status']>
            options={statusOptions}
            value={lead.status}
            onChange={(val) => val && inlineStatusMutation.mutate({ id: lead.id, newStatus: val })}
            searchable={false}
            clearable={false}
          />
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (_, lead) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="text-brand-400 hover:text-brand-300 font-semibold"
            onClick={() => handleEditClick(lead)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutralDark-400 hover:text-white font-semibold"
            onClick={() => navigate(`/leads/${lead.id}`)}
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
              <Layers className="text-brand-500" size={24} />
              Leads Pipeline
            </h2>
            <p className="text-xs text-neutralDark-400">
              Track sales opportunities, deal sizes, and pipelines.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={handleCreateClick}>
              <Plus size={14} />
              Create Lead
            </Button>
          </div>
        </div>

        {/* State simulation */}
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
                placeholder="Search leads by company or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select
                placeholder="All Statuses"
                options={[
                  { label: 'All Statuses', value: '' },
                  ...statusOptions
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                clearable={false}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                placeholder="All Reps"
                options={[
                  { label: 'All Reps', value: '' },
                  ...salesRepOptions
                ]}
                value={repFilter}
                onChange={(val) => setRepFilter(val)}
                clearable={false}
              />
            </div>
          </div>
        )}

        {/* Render Layout states */}
        {isLoading ? (
          <TableSkeleton cols={7} rows={10} />
        ) : isError ? (
          <ErrorPage message="Unable to load leads pipeline." onRetry={() => refetch()} />
        ) : filteredLeads.length === 0 ? (
          <EmptyState
            title="No Opportunities Found"
            description="Your pipeline is clean. Create a new lead to start tracking."
            icon={<Layers size={28} />}
          />
        ) : (
          <Table 
            columns={columns} 
            data={filteredLeads} 
            pageSize={10} 
            emptyMessage="No leads match search criteria" 
            onRowClick={(row) => navigate(`/leads/${row.id}`)}
          />
        )}

        {/* Form Modal (Create / Edit) */}
        <LeadFormModal
          isOpen={formOpen}
          onClose={() => {
            setFormOpen(false);
            setLeadToEdit(null);
          }}
          leadToEdit={leadToEdit}
        />
      </div>
    </PageTransition>
  );
};

export default LeadList;
