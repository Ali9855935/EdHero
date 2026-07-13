export interface LeadNote {
  id: string;
  content: string;
  date: string;
}

export interface LeadActivity {
  id: string;
  type: 'note' | 'status_change' | 'assignment' | 'creation';
  description: string;
  date: string;
}

export interface LeadItem {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  value: number;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'converted' | 'lost';
  rep: string;
  date: string;
  notes: LeadNote[];
  activity: LeadActivity[];
}

export const getSalesReps = () => {
  return [
    { label: 'John Doe', value: 'John Doe' },
    { label: 'Jane Smith', value: 'Jane Smith' },
    { label: 'Sarah Connor', value: 'Sarah Connor' },
    { label: 'Michael Scott', value: 'Michael Scott' },
  ];
};

export let mockLeads: LeadItem[] = [
  {
    id: '1',
    company: 'Acme Corp',
    contactName: 'John Acme',
    contactEmail: 'john@acme.com',
    value: 15000,
    status: 'new',
    rep: 'John Doe',
    date: '2026-07-01',
    notes: [
      { id: 'n1', content: 'Initial reachout via website form.', date: '2026-07-01 10:15' }
    ],
    activity: [
      { id: 'a1', type: 'creation', description: 'Opportunity created.', date: '2026-07-01 10:00' },
      { id: 'a2', type: 'note', description: 'Note added: Initial reachout via website form.', date: '2026-07-01 10:15' }
    ]
  },
  {
    id: '2',
    company: 'Initech LLC',
    contactName: 'Peter Gibbons',
    contactEmail: 'peter@initech.com',
    value: 24000,
    status: 'contacted',
    rep: 'Jane Smith',
    date: '2026-07-02',
    notes: [
      { id: 'n2', content: 'Scheduled a brief introductory demo call.', date: '2026-07-03 14:00' }
    ],
    activity: [
      { id: 'a3', type: 'creation', description: 'Opportunity created.', date: '2026-07-02 09:00' },
      { id: 'a4', type: 'status_change', description: 'Pipeline status changed to Contacted.', date: '2026-07-03 11:30' },
      { id: 'a5', type: 'note', description: 'Note added: Scheduled a brief introductory demo call.', date: '2026-07-03 14:00' }
    ]
  },
  {
    id: '3',
    company: 'Umbrella Corp',
    contactName: 'Albert Wesker',
    contactEmail: 'wesker@umbrella.com',
    value: 85000,
    status: 'negotiation',
    rep: 'John Doe',
    date: '2026-07-05',
    notes: [
      { id: 'n3', content: 'Discussing enterprise security integration licensing.', date: '2026-07-05 16:30' }
    ],
    activity: [
      { id: 'a6', type: 'creation', description: 'Opportunity created.', date: '2026-07-05 15:00' },
      { id: 'a7', type: 'status_change', description: 'Pipeline status changed to Negotiation.', date: '2026-07-05 16:00' },
      { id: 'a8', type: 'note', description: 'Note added: Discussing enterprise security integration licensing.', date: '2026-07-05 16:30' }
    ]
  },
  {
    id: '4',
    company: 'Titan Manufacturing',
    contactName: 'James Sterling',
    contactEmail: 'james@titanmfg.com',
    value: 120000,
    status: 'new',
    rep: 'Sarah Connor',
    date: '2026-07-07',
    notes: [],
    activity: [
      { id: 'a9', type: 'creation', description: 'Opportunity created.', date: '2026-07-07 11:00' }
    ]
  },
  {
    id: '5',
    company: 'Hooli Inc',
    contactName: 'Gavin Belson',
    contactEmail: 'gavin@hooli.com',
    value: 45000,
    status: 'lost',
    rep: 'Jane Smith',
    date: '2026-07-08',
    notes: [
      { id: 'n4', content: 'Lead decided to build details in-house instead.', date: '2026-07-09 15:45' }
    ],
    activity: [
      { id: 'a10', type: 'creation', description: 'Opportunity created.', date: '2026-07-08 09:30' },
      { id: 'a11', type: 'note', description: 'Note added: Lead decided to build details in-house.', date: '2026-07-09 15:45' },
      { id: 'a12', type: 'status_change', description: 'Pipeline status changed to Lost.', date: '2026-07-09 16:00' }
    ]
  },
  // Adding remaining leads to hit 25+ dataset size for paginated list view
  { id: '6', company: 'Aether Technologies', contactName: 'William Sterling', contactEmail: 'william@aethertech.com', value: 350000, status: 'qualified', rep: 'John Doe', date: '2026-07-10', notes: [], activity: [] },
  { id: '7', company: 'Soylent Corp', contactName: 'Robert Thorn', contactEmail: 'thorn@soylent.com', value: 8000, status: 'contacted', rep: 'Michael Scott', date: '2026-07-11', notes: [], activity: [] },
  { id: '8', company: 'Tyrell Corp', contactName: 'Eldon Tyrell', contactEmail: 'tyrell@tyrell.com', value: 95000, status: 'new', rep: 'Jane Smith', date: '2026-07-12', notes: [], activity: [] },
  { id: '9', company: 'Cyberdyne Systems', contactName: 'Miles Dyson', contactEmail: 'dyson@cyberdyne.com', value: 180000, status: 'negotiation', rep: 'Sarah Connor', date: '2026-07-12', notes: [], activity: [] },
  { id: '10', company: 'Dunder Mifflin', contactName: 'David Wallace', contactEmail: 'wallace@dundermifflin.com', value: 12000, status: 'converted', rep: 'Michael Scott', date: '2026-07-13', notes: [], activity: [] },
  { id: '11', company: 'Globex Corp', contactName: 'Hank Scorpio', contactEmail: 'scorpio@globex.com', value: 500000, status: 'qualified', rep: 'Sarah Connor', date: '2026-07-14', notes: [], activity: [] },
  { id: '12', company: 'Apex Logistics', contactName: 'Arthur Pendelton', contactEmail: 'arthur@apexlogistics.com', value: 250000, status: 'new', rep: 'Jane Smith', date: '2026-07-15', notes: [], activity: [] },
  { id: '13', company: 'Vanguard Energy', contactName: 'Norman Vance', contactEmail: 'vance@vanguardenergy.com', value: 130000, status: 'contacted', rep: 'John Doe', date: '2026-07-16', notes: [], activity: [] },
  { id: '14', company: 'Initech Labs', contactName: 'Bill Lumbergh', contactEmail: 'bill@initech.com', value: 29000, status: 'qualified', rep: 'Jane Smith', date: '2026-07-17', notes: [], activity: [] },
  { id: '15', company: 'Veer Industries', contactName: 'Vikas Veer', contactEmail: 'vikas@veer.com', value: 43000, status: 'lost', rep: 'Michael Scott', date: '2026-07-18', notes: [], activity: [] },
  { id: '16', company: 'Nakatomi Corp', contactName: 'Joe Takagi', contactEmail: 'takagi@nakatomi.com', value: 88000, status: 'new', rep: 'John Doe', date: '2026-07-19', notes: [], activity: [] },
  { id: '17', company: 'Reynholm Industries', contactName: 'Douglas Reynholm', contactEmail: 'douglas@reynholm.com', value: 31000, status: 'contacted', rep: 'Sarah Connor', date: '2026-07-20', notes: [], activity: [] },
  { id: '18', company: 'MomCorp', contactName: 'Carol Mom', contactEmail: 'mom@momcorp.com', value: 650000, status: 'qualified', rep: 'Sarah Connor', date: '2026-07-21', notes: [], activity: [] },
  { id: '19', company: 'Sterling Cooper', contactName: 'Don Draper', contactEmail: 'draper@sterling.com', value: 72000, status: 'negotiation', rep: 'Jane Smith', date: '2026-07-22', notes: [], activity: [] },
  { id: '20', company: 'Pied Piper', contactName: 'Richard Hendricks', contactEmail: 'richard@piedpiper.com', value: 110000, status: 'converted', rep: 'John Doe', date: '2026-07-23', notes: [], activity: [] },
  { id: '21', company: 'Saber International', contactName: 'Jo Bennett', contactEmail: 'jo@saber.com', value: 55000, status: 'new', rep: 'Michael Scott', date: '2026-07-24', notes: [], activity: [] },
  { id: '22', company: 'Krieger Labs', contactName: 'Algernop Krieger', contactEmail: 'krieger@kriegerlabs.com', value: 37000, status: 'contacted', rep: 'Jane Smith', date: '2026-07-25', notes: [], activity: [] },
  { id: '23', company: 'Prestige Worldwide', contactName: 'Dale Doback', contactEmail: 'dale@prestige.com', value: 4500, status: 'lost', rep: 'Michael Scott', date: '2026-07-26', notes: [], activity: [] },
  { id: '24', company: 'Buy More', contactName: 'Chuck Bartowski', contactEmail: 'chuck@buymore.com', value: 19000, status: 'qualified', rep: 'Sarah Connor', date: '2026-07-27', notes: [], activity: [] },
  { id: '25', company: 'Virtucon', contactName: 'Number Two', contactEmail: 'two@virtucon.com', value: 1000000, status: 'negotiation', rep: 'John Doe', date: '2026-07-28', notes: [], activity: [] },
  { id: '26', company: 'Gekko & Co', contactName: 'Gordon Gekko', contactEmail: 'gordon@gekko.com', value: 850000, status: 'converted', rep: 'Jane Smith', date: '2026-07-29', notes: [], activity: [] },
];

export const getLeads = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockLeads];
};

export const getLeadById = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const lead = mockLeads.find((l) => l.id === id);
  if (!lead) throw new Error('Lead not found');
  
  // Ensure default arrays exist
  if (!lead.notes) lead.notes = [];
  if (!lead.activity) lead.activity = [];
  
  return { ...lead };
};

export const createLead = async (lead: Omit<LeadItem, 'id' | 'notes' | 'activity'>) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newLead: LeadItem = {
    id: (mockLeads.length + 1).toString(),
    ...lead,
    notes: [],
    activity: [
      {
        id: `a_c_${Date.now()}`,
        type: 'creation',
        description: 'Opportunity created.',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      }
    ]
  };
  mockLeads.unshift(newLead);
  return newLead;
};

export const updateLead = async (id: string, updatedFields: Partial<Omit<LeadItem, 'id' | 'notes' | 'activity'>>) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const index = mockLeads.findIndex((l) => l.id === id);
  if (index === -1) throw new Error('Lead not found');
  
  const currentLead = mockLeads[index];
  const activityLogs: LeadActivity[] = [];
  
  if (updatedFields.status && updatedFields.status !== currentLead.status) {
    activityLogs.push({
      id: `a_s_${Date.now()}`,
      type: 'status_change',
      description: `Pipeline status changed from ${currentLead.status} to ${updatedFields.status}.`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
  }
  
  if (updatedFields.rep && updatedFields.rep !== currentLead.rep) {
    activityLogs.push({
      id: `a_r_${Date.now()}`,
      type: 'assignment',
      description: `Assigned rep updated to ${updatedFields.rep}.`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
  }

  mockLeads[index] = { 
    ...currentLead, 
    ...updatedFields,
    activity: [...(currentLead.activity || []), ...activityLogs]
  };
  return mockLeads[index];
};

export const updateLeadStatus = async (id: string, newStatus: LeadItem['status']) => {
  return updateLead(id, { status: newStatus });
};

export const addLeadNote = async (id: string, content: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockLeads.findIndex((l) => l.id === id);
  if (index === -1) throw new Error('Lead not found');
  
  const currentLead = mockLeads[index];
  const newNote: LeadNote = {
    id: `n_${Date.now()}`,
    content,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  
  const newActivity: LeadActivity = {
    id: `a_n_${Date.now()}`,
    type: 'note',
    description: `Note added: ${content}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  
  mockLeads[index] = {
    ...currentLead,
    notes: [newNote, ...(currentLead.notes || [])],
    activity: [...(currentLead.activity || []), newActivity]
  };
  
  return mockLeads[index];
};
