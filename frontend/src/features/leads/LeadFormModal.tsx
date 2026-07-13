import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import showToast from '../../components/common/Toast';
import { getSalesReps, createLead, updateLead } from '../../services/api/leads';
import type { LeadItem } from '../../services/api/leads';
import { useEffect } from 'react';

const leadSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Please enter a valid email address'),
  value: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ required_error: 'Deal value is required' }).min(0, 'Value must be positive')
  ),
  status: z.enum(['new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost']),
  rep: z.string().min(1, 'Assigned representative is required'),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: LeadItem | null;
}

export const LeadFormModal = ({ isOpen, onClose, leadToEdit }: LeadFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!leadToEdit;
  const salesRepOptions = getSalesReps();

  const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Converted', value: 'converted' },
    { label: 'Lost', value: 'lost' },
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      company: '',
      contactName: '',
      contactEmail: '',
      value: 0,
      status: 'new',
      rep: '',
    },
  });

  // Reset form values when modal opens or leadToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (leadToEdit) {
        reset({
          company: leadToEdit.company,
          contactName: leadToEdit.contactName,
          contactEmail: leadToEdit.contactEmail,
          value: leadToEdit.value,
          status: leadToEdit.status,
          rep: leadToEdit.rep,
        });
      } else {
        reset({
          company: '',
          contactName: '',
          contactEmail: '',
          value: 0,
          status: 'new',
          rep: '',
        });
      }
    }
  }, [isOpen, leadToEdit, reset]);

  const mutation = useMutation({
    mutationFn: async (data: LeadFormValues) => {
      const payload = {
        company: data.company,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        value: data.value,
        status: data.status,
        rep: data.rep,
        date: leadToEdit?.date || new Date().toISOString().substring(0, 10),
      };
      if (isEditMode && leadToEdit) {
        return updateLead(leadToEdit.id, payload);
      } else {
        return createLead(payload);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      if (leadToEdit) {
        queryClient.invalidateQueries({ queryKey: ['lead', leadToEdit.id] });
      }
      if (isEditMode) {
        showToast.success('Lead updated successfully', `${data.company} opportunity has been updated.`);
      } else {
        showToast.success('Lead created successfully', `Opportunity for ${data.company} has been added.`);
      }
      onClose();
    },
    onError: (err: any) => {
      console.error(err);
      showToast.error('Operation failed', 'An error occurred while saving the lead.');
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Lead Opportunity' : 'Create New Lead'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Company Name"
          placeholder="e.g. Acme Corp"
          error={errors.company?.message}
          {...register('company')}
        />

        <Input
          label="Contact Name"
          placeholder="e.g. John Doe"
          error={errors.contactName?.message}
          {...register('contactName')}
        />

        <Input
          label="Contact Email Address"
          type="email"
          placeholder="e.g. contact@acme.com"
          error={errors.contactEmail?.message}
          {...register('contactEmail')}
        />

        <Input
          label="Deal Value ($)"
          type="number"
          placeholder="e.g. 50000"
          error={errors.value?.message}
          {...register('value')}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Pipeline Status"
              options={statusOptions}
              value={value || null}
              onChange={onChange}
              error={errors.status?.message}
              clearable={false}
            />
          )}
        />

        <Controller
          control={control}
          name="rep"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Assigned Sales Representative"
              placeholder="Assign a rep"
              options={salesRepOptions}
              value={value || null}
              onChange={onChange}
              error={errors.rep?.message}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutralDark-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={mutation.isPending}>
            {isEditMode ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadFormModal;
