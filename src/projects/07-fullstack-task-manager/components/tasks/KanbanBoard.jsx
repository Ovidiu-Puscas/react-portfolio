import React from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, Paper, Button, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const KanbanBoard = ({ tasksByStatus, onCreateTask, onMoveTask }) => {
  const columns = [
    { id: 'todo', title: 'To Do', color: '#f5f5f5' },
    { id: 'in-progress', title: 'In Progress', color: '#e3f2fd' },
    { id: 'completed', title: 'Completed', color: '#e8f5e8' },
  ];

  // Portal for drag clones to avoid padding issues
  const portal = document.createElement('div');
  document.body.appendChild(portal);

  React.useEffect(
    () => () => {
      if (document.body.contains(portal)) {
        document.body.removeChild(portal);
      }
    },
    [portal]
  );

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If no destination or dropped in same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      return;
    }

    // If moved to different column, update task status
    if (destination.droppableId !== source.droppableId) {
      onMoveTask(draggableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 3, overflow: 'auto' }}>
        {columns.map((column) => (
          <Paper
            key={column.id}
            sx={{
              minWidth: 300,
              flex: 1,
              p: 2,
              backgroundColor: column.color,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Column Header */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Badge badgeContent={tasksByStatus[column.id]?.length || 0} color="primary">
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {column.title}
                </Typography>
              </Badge>

              {column.id === 'todo' && (
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={onCreateTask}
                  variant="outlined"
                  sx={{
                    minWidth: 'auto',
                    fontSize: '0.75rem',
                    py: 0.5,
                  }}
                >
                  Add
                </Button>
              )}
            </Box>

            {/* Droppable Column */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    minHeight: 200,
                    backgroundColor: snapshot.isDraggingOver
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                    borderRadius: 1,
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {tasksByStatus[column.id]?.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 100,
                        color: 'text.secondary',
                        fontStyle: 'italic',
                      }}
                    >
                      {snapshot.isDraggingOver ? 'Drop here' : 'No tasks'}
                    </Box>
                  ) : (
                    tasksByStatus[column.id]?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => {
                          const taskElement = (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 2,
                                mb: 1,
                                bgcolor: 'white',
                                borderRadius: 1,
                                boxShadow: 1,
                                cursor: 'grab',
                                opacity: snapshot.isDragging ? 0.8 : 1,
                                transform: snapshot.isDragging
                                  ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                                  : provided.draggableProps.style?.transform,
                                '&:active': { cursor: 'grabbing' },
                              }}
                            >
                              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {task.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                {task.priority} priority
                              </Typography>
                            </Box>
                          );

                          // Render dragging clone in portal to avoid padding issues
                          if (snapshot.isDragging) {
                            return ReactDOM.createPortal(taskElement, portal);
                          }

                          return taskElement;
                        }}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Paper>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard;
