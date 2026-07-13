import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import CustomerFormModal from './CustomerFormModal';
import { getCustomers, getIndustries } from '../../services/api/customers';
import type { CustomerItem } from '../../services/api/customers';
import { UserSquare2, Plus, Search } from 'lucide-react';

export const CustomerList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [forcedState, setForcedState] = useState<'success' | 'loading' | 'error' | 'empty'>('success');

  // Modal triggers
  const [formOpen, setFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerItem | null>(null);

  const industryOptions = getIndustries();

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Retrieve List Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['customers', forcedState],
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
      return getCustomers();
    },
    retry: false,
  });

  // Filter list
  const filteredCustomers = (data || []).filter((c) => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || c.industry === industryFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const handleEditClick = (customer: CustomerItem) => {
    setCustomerToEdit(customer);
    setFormOpen(true);
  };

  const handleCreateClick = () => {
    setCustomerToEdit(null);
    setFormOpen(true);
  };

  // Table Columns Definition
  const columns: TableColumn<CustomerItem>[] = [
    {
      key: 'company',
      header: 'Company Name',
      sortable: true,
      render: (_, customer) => (
        <span className="font-semibold text-white">{customer.company}</span>
      ),
    },
    {
      key: 'industry',
      header: 'Industry Sector',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Primary Contact',
      sortable: true,
      render: (_, customer) => (
        <div>
          <div className="font-medium text-neutralDark-200">{customer.contactName}</div>
          <div className="text-xs text-neutralDark-400 mt-0.5">{customer.contactEmail}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      sortable: true,
      render: (status) => <Badge label={status} />,
    },
    {
      key: 'date',
      header: 'Created Date',
      sortable: true,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (_, customer) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="text-brand-400 hover:text-brand-300 font-semibold"
            onClick={() => handleEditClick(customer)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutralDark-400 hover:text-white font-semibold"
            onClick={() => navigate(`/customers/${customer.id}`)}
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
              <UserSquare2 className="text-brand-500" size={24} />
              Customers Accounts
            </h2>
            <p className="text-xs text-neutralDark-400">
              Manage client records, directory sectors, and accounts contacts.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={handleCreateClick}>
              <Plus size={14} />
              Add Customer
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
                placeholder="Search customers by company or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select
                placeholder="All Industries"
                options={[
                  { label: 'All Industries', value: '' },
                  ...industryOptions
                ]}
                value={industryFilter}
                onChange={(val) => setIndustryFilter(val)}
                clearable={false}
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
          </div>
        )}

        {/* Render Layout states */}
        {isLoading ? (
          <TableSkeleton cols={6} rows={10} />
        ) : isError ? (
          <ErrorPage message="Unable to load customer directory." onRetry={() => refetch()} />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            title="No Accounts Found"
            description="Your customer directory is empty. Create a customer to begin."
            icon={<UserSquare2 size={28} />}
          />
        ) : (
          <Table 
            columns={columns} 
            data={filteredCustomers} 
            pageSize={10} 
            emptyMessage="No customers match search criteria" 
            onRowClick={(row) => navigate(`/customers/${row.id}`)}
          />
        )}

        {/* Form Modal (Create / Edit) */}
        <CustomerFormModal
          isOpen={formOpen}
          onClose={() => {
            setFormOpen(false);
            setCustomerToEdit(null);
          }}
          customerToEdit={customerToEdit}
        />
      </div>
    </PageTransition>
  );
};

export default CustomerList;
