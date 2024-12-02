import React, { useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { addTask, deleteTask, setSearchQuery, setFilter, reorderTasks, updateTask } from '../features/tasksSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const TaskDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [open, setOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Filtered tasks based on the state
  const filteredTasks = tasks
    .filter((task) => {
      const matchFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'pending' && !task.completed) ||
        (filter === 'overdue' && new Date(task.dueDate) < new Date());
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });

  // Add new task
  const handleAddTask = () => {
    dispatch(addTask({ id: Date.now(), title, description, dueDate, completed: false }));
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  // Delete task from the list
  const handleDeleteTask = () => {
    dispatch(deleteTask(taskToDelete));
    setTaskToDelete(null);
    setOpen(false);
  };

  // Update search query in state
  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  // Update filter in state
  const handleFilterChange = (event) => {
    dispatch(setFilter(event.target.value));
  };

  // Drag-and-drop for reordering tasks
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    dispatch(reorderTasks({ sourceIndex: source.index, destinationIndex: destination.index }));
  };

  return (
    <div>
      <TextField
        label="Search Tasks"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div>
        {/* Filter buttons */}
        <Button variant="contained" onClick={() => handleFilterChange('all')}>All Tasks</Button>
        <Button variant="contained" onClick={() => handleFilterChange('completed')}>Completed</Button>
        <Button variant="contained" onClick={() => handleFilterChange('pending')}>Pending</Button>
        <Button variant="contained" onClick={() => handleFilterChange('overdue')}>Overdue</Button>
      </div>

      <h1>Task Management Dashboard</h1>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <Button onClick={handleAddTask}>Add Task</Button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Due: {task.dueDate}</p>

                        {/* Checkbox to toggle completion */}
                        <FormControlLabel
                          control={<Checkbox 
                                    checked={task.completed} 
                                    onChange={() => dispatch(updateTask({ ...task, completed: !task.completed }))} 
                                  />}
                          label="Completed"
                        />

                        {/* Button to trigger task deletion */}
                        <Button onClick={() => { setTaskToDelete(task.id); setOpen(true); }}>Delete</Button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Confirmation modal for deletion */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteTask} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const TaskDetails = () => {
  return <h1>Task Details Page</h1>;
};
