// Mock data generator for testing and demo purposes

export const generateMockProjects = (userId) => [
  {
    id: 'demo_project_1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    owner: userId,
    members: [userId],
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_project_2',
    name: 'Mobile App Development',
    description: 'React Native app for iOS and Android platforms',
    owner: userId,
    members: [userId],
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_project_3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for payment and analytics',
    owner: userId,
    members: [userId],
    status: 'completed',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const generateMockTasks = (projectId, userId = 'demo-user') => {
  const tasksByProject = {
    demo_project_1: [
      {
        id: 'task_1',
        title: 'Create wireframes',
        description: 'Design low-fidelity wireframes for all pages',
        projectId: 'demo_project_1',
        assignedTo: null,
        priority: 'high',
        status: 'completed',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'task_2',
        title: 'Implement responsive design',
        description: 'Ensure all components work on mobile, tablet, and desktop',
        projectId: 'demo_project_1',
        assignedTo: null,
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_3',
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        projectId: 'demo_project_1',
        assignedTo: null,
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    demo_project_2: [
      {
        id: 'task_4',
        title: 'Setup React Native environment',
        description: 'Configure development environment for both platforms',
        projectId: 'demo_project_2',
        assignedTo: null,
        priority: 'high',
        status: 'completed',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'task_5',
        title: 'Implement authentication flow',
        description: 'Create login, register, and password reset screens',
        projectId: 'demo_project_2',
        assignedTo: null,
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_6',
        title: 'Add push notifications',
        description: 'Integrate Firebase Cloud Messaging',
        projectId: 'demo_project_2',
        assignedTo: null,
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    demo_project_3: [
      {
        id: 'task_7',
        title: 'Research payment providers',
        description: 'Compare Stripe, PayPal, and Square APIs',
        projectId: 'demo_project_3',
        assignedTo: null,
        priority: 'high',
        status: 'completed',
        dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'task_8',
        title: 'Implement Stripe integration',
        description: 'Setup payment processing with Stripe API',
        projectId: 'demo_project_3',
        assignedTo: null,
        priority: 'high',
        status: 'completed',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        createdBy: userId,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  return tasksByProject[projectId] || [];
};

// Initialize demo data in localStorage if not exists
export const initializeDemoData = (_userId) =>
  // Skip demo data initialization - use real Firestore instead
  false;

// Clear demo data from localStorage
export const clearDemoData = () => {
  localStorage.removeItem('taskManager_projects');
  localStorage.removeItem('taskManager_tasks');
  console.log('Demo data cleared from localStorage');
};
