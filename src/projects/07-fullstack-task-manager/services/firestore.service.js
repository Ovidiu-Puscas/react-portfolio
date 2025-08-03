import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

class FirestoreService {
  // Projects CRUD
  async createProject(projectData) {
    try {
      console.log('Creating project with data:', projectData);
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log('Project created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating project in Firestore:', error);
      // Fallback to local storage if Firestore fails
      return this.createProjectLocal(projectData);
    }
  }

  async getProjects(userId) {
    try {
      console.log('Fetching projects for user:', userId);
      
      // Query projects where user is owner
      const ownerQuery = query(
        collection(db, 'projects'),
        where('owner', '==', userId)
      );
      
      // Query projects where user is a member  
      const memberQuery = query(
        collection(db, 'projects'),
        where('members', 'array-contains', userId)
      );
      
      // Execute both queries
      const [ownerSnapshot, memberSnapshot] = await Promise.all([
        getDocs(ownerQuery),
        getDocs(memberQuery)
      ]);
      
      // Combine results and remove duplicates
      const projectsMap = new Map();
      
      ownerSnapshot.docs.forEach(doc => {
        projectsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      memberSnapshot.docs.forEach(doc => {
        projectsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      const userProjects = Array.from(projectsMap.values());
      console.log('Filtered projects for user:', userProjects);
      return userProjects;
    } catch (error) {
      console.error('Error fetching projects from Firestore:', error);
      return this.getProjectsLocal(userId);
    }
  }

  async updateProject(projectId, updates) {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      return this.updateProjectLocal(projectId, updates);
    }
  }

  async deleteProject(projectId) {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return this.deleteProjectLocal(projectId);
    }
  }

  // Tasks CRUD
  async createTask(taskData) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      return this.createTaskLocal(taskData);
    }
  }

  async getTasks(projectId) {
    try {
      console.log('Fetching tasks for project:', projectId);
      
      // Use server-side filtering with where clause
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('projectId', '==', projectId)
      );
      
      const snapshot = await getDocs(tasksQuery);
      const projectTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Filtered tasks for project:', projectTasks);
      return projectTasks;
    } catch (error) {
      console.error('Error fetching tasks from Firestore:', error);
      return this.getTasksLocal(projectId);
    }
  }

  async updateTask(taskId, updates) {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return this.updateTaskLocal(taskId, updates);
    }
  }

  async deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return this.deleteTaskLocal(taskId);
    }
  }

  // Real-time listeners
  subscribeToProjects(userId, callback) {
    try {
      console.log('Setting up real-time listener for user:', userId);
      
      // Listen to projects where user is owner
      const ownerQuery = query(
        collection(db, 'projects'),
        where('owner', '==', userId)
      );
      
      return onSnapshot(ownerQuery, (snapshot) => {
        console.log('Firestore snapshot received, docs:', snapshot.docs.length);
        
        const userProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Real-time projects for user:', userProjects);
        callback(userProjects);
      }, (error) => {
        console.error('Real-time listener error:', error);
        this.pollProjectsLocal(userId, callback);
      });
    } catch (error) {
      console.error('Error setting up projects listener:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  subscribeToTasks(projectId, callback) {
    try {
      console.log('Setting up real-time listener for tasks in project:', projectId);
      
      // Use server-side filtering with where clause
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('projectId', '==', projectId)
      );
      
      return onSnapshot(tasksQuery, (snapshot) => {
        console.log('Tasks snapshot received, docs:', snapshot.docs.length);
        
        const projectTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Real-time tasks for project:', projectTasks);
        callback(projectTasks);
      }, (error) => {
        console.error('Real-time tasks listener error:', error);
        this.pollTasksLocal(projectId, callback);
      });
    } catch (error) {
      console.error('Error setting up tasks listener:', error);
      return () => {};
    }
  }

  // Local Storage Fallback Methods
  createProjectLocal(projectData) {
    const projects = JSON.parse(localStorage.getItem('taskManager_projects') || '[]');
    const newProject = {
      ...projectData,
      id: `local_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    localStorage.setItem('taskManager_projects', JSON.stringify(projects));
    return newProject.id;
  }

  getProjectsLocal(userId) {
    const projects = JSON.parse(localStorage.getItem('taskManager_projects') || '[]');
    return projects.filter(p => p.members?.includes(userId));
  }

  updateProjectLocal(projectId, updates) {
    const projects = JSON.parse(localStorage.getItem('taskManager_projects') || '[]');
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('taskManager_projects', JSON.stringify(projects));
      return true;
    }
    return false;
  }

  deleteProjectLocal(projectId) {
    const projects = JSON.parse(localStorage.getItem('taskManager_projects') || '[]');
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem('taskManager_projects', JSON.stringify(filtered));
    return true;
  }

  createTaskLocal(taskData) {
    const tasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
    const newTask = {
      ...taskData,
      id: `local_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
    return newTask.id;
  }

  getTasksLocal(projectId) {
    const tasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
    return tasks.filter(t => t.projectId === projectId);
  }

  updateTaskLocal(taskId, updates) {
    const tasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
      return true;
    }
    return false;
  }

  deleteTaskLocal(taskId) {
    const tasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
    const filtered = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('taskManager_tasks', JSON.stringify(filtered));
    return true;
  }

  pollProjectsLocal(userId, callback) {
    // Poll local storage every 2 seconds for changes
    let intervalId = null;
    try {
      intervalId = setInterval(() => {
        try {
          const projects = this.getProjectsLocal(userId);
          callback(projects);
        } catch (error) {
          console.error('Error in projects polling:', error);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }, 2000);
    } catch (error) {
      console.error('Error setting up projects polling:', error);
    }
    
    // Return cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }

  pollTasksLocal(projectId, callback) {
    let intervalId = null;
    try {
      intervalId = setInterval(() => {
        try {
          const tasks = this.getTasksLocal(projectId);
          callback(tasks);
        } catch (error) {
          console.error('Error in tasks polling:', error);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }, 2000);
    } catch (error) {
      console.error('Error setting up tasks polling:', error);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }
}

export const firestoreService = new FirestoreService();