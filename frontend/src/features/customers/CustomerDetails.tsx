import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageTransition from '../../components/common/PageTransition';
import { CardSkeleton } from '../../components/common/Loader';
import ErrorPage from '../../components/common/ErrorPage';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomerFormModal from './CustomerFormModal';
import showToast from '../../components/common/Toast';
import { 
  getCustomerById, 
  addCustomerContact, 
  deleteCustomerContact, 
  addCustomerNote, 
  uploadDocument, 
  deleteCustomerDocument 
} from '../../services/api/customers';
import type { CustomerContact, CustomerDocument } from '../../services/api/customers';
import { 
  ArrowLeft, 
  Edit2, 
  Mail, 
  User, 
  Building2, 
  Plus, 
  FileText,
  Phone,
  Trash2,
  Upload,
  UserPlus,
  File,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Dialog/Modal triggers
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactToRemove, setContactToRemove] = useState<CustomerContact | null>(null);
  const [docToRemove, setDocToRemove] = useState<CustomerDocument | null>(null);

  // Notes and Contact creation states
  const [newNoteContent, setNewNoteContent] = useState('');
  const [inlineFormOpen, setInlineFormOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', role: '', email: '', phone: '' });

  // Document upload simulation state
  const [uploadingFile, setUploadingFile] = useState<{ name: string; progress: number } | null>(null);

  // Retrieve details
  const { data: customer, isLoading, isError, refetch } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id || ''),
    enabled: !!id,
  });

  // Contacts mutations
  const addContactMutation = useMutation({
    mutationFn: async (contact: Omit<CustomerContact, 'id'>) => {
      return addCustomerContact(id || '', contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      showToast.success('Contact added', 'New contact added to this client profile.');
      setNewContact({ name: '', role: '', email: '', phone: '' });
      setInlineFormOpen(false);
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to add contact.');
    }
  });

  const removeContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      return deleteCustomerContact(id || '', contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      showToast.success('Contact removed', 'The contact has been deleted.');
      setContactToRemove(null);
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to delete contact.');
    }
  });

  // Notes mutation
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      return addCustomerNote(id || '', content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      showToast.success('Note added', 'Customer update note has been logged.');
      setNewNoteContent('');
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to append note.');
    }
  });

  // Document upload mutations
  const uploadDocMutation = useMutation({
    mutationFn: async (document: { name: string; size: string; type: string }) => {
      return uploadDocument(id || '', document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      showToast.success('Document uploaded', 'Document added to database storage.');
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to add document details.');
    }
  });

  const removeDocMutation = useMutation({
    mutationFn: async (docId: string) => {
      return deleteCustomerDocument(id || '', docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      showToast.success('Document deleted', 'The document has been removed.');
      setDocToRemove(null);
    },
    onError: (err) => {
      console.error(err);
      showToast.error('Operation failed', 'Unable to delete document.');
    }
  });

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.email.trim()) {
      showToast.error('Validation Error', 'Contact name and email address are required.');
      return;
    }
    addContactMutation.mutate(newContact);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addNoteMutation.mutate(newNoteContent);
  };

  // Upload simulation progress timer
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      startUploadSimulation(file.name, file.size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startUploadSimulation(file.name, file.size);
    }
  };

  const startUploadSimulation = (fileName: string, fileSize: number) => {
    if (uploadingFile) return; // Prevent concurrent uploads simulation
    const formattedSize = (fileSize / (1024 * 1024)).toFixed(1) + ' MB';
    setUploadingFile({ name: fileName, progress: 0 });

    const interval = setInterval(() => {
      setUploadingFile((prev) => {
        if (!prev) {
          clearInterval(interval);
          return null;
        }
        if (prev.progress >= 100) {
          clearInterval(interval);
          uploadDocMutation.mutate({
            name: fileName,
            size: formattedSize === '0.0 MB' ? '12 KB' : formattedSize,
            type: fileName.split('.').pop() || 'file'
          });
          return null;
        }
        return { ...prev, progress: prev.progress + 20 };
      });
    }, 120);
  };

  const getDocTypeIcon = (type: string) => {
    const norm = type.toLowerCase();
    if (norm === 'pdf') return <FileText size={20} className="text-rose-500" />;
    if (['doc', 'docx'].includes(norm)) return <FileText size={20} className="text-blue-500" />;
    if (['xls', 'xlsx', 'csv'].includes(norm)) return <File size={20} className="text-emerald-500" />;
    return <File size={20} className="text-neutralDark-400" />;
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

  if (isError || !customer) {
    return (
      <PageTransition>
        <ErrorPage
          message="Failed to retrieve customer details from the database."
          onRetry={() => refetch()}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl">
        {/* Header navigation bar */}
        <div className="flex items-center justify-between border-b border-neutralDark-800 pb-4">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-xs font-semibold text-neutralDark-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Customers
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

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Columns (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Details Panel */}
            <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-4 border-b border-neutralDark-850 pb-6">
                <div className="h-14 w-14 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-lg shadow-brand-500/5">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{customer.company}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge label={customer.industry} />
                    <Badge label={customer.status} />
                  </div>
                </div>
              </div>

              {/* Primary Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Primary Contact Person</span>
                  <div className="flex items-center gap-2 text-neutralDark-200">
                    <User size={16} className="text-neutralDark-400" />
                    <span>{customer.contactName}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Email Address</span>
                  <div className="flex items-center gap-2 text-neutralDark-200">
                    <Mail size={16} className="text-neutralDark-400" />
                    <span>{customer.contactEmail}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Phone Number</span>
                  <div className="flex items-center gap-2 text-neutralDark-200">
                    <Phone size={16} className="text-neutralDark-400" />
                    <span>{customer.contactPhone}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutralDark-500 uppercase tracking-wider block">Account Status</span>
                  <div className="flex items-center gap-2 text-neutralDark-200">
                    {customer.status === 'active' ? (
                      <>
                        <CheckCircle size={16} className="text-emerald-500" />
                        <span>Active Account</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-accent-500" />
                        <span>Inactive Account</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Multiple Contacts Manager */}
            <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutralDark-850 pb-4">
                <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                  <UserPlus size={16} className="text-brand-500" />
                  Additional Contacts
                </h4>
                
                {!inlineFormOpen && (
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5" onClick={() => setInlineFormOpen(true)}>
                    <Plus size={14} />
                    Add Contact
                  </Button>
                )}
              </div>

              {/* Inline Form to Add Contact */}
              {inlineFormOpen && (
                <form onSubmit={handleAddContactSubmit} className="bg-neutralDark-950 p-4 border border-neutralDark-850 rounded-xl space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Name"
                      placeholder="e.g. Martha Stone"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    />
                    <Input
                      label="Role"
                      placeholder="e.g. Operations Lead"
                      value={newContact.role}
                      onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="e.g. martha@nimbus.com"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    />
                    <Input
                      label="Phone"
                      placeholder="e.g. +1 (555) 123-4568"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setInlineFormOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" loading={addContactMutation.isPending}>
                      Save Contact
                    </Button>
                  </div>
                </form>
              )}

              {/* Contacts Table List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-neutralDark-850">
                  <thead>
                    <tr className="text-neutralDark-400 font-semibold uppercase tracking-wider">
                      <th className="py-2.5">Name</th>
                      <th className="py-2.5">Role</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">Phone</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutralDark-850/40 text-neutralDark-300">
                    {customer.contacts?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-neutralDark-500">
                          No additional contacts registered.
                        </td>
                      </tr>
                    ) : (
                      customer.contacts?.map((contact) => (
                        <tr key={contact.id}>
                          <td className="py-3 font-semibold text-white">{contact.name}</td>
                          <td className="py-3">{contact.role}</td>
                          <td className="py-3">{contact.email}</td>
                          <td className="py-3">{contact.phone}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setContactToRemove(contact)}
                              className="text-neutralDark-500 hover:text-accent-500 transition-colors p-1.5 rounded-lg cursor-pointer"
                              title="Delete Contact"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Notes */}
            <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <FileText size={16} className="text-brand-500" />
                Customer Notes
              </h4>

              <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                <textarea
                  placeholder="Enter a new update note regarding this customer account..."
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
                {customer.notes?.length === 0 ? (
                  <p className="text-xs text-neutralDark-500 text-center py-4">No notes logged for this customer account.</p>
                ) : (
                  customer.notes?.map((note) => (
                    <div key={note.id} className="p-3.5 bg-neutralDark-950 border border-neutralDark-850/60 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs text-neutralDark-500">
                        <span className="font-semibold text-neutralDark-400">Account Log</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-sm text-neutralDark-200 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Document Upload UI Section (Right 1 column) */}
          <div className="space-y-6">
            <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <Upload size={16} className="text-brand-500" />
                Documents Vault
              </h4>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-neutralDark-800 hover:border-brand-500/50 bg-neutralDark-950/40 hover:bg-neutralDark-950/80 rounded-xl p-6 text-center transition-all relative flex flex-col items-center justify-center gap-2 select-none group"
              >
                <input
                  type="file"
                  id="doc-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={!!uploadingFile}
                />
                <label
                  htmlFor="doc-upload"
                  className="absolute inset-0 w-full h-full cursor-pointer"
                />
                
                <Upload size={24} className="text-neutralDark-500 group-hover:text-brand-400 transition-colors" />
                <span className="text-xs font-semibold text-neutralDark-300">Drag & drop document or browse</span>
                <span className="text-[10px] text-neutralDark-500">PDF, Word, or Spreadsheets up to 10MB</span>
              </div>

              {/* Uploading File progress indicator */}
              {uploadingFile && (
                <div className="p-3 bg-neutralDark-950 border border-neutralDark-850 rounded-lg space-y-2 animate-pulse">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white truncate max-w-[80%]">{uploadingFile.name}</span>
                    <span className="font-semibold text-brand-400">{uploadingFile.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutralDark-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-500 transition-all duration-100" 
                      style={{ width: `${uploadingFile.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-neutralDark-500 uppercase tracking-wider block">Stored Files</span>
                
                {customer.documents?.length === 0 ? (
                  <p className="text-xs text-neutralDark-500 text-center py-4">No documents uploaded.</p>
                ) : (
                  <div className="divide-y divide-neutralDark-850/40">
                    {customer.documents?.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between py-2.5 gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {getDocTypeIcon(doc.type)}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate" title={doc.name}>{doc.name}</p>
                            <p className="text-[10px] text-neutralDark-500 mt-0.5">{doc.size} • {doc.date}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setDocToRemove(doc)}
                          className="text-neutralDark-500 hover:text-accent-500 transition-colors p-1 rounded cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <CustomerFormModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          customerToEdit={customer}
        />

        {/* Delete Contact dialog */}
        <ConfirmDialog
          isOpen={!!contactToRemove}
          onClose={() => setContactToRemove(null)}
          onConfirm={() => contactToRemove && removeContactMutation.mutate(contactToRemove.id)}
          title="Remove Contact"
          description={`Are you sure you want to remove the contact for ${contactToRemove?.name}?`}
          confirmText="Remove"
        />

        {/* Delete Document dialog */}
        <ConfirmDialog
          isOpen={!!docToRemove}
          onClose={() => setDocToRemove(null)}
          onConfirm={() => docToRemove && removeDocMutation.mutate(docToRemove.id)}
          title="Remove Document"
          description={`Are you sure you want to delete the document "${docToRemove?.name}" from this customer account?`}
          confirmText="Remove"
        />
      </div>
    </PageTransition>
  );
};

export default CustomerDetails;
