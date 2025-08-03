import { firestoreService } from '../services/firestore.service';
import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const createSampleDataForUser = async (userId) => {
  try {
    console.log('Creating sample data for user:', userId);

    // Sample projects
    const projects = [
      {
        name: 'Website Redesign',
        description: 'Complete overhaul of company website with modern design and improved user experience',
        status: 'active',
        owner: userId,
        members: [userId]
      },
      {
        name: 'Mobile App Development',
        description: 'React Native app for iOS and Android platforms with real-time synchronization',
        status: 'active',
        owner: userId,
        members: [userId]
      },
      {
        name: 'Marketing Campaign',
        description: 'Q4 marketing campaign for product launch with social media integration',
        status: 'completed',
        owner: userId,
        members: [userId]
      }
    ];

    // Use batch operations for atomic creation
    const batch = writeBatch(db);
    const projectIds = [];
    const taskIds = [];
    
    // Prepare projects
    for (const project of projects) {
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const projectRef = doc(db, 'projects', projectId);
      batch.set(projectRef, {
        ...project,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      projectIds.push({ id: projectId, ...project });
    }

    // Sample tasks for each project
    const tasksData = [
      // Website Redesign Tasks
      {
        projectIndex: 0,
        tasks: [
          {
            title: 'Create wireframes for all pages',
            description: 'Design low-fidelity wireframes for homepage, about, services, and contact pages',
            priority: 'high',
            status: 'completed',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Implement responsive design',
            description: 'Ensure all components work perfectly on mobile, tablet, and desktop devices',
            priority: 'high',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Setup CI/CD pipeline',
            description: 'Configure automated testing and deployment with GitHub Actions',
            priority: 'medium',
            status: 'todo',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Optimize images and assets',
            description: 'Compress and optimize all images for better performance',
            priority: 'low',
            status: 'todo',
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      // Mobile App Tasks
      {
        projectIndex: 1,
        tasks: [
          {
            title: 'Setup React Native environment',
            description: 'Configure development environment for both iOS and Android platforms',
            priority: 'high',
            status: 'completed',
            dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Implement authentication flow',
            description: 'Create login, register, password reset, and social login screens',
            priority: 'high',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Design user interface',
            description: 'Create beautiful and intuitive UI components following design system',
            priority: 'medium',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Add push notifications',
            description: 'Integrate Firebase Cloud Messaging for real-time notifications',
            priority: 'low',
            status: 'todo',
            dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Implement offline mode',
            description: 'Allow app to work offline with local data synchronization',
            priority: 'medium',
            status: 'todo',
            dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      // Marketing Campaign Tasks
      {
        projectIndex: 2,
        tasks: [
          {
            title: 'Market research analysis',
            description: 'Analyze competitor strategies and target audience preferences',
            priority: 'high',
            status: 'completed',
            dueDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Create campaign assets',
            description: 'Design banners, social media posts, and promotional materials',
            priority: 'high',
            status: 'completed',
            dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            title: 'Launch social media campaign',
            description: 'Execute coordinated campaign across Facebook, Instagram, and LinkedIn',
            priority: 'medium',
            status: 'completed',
            dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];

    // Prepare tasks for each project
    for (const projectTasks of tasksData) {
      // Add bounds checking for projectIndex
      if (projectTasks.projectIndex < 0 || projectTasks.projectIndex >= projectIds.length) {
        console.error(`Invalid projectIndex: ${projectTasks.projectIndex}`);
        continue;
      }
      
      const project = projectIds[projectTasks.projectIndex];
      if (!project) {
        console.error(`Project not found at index: ${projectTasks.projectIndex}`);
        continue;
      }

      for (const task of projectTasks.tasks) {
        const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const taskRef = doc(db, 'tasks', taskId);
        batch.set(taskRef, {
          ...task,
          projectId: project.id,
          createdBy: userId,
          attachments: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
        taskIds.push(taskId);
      }
    }
    
    // Commit all operations atomically
    try {
      await batch.commit();
      console.log('Sample data creation completed!');
    } catch (error) {
      console.error('Failed to create sample data:', error);
      throw new Error(`Failed to create sample data: ${error.message}`);
    }

    console.log('Sample data creation completed!');
    return {
      projects: projectIds.length,
      tasks: tasksData.reduce((total, pt) => total + pt.tasks.length, 0)
    };

  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};

// Check if user already has data
export const userHasData = async (userId) => {
  try {
    const projects = await firestoreService.getProjects(userId);
    return projects.length > 0;
  } catch (error) {
    console.error('Error checking user data:', error);
    return false;
  }
};

// Create sample data only if user doesn't have any projects yet
export const initializeSampleDataIfNeeded = async (userId) => {
  try {
    const hasData = await userHasData(userId);

    if (!hasData) {
      console.log('User has no data, creating sample data...');
      return await createSampleDataForUser(userId);
    } else {
      console.log('User already has data, skipping sample data creation');
      return null;
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return null;
  }
};
