import { useState, useEffect } from 'react';
import { firestoreService } from '../services/firestore.service';
import { useAuth } from './useAuth';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!projectId || !user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    // Fetch tasks for this project
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await firestoreService.getTasks(projectId);
        console.log('useTasks: Fetched tasks:', tasksData);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Setup real-time listener
    const unsubscribe = firestoreService.subscribeToTasks(projectId, (updatedTasks) => {
      console.log('useTasks: Real-time update received:', updatedTasks);
      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, [projectId, user]);

  const createTask = async (taskData) => {
    try {
      const taskId = await firestoreService.createTask({
        ...taskData,
        projectId,
        createdBy: user.uid,
      });
      // Real-time listener will handle the update

      return taskId;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      await firestoreService.updateTask(taskId, updates);
      // Real-time listener will handle the update
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await firestoreService.deleteTask(taskId);
      // Real-time listener will handle the update
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // Helper functions for kanban board
  const getTasksByStatus = () => {
    // Ensure tasks is always an array and filter out invalid tasks
    const validTasks = (tasks || []).filter((task) => task && task.id && task.status);

    return {
      todo: validTasks.filter((task) => task.status === 'todo'),
      'in-progress': validTasks.filter((task) => task.status === 'in-progress'),
      completed: validTasks.filter((task) => task.status === 'completed'),
    };
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      console.log(`🔄 moveTask called: ${taskId} -> ${newStatus}`);
      await firestoreService.updateTask(taskId, { status: newStatus });
      // Real-time listener will handle the UI update
    } catch (err) {
      console.error('Error moving task:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    moveTask,
  };
};
