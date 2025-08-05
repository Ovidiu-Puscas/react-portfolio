import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthPage from './components/auth/AuthPage';
import Header from './components/common/Header';
import { useProjects } from './hooks/useProjects';
import ProjectForm from './components/projects/ProjectForm';
import ProjectDetail from './components/projects/ProjectDetail';
import { createSampleDataForUser } from './utils/sampleData';
import TaskManagerErrorFallback from './components/common/TaskManagerErrorFallback';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Dashboard = () => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProject, setMenuProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [creatingDemoData, setCreatingDemoData] = useState(false);

  const handleCreateProject = async (formData) => {
    try {
      // Creating project with form data
      await createProject(formData);
      // Project created successfully
      setFormOpen(false);
    } catch (error) {
      console.error('Dashboard: Error creating project:', error);
    }
  };

  const handleEditProject = async (formData) => {
    await updateProject(selectedProject.id, formData);
    setSelectedProject(null);
  };

  const handleDeleteProject = async () => {
    if (menuProject) {
      await deleteProject(menuProject.id);
    }
    setMenuAnchor(null);
    setMenuProject(null);
  };

  const handleMenuOpen = (event, project) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuProject(project);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuProject(null);
  };

  const handleEditClick = () => {
    setSelectedProject(menuProject);
    handleMenuClose();
  };

  const handleProjectClick = (project) => {
    setViewingProject(project);
  };

  const handleBackToProjects = () => {
    setViewingProject(null);
  };

  const handleCreateSampleData = async () => {
    setCreatingDemoData(true);
    try {
      await createSampleDataForUser(user.uid);
      // Created sample projects and tasks - data will refresh automatically via real-time listener
    } catch (error) {
      console.error('Error creating sample data:', error);
    } finally {
      setCreatingDemoData(false);
    }
  };

  // If viewing a specific project, show ProjectDetail
  if (viewingProject) {
    return <ProjectDetail project={viewingProject} onBack={handleBackToProjects} />;
  }

  return (
    <Container sx={{ py: 4 }} data-testid="projects-list">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          My Projects
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          New Project
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading projects...</Typography>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              No projects yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Create your first project to get started!
            </Typography>
            <Button
              variant="outlined"
              onClick={handleCreateSampleData}
              disabled={creatingDemoData}
              sx={{ mr: 2 }}
            >
              {creatingDemoData ? 'Creating...' : 'Add Sample Data'}
            </Button>
            <Typography variant="caption" color="text.secondary">
              Creates 3 projects with realistic tasks to explore the app
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }} data-testid="projects-grid">
          {projects.map((project) => (
            <Box
              key={project.id}
              sx={{ width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' } }}
            >
              <Card
                sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                onClick={() => handleProjectClick(project)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
                      {project.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={project.status}
                        size="small"
                        color={project.status === 'active' ? 'success' : 'default'}
                      />
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, project)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {project.members?.length || 1} member(s)
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Project Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Create Project Dialog */}
      <ProjectForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Edit Project Dialog */}
      <ProjectForm
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onSubmit={handleEditProject}
        project={selectedProject}
      />
    </Container>
  );
};

// Main app content that uses auth
const AppContent = () => {
  const { user, loading } = useAuth();

  // AppContent - checking user and loading state

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
};

const TaskManagerApp = () => (
  <ErrorBoundary
    FallbackComponent={TaskManagerErrorFallback}
    onReset={() => window.location.reload()}
  >
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box
          sx={{
            height: '100%',
            bgcolor: 'rgb(249 250 251 / 0.65)',
            borderRadius: '16px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <AppContent />
        </Box>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default TaskManagerApp;
