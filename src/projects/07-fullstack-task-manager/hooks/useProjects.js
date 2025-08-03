import { useState, useEffect } from 'react';
import { firestoreService } from '../services/firestore.service';
import { useAuth } from './useAuth';
import { initializeSampleDataIfNeeded } from '../utils/sampleData';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    // Initialize sample data for new users
    const initializeUser = async () => {
      try {
        setLoading(true);
        
        // Check if user needs sample data and create it
        const sampleDataResult = await initializeSampleDataIfNeeded(user.uid, user.displayName);
        if (sampleDataResult) {
          console.log(`Created ${sampleDataResult.projects} projects and ${sampleDataResult.tasks} tasks for new user`);
        }

        // Fetch projects (including any newly created sample data)
        const projectsData = await firestoreService.getProjects(user.uid);
        setProjects(projectsData);
      } catch (err) {
        console.error('Error initializing user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    // Setup real-time listener
    const unsubscribe = firestoreService.subscribeToProjects(user.uid, (updatedProjects) => {
      setProjects(updatedProjects);
    });

    return () => unsubscribe();
  }, [user]);

  const createProject = async (projectData) => {
    try {
      console.log('useProjects: Creating project for user:', user.uid);
      const projectId = await firestoreService.createProject({
        ...projectData,
        owner: user.uid,
        members: [user.uid]
      });
      
      console.log('useProjects: Project created with ID:', projectId);
      // Real-time listener will handle the update
      
      return projectId;
    } catch (err) {
      console.error('Error in createProject hook:', err);
      throw err;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      await firestoreService.updateProject(projectId, updates);
      // Real-time listener will handle the update
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await firestoreService.deleteProject(projectId);
      // Real-time listener will handle the update
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject
  };
};