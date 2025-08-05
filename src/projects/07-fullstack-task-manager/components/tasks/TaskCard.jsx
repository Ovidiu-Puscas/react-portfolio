import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const TaskCard = ({ task, onEdit, onDelete, onMove, isDragging = false }) => {
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      onDelete(task.id);
    }
    handleMenuClose();
  };

  const handleStatusChange = (newStatus) => {
    onMove(task.id, newStatus);
    handleMenuClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'error.main' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'warning.main' };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, color: 'warning.main' };
    } else {
      return { text: date.toLocaleDateString(), color: 'text.secondary' };
    }
  };

  const dueDate = formatDate(task.dueDate);

  return (
    <Card
      sx={{
        mb: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        '&:hover': {
          boxShadow: isDragging ? 4 : 2,
          transform: isDragging ? 'scale(1.02)' : 'translateY(-1px)',
        },
        transition: 'all 0.2s ease-in-out',
        boxShadow: isDragging ? 4 : 1,
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Typography variant="subtitle1" component="h3" sx={{ flex: 1, fontWeight: 'medium' }}>
            {task.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={task.priority}
            size="small"
            color={getPriorityColor(task.priority)}
            variant="outlined"
          />

          {dueDate && (
            <Typography
              variant="caption"
              sx={{
                color: dueDate.color,
                fontWeight: dueDate.color === 'error.main' ? 'bold' : 'normal',
              }}
            >
              {dueDate.text}
            </Typography>
          )}
        </Box>
      </CardContent>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={() => handleStatusChange('todo')}>Move to To Do</MenuItem>
        <MenuItem onClick={() => handleStatusChange('in-progress')}>Move to In Progress</MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>Move to Completed</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default TaskCard;
