import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import KanbanBoard from '../tasks/KanbanBoard';
import TaskForm from '../tasks/TaskForm';
import { useTasks } from '../../hooks/useTasks';

const ProjectDetail = ({ project, onBack }) => {
  const { tasks, loading, createTask, updateTask, deleteTask, getTasksByStatus, moveTask } =
    useTasks(project.id);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleCreateTask = async (formData) => {
    await createTask(formData);
    setTaskFormOpen(false);
  };

  const handleEditTask = async (formData) => {
    await updateTask(selectedTask.id, formData);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleMoveTask = async (taskId, newStatus) => {
    await moveTask(taskId, newStatus);
  };

  const handleEditTaskClick = (task) => {
    setSelectedTask(task);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={onBack}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <ArrowBackIcon fontSize="small" />
            Back to Projects
          </Link>
          <Typography variant="body2" color="text.primary">
            {project.name}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {project.name}
          </Typography>
          <Chip
            label={project.status}
            color={project.status === 'active' ? 'success' : 'default'}
          />
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">
            Tasks ({tasks.length})
          </Typography>
          <Button variant="contained" onClick={() => setTaskFormOpen(true)} startIcon={<AddIcon />}>
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Kanban Board */}
      <KanbanBoard
        tasksByStatus={getTasksByStatus()}
        onCreateTask={() => setTaskFormOpen(true)}
        onEditTask={handleEditTaskClick}
        onDeleteTask={handleDeleteTask}
        onMoveTask={handleMoveTask}
      />

      {/* Create Task Dialog */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Edit Task Dialog */}
      <TaskForm
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSubmit={handleEditTask}
        task={selectedTask}
      />
    </Container>
  );
};

export default ProjectDetail;
