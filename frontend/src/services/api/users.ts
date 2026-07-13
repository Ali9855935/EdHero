export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

// Roles fetched dynamically
export const getRoles = () => {
  return [
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Viewer', value: 'Viewer' },
  ];
};

// Seed dataset of 25-30 users for pagination demo
export let mockUsers: UserItem[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'inactive' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'active' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'inactive' },
  { id: '6', name: 'David Lee', email: 'david@example.com', role: 'Viewer', status: 'active' },
  { id: '7', name: 'Eva Davis', email: 'eva@example.com', role: 'Manager', status: 'active' },
  { id: '8', name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'active' },
  { id: '9', name: 'Grace Wilson', email: 'grace@example.com', role: 'Admin', status: 'inactive' },
  { id: '10', name: 'Henry Taylor', email: 'henry@example.com', role: 'Viewer', status: 'active' },
  { id: '11', name: 'Ivy Thomas', email: 'ivy@example.com', role: 'Manager', status: 'active' },
  { id: '12', name: 'Jack White', email: 'jack@example.com', role: 'Viewer', status: 'active' },
  { id: '13', name: 'Karen Martin', email: 'karen@example.com', role: 'Viewer', status: 'inactive' },
  { id: '14', name: 'Leo Harris', email: 'leo@example.com', role: 'Manager', status: 'active' },
  { id: '15', name: 'Mia Clark', email: 'mia@example.com', role: 'Viewer', status: 'active' },
  { id: '16', name: 'Nathan Rodriguez', email: 'nathan@example.com', role: 'Admin', status: 'active' },
  { id: '17', name: 'Olivia Lewis', email: 'olivia@example.com', role: 'Viewer', status: 'inactive' },
  { id: '18', name: 'Paul Walker', email: 'paul@example.com', role: 'Viewer', status: 'active' },
  { id: '19', name: 'Quinn Hall', email: 'quinn@example.com', role: 'Manager', status: 'active' },
  { id: '20', name: 'Rachel Allen', email: 'rachel@example.com', role: 'Viewer', status: 'active' },
  { id: '21', name: 'Sam Young', email: 'sam@example.com', role: 'Admin', status: 'inactive' },
  { id: '22', name: 'Tina King', email: 'tina@example.com', role: 'Viewer', status: 'active' },
  { id: '23', name: 'Ulysses Baker', email: 'ulysses@example.com', role: 'Manager', status: 'active' },
  { id: '24', name: 'Victoria Green', email: 'victoria@example.com', role: 'Viewer', status: 'active' },
  { id: '25', name: 'William Carter', email: 'william@example.com', role: 'Viewer', status: 'inactive' },
  { id: '26', name: 'Xavier Adams', email: 'xavier@example.com', role: 'Manager', status: 'active' },
];

export const getUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockUsers];
};

export const getUserById = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error('User not found');
  return { ...user };
};

export const createUser = async (user: Omit<UserItem, 'id'>) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newUser: UserItem = {
    id: (mockUsers.length + 1).toString(),
    ...user,
  };
  mockUsers.unshift(newUser); // Add to the top of list
  return newUser;
};

export const updateUser = async (id: string, updatedFields: Partial<Omit<UserItem, 'id'>>) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('User not found');
  mockUsers[index] = { ...mockUsers[index], ...updatedFields };
  return mockUsers[index];
};

export const deleteUser = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  mockUsers = mockUsers.filter((u) => u.id !== id);
  return { success: true };
};
