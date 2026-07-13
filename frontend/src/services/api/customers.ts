export interface CustomerContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface CustomerNote {
  id: string;
  content: string;
  date: string;
}

export interface CustomerDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
}

export interface CustomerItem {
  id: string;
  company: string;
  industry: string;
  status: 'active' | 'inactive';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  date: string;
  contacts: CustomerContact[];
  notes: CustomerNote[];
  documents: CustomerDocument[];
}

export const getIndustries = () => {
  return [
    { label: 'Textiles & Manufacturing', value: 'Textiles & Manufacturing' },
    { label: 'Logistics & Supply Chain', value: 'Logistics & Supply Chain' },
    { label: 'Wholesale & Retail', value: 'Wholesale & Retail' },
    { label: 'Retail & Consumer Goods', value: 'Retail & Consumer Goods' },
    { label: 'Technology & Software', value: 'Technology & Software' },
    { label: 'Finance & Banking', value: 'Finance & Banking' },
    { label: 'Healthcare & Biotech', value: 'Healthcare & Biotech' },
  ];
};

export let mockCustomers: CustomerItem[] = [
  {
    id: '1',
    company: 'Nimbus Textiles',
    industry: 'Textiles & Manufacturing',
    status: 'active',
    contactName: 'Anthony Stone',
    contactEmail: 'anthony@nimbustextiles.com',
    contactPhone: '+1 (555) 123-4567',
    date: '2026-06-01',
    contacts: [
      { id: 'c1', name: 'Martha Stone', role: 'Operations Lead', email: 'martha@nimbustextiles.com', phone: '+1 (555) 123-4568' }
    ],
    notes: [
      { id: 'n1', content: 'Customer requested discount rates for bulk orders.', date: '2026-06-15 14:00' }
    ],
    documents: [
      { id: 'd1', name: 'Master_Agreement.pdf', size: '1.2 MB', type: 'pdf', date: '2026-06-02' }
    ]
  },
  {
    id: '2',
    company: 'Bluewave Logistics',
    industry: 'Logistics & Supply Chain',
    status: 'active',
    contactName: 'Robert Benson',
    contactEmail: 'benson@bluewavelogistics.com',
    contactPhone: '+1 (555) 234-5678',
    date: '2026-06-05',
    contacts: [],
    notes: [],
    documents: []
  },
  {
    id: '3',
    company: 'Falcon Distributors',
    industry: 'Wholesale & Retail',
    status: 'inactive',
    contactName: 'Sarah Kyle',
    contactEmail: 'sarah@falcondistributors.com',
    contactPhone: '+1 (555) 345-6789',
    date: '2026-06-10',
    contacts: [
      { id: 'c2', name: 'David Kyle', role: 'Warehouse Manager', email: 'david@falcondistributors.com', phone: '+1 (555) 345-6780' }
    ],
    notes: [
      { id: 'n2', content: 'Account suspended temporarily due to billing review.', date: '2026-06-20 10:30' }
    ],
    documents: []
  },
  {
    id: '4',
    company: 'Horizon Retail Group',
    industry: 'Retail & Consumer Goods',
    status: 'active',
    contactName: 'Richard Reed',
    contactEmail: 'richard@horizonretail.com',
    contactPhone: '+1 (555) 456-7890',
    date: '2026-06-15',
    contacts: [],
    notes: [],
    documents: []
  },
  // Adding remaining 22 mock customers to hit 25+ dataset size for paginated list view demo
  { id: '5', company: 'Apex Software Co', industry: 'Technology & Software', status: 'active', contactName: 'Gail Fisher', contactEmail: 'gail@apex.com', contactPhone: '+1 (555) 567-8901', date: '2026-06-16', contacts: [], notes: [], documents: [] },
  { id: '6', company: 'Summit Bank', industry: 'Finance & Banking', status: 'active', contactName: 'Arthur Dent', contactEmail: 'arthur@summit.com', contactPhone: '+1 (555) 678-9012', date: '2026-06-17', contacts: [], notes: [], documents: [] },
  { id: '7', company: 'Pinnacle Health', industry: 'Healthcare & Biotech', status: 'active', contactName: 'Clara Oswald', contactEmail: 'clara@pinnacle.com', contactPhone: '+1 (555) 789-0123', date: '2026-06-18', contacts: [], notes: [], documents: [] },
  { id: '8', company: 'Vanguard Systems', industry: 'Technology & Software', status: 'inactive', contactName: 'Miles Bennett', contactEmail: 'miles@vanguard.com', contactPhone: '+1 (555) 890-1234', date: '2026-06-19', contacts: [], notes: [], documents: [] },
  { id: '9', company: 'Starlight Retail', industry: 'Wholesale & Retail', status: 'active', contactName: 'Rose Tyler', contactEmail: 'rose@starlight.com', contactPhone: '+1 (555) 901-2345', date: '2026-06-20', contacts: [], notes: [], documents: [] },
  { id: '10', company: 'Omni Corp Solutions', industry: 'Logistics & Supply Chain', status: 'active', contactName: 'Donna Noble', contactEmail: 'donna@omnicorp.com', contactPhone: '+1 (555) 012-3456', date: '2026-06-21', contacts: [], notes: [], documents: [] },
  { id: '11', company: 'Aero Manufacturing', industry: 'Textiles & Manufacturing', status: 'active', contactName: 'Martha Jones', contactEmail: 'martha@aeroman.com', contactPhone: '+1 (555) 123-9876', date: '2026-06-22', contacts: [], notes: [], documents: [] },
  { id: '12', company: 'Meridian Capital', industry: 'Finance & Banking', status: 'active', contactName: 'Amy Pond', contactEmail: 'amy@meridian.com', contactPhone: '+1 (555) 234-8765', date: '2026-06-23', contacts: [], notes: [], documents: [] },
  { id: '13', company: 'Helix Laboratories', industry: 'Healthcare & Biotech', status: 'active', contactName: 'Rory Williams', contactEmail: 'rory@helix.com', contactPhone: '+1 (555) 345-7654', date: '2026-06-24', contacts: [], notes: [], documents: [] },
  { id: '14', company: 'Prism Tech Group', industry: 'Technology & Software', status: 'inactive', contactName: 'River Song', contactEmail: 'river@prism.com', contactPhone: '+1 (555) 456-6543', date: '2026-06-25', contacts: [], notes: [], documents: [] },
  { id: '15', company: 'Atlas Shipping', industry: 'Logistics & Supply Chain', status: 'active', contactName: 'Jack Harkness', contactEmail: 'jack@atlas.com', contactPhone: '+1 (555) 567-5432', date: '2026-06-26', contacts: [], notes: [], documents: [] },
  { id: '16', company: 'Crestwood Apparel', industry: 'Textiles & Manufacturing', status: 'active', contactName: 'Sarah Smith', contactEmail: 'sarah@crestwood.com', contactPhone: '+1 (555) 678-4321', date: '2026-06-27', contacts: [], notes: [], documents: [] },
  { id: '17', company: 'Pioneer Retailers', industry: 'Wholesale & Retail', status: 'active', contactName: 'Mickey Smith', contactEmail: 'mickey@pioneer.com', contactPhone: '+1 (555) 789-3210', date: '2026-06-28', contacts: [], notes: [], documents: [] },
  { id: '18', company: 'Secure Trust Bank', industry: 'Finance & Banking', status: 'active', contactName: 'Wilfred Mott', contactEmail: 'wilf@securetrust.com', contactPhone: '+1 (555) 890-2109', date: '2026-06-29', contacts: [], notes: [], documents: [] },
  { id: '19', company: 'LifeCare Medical', industry: 'Healthcare & Biotech', status: 'active', contactName: 'Sylvia Noble', contactEmail: 'sylvia@lifecare.com', contactPhone: '+1 (555) 901-1098', date: '2026-06-30', contacts: [], notes: [], documents: [] },
  { id: '20', company: 'Nova Technologies', industry: 'Technology & Software', status: 'inactive', contactName: 'Danny Pink', contactEmail: 'danny@nova.com', contactPhone: '+1 (555) 012-0987', date: '2026-07-01', contacts: [], notes: [], documents: [] },
  { id: '21', company: 'Oceanic Transport', industry: 'Logistics & Supply Chain', status: 'active', contactName: 'Clara Pink', contactEmail: 'clara@oceanic.com', contactPhone: '+1 (555) 123-0192', date: '2026-07-02', contacts: [], notes: [], documents: [] },
  { id: '22', company: 'FibreCraft Mill', industry: 'Textiles & Manufacturing', status: 'active', contactName: 'Jenny Green', contactEmail: 'jenny@fibrecraft.com', contactPhone: '+1 (555) 234-9281', date: '2026-07-03', contacts: [], notes: [], documents: [] },
  { id: '23', company: 'Global Exchange', industry: 'Wholesale & Retail', status: 'active', contactName: 'Bill Potts', contactEmail: 'bill@globalex.com', contactPhone: '+1 (555) 345-8372', date: '2026-07-04', contacts: [], notes: [], documents: [] },
  { id: '24', company: 'Capital Securities', industry: 'Finance & Banking', status: 'active', contactName: 'Nardole Box', contactEmail: 'nardole@capsec.com', contactPhone: '+1 (555) 456-7463', date: '2026-07-05', contacts: [], notes: [], documents: [] },
  { id: '25', company: 'WellSpring Pharma', industry: 'Healthcare & Biotech', status: 'active', contactName: 'Grace Potts', contactEmail: 'grace@wellspring.com', contactPhone: '+1 (555) 567-6554', date: '2026-07-06', contacts: [], notes: [], documents: [] },
  { id: '26', company: 'Vector Dynamics', industry: 'Technology & Software', status: 'active', contactName: 'Ryan Sinclair', contactEmail: 'ryan@vector.com', contactPhone: '+1 (555) 678-5645', date: '2026-07-07', contacts: [], notes: [], documents: [] },
];

export const getCustomers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockCustomers];
};

export const getCustomerById = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const customer = mockCustomers.find((c) => c.id === id);
  if (!customer) throw new Error('Customer not found');
  
  // Ensure default structures are set
  if (!customer.contacts) customer.contacts = [];
  if (!customer.notes) customer.notes = [];
  if (!customer.documents) customer.documents = [];
  
  return { ...customer };
};

export const createCustomer = async (customer: Omit<CustomerItem, 'id' | 'contacts' | 'notes' | 'documents'>) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newCustomer: CustomerItem = {
    id: (mockCustomers.length + 1).toString(),
    ...customer,
    contacts: [],
    notes: [],
    documents: []
  };
  mockCustomers.unshift(newCustomer);
  return newCustomer;
};

export const updateCustomer = async (id: string, updatedFields: Partial<Omit<CustomerItem, 'id' | 'contacts' | 'notes' | 'documents'>>) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  mockCustomers[index] = { ...mockCustomers[index], ...updatedFields };
  return mockCustomers[index];
};

export const addCustomerContact = async (id: string, contact: Omit<CustomerContact, 'id'>) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  
  const newContact: CustomerContact = {
    id: `c_${Date.now()}`,
    ...contact
  };
  
  mockCustomers[index].contacts = [...(mockCustomers[index].contacts || []), newContact];
  return mockCustomers[index];
};

export const deleteCustomerContact = async (customerId: string, contactId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockCustomers.findIndex((c) => c.id === customerId);
  if (index === -1) throw new Error('Customer not found');
  
  mockCustomers[index].contacts = (mockCustomers[index].contacts || []).filter(
    (c) => c.id !== contactId
  );
  return mockCustomers[index];
};

export const addCustomerNote = async (id: string, content: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  
  const newNote: CustomerNote = {
    id: `n_${Date.now()}`,
    content,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  
  mockCustomers[index].notes = [newNote, ...(mockCustomers[index].notes || [])];
  return mockCustomers[index];
};

export const uploadDocument = async (id: string, document: { name: string; size: string; type: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  
  const newDoc: CustomerDocument = {
    id: `d_${Date.now()}`,
    name: document.name,
    size: document.size,
    type: document.type,
    date: new Date().toISOString().substring(0, 10)
  };
  
  mockCustomers[index].documents = [...(mockCustomers[index].documents || []), newDoc];
  return mockCustomers[index];
};

export const deleteCustomerDocument = async (customerId: string, docId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockCustomers.findIndex((c) => c.id === customerId);
  if (index === -1) throw new Error('Customer not found');
  
  mockCustomers[index].documents = (mockCustomers[index].documents || []).filter(
    (d) => d.id !== docId
  );
  return mockCustomers[index];
};
