import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import showToast from '../../components/common/Toast';
import { getIndustries, createCustomer, updateCustomer } from '../../services/api/customers';
import type { CustomerItem } from '../../services/api/customers';
import { useEffect } from 'react';

const customerSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry sector is required'),
  status: z.enum(['active', 'inactive']),
  contactName: z.string().min(1, 'Primary contact name is required'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(1, 'Primary contact phone is required'),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: CustomerItem | null;
}

export const CustomerFormModal = ({ isOpen, onClose, customerToEdit }: CustomerFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!customerToEdit;
  const industryOptions = getIndustries();

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      company: '',
      industry: '',
      status: 'active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    },
  });

  // Reset form values when modal opens or customerToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        reset({
          company: customerToEdit.company,
          industry: customerToEdit.industry,
          status: customerToEdit.status,
          contactName: customerToEdit.contactName,
          contactEmail: customerToEdit.contactEmail,
          contactPhone: customerToEdit.contactPhone,
        });
      } else {
        reset({
          company: '',
          industry: '',
          status: 'active',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
        });
      }
    }
  }, [isOpen, customerToEdit, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CustomerFormValues) => {
      const payload = {
        company: data.company,
        industry: data.industry,
        status: data.status,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        date: customerToEdit?.date || new Date().toISOString().substring(0, 10),
      };
      if (isEditMode && customerToEdit) {
        return updateCustomer(customerToEdit.id, payload);
      } else {
        return createCustomer(payload);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      if (customerToEdit) {
        queryClient.invalidateQueries({ queryKey: ['customer', customerToEdit.id] });
      }
      if (isEditMode) {
        showToast.success('Customer updated successfully', `${data.company} profile has been updated.`);
      } else {
        showToast.success('Customer created successfully', `${data.company} has been added as a client.`);
      }
      onClose();
    },
    onError: (err: any) => {
      console.error(err);
      showToast.error('Operation failed', 'An error occurred while saving the customer.');
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Customer Profile' : 'Add New Customer'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Company Name"
          placeholder="e.g. Nimbus Textiles"
          error={errors.company?.message}
          {...register('company')}
        />

        <Controller
          control={control}
          name="industry"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Industry Sector"
              placeholder="Select an industry"
              options={industryOptions}
              value={value || null}
              onChange={onChange}
              error={errors.industry?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Account Status"
              options={statusOptions}
              value={value || null}
              onChange={onChange}
              error={errors.status?.message}
              clearable={false}
            />
          )}
        />

        <div className="border-t border-neutralDark-800 pt-4 mt-2">
          <h4 className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-4">Primary Contact Information</h4>
          
          <div className="space-y-4">
            <Input
              label="Contact Person Name"
              placeholder="e.g. Anthony Stone"
              error={errors.contactName?.message}
              {...register('contactName')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. anthony@nimbus.com"
              error={errors.contactEmail?.message}
              {...register('contactEmail')}
            />

            <Input
              label="Phone Number"
              placeholder="e.g. +1 (555) 123-4567"
              error={errors.contactPhone?.message}
              {...register('contactPhone')}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutralDark-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={mutation.isPending}>
            {isEditMode ? 'Save Changes' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerFormModal;
