import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import showToast from '../../components/common/Toast';
import { getRoles, createUser, updateUser } from '../../services/api/users';
import type { UserItem } from '../../services/api/users';
import { useEffect } from 'react';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'inactive']),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserItem | null;
}

export const UserFormModal = ({ isOpen, onClose, userToEdit }: UserFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!userToEdit;
  const roleOptions = getRoles();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      status: 'active',
    },
  });

  // Reset form values when modal opens or userToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset({
          name: userToEdit.name,
          email: userToEdit.email,
          role: userToEdit.role,
          status: userToEdit.status,
        });
      } else {
        reset({
          name: '',
          email: '',
          role: '',
          status: 'active',
        });
      }
    }
  }, [isOpen, userToEdit, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
      };
      if (isEditMode && userToEdit) {
        return updateUser(userToEdit.id, payload);
      } else {
        return createUser(payload);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (userToEdit) {
        queryClient.invalidateQueries({ queryKey: ['user', userToEdit.id] });
      }
      if (isEditMode) {
        showToast.success('User updated successfully', `${data.name}'s profile has been updated.`);
      } else {
        showToast.success('User created successfully', `${data.name} has been added to the system.`);
      }
      onClose();
    },
    onError: (err: any) => {
      console.error(err);
      showToast.error('Operation failed', 'An error occurred while saving the user.');
    },
  });

  const onSubmit = (data: UserFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit User Profile' : 'Add New User'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <Select
              label="System Role"
              placeholder="Assign a role"
              options={roleOptions}
              value={value || null}
              onChange={onChange}
              error={errors.role?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Account Status"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              value={value || null}
              onChange={onChange}
              error={errors.status?.message}
              clearable={false}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutralDark-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={mutation.isPending}>
            {isEditMode ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
