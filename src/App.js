import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskDatePicker from './components/TaskDatePicker';  // Keep this if using TaskDatePicker
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../src/App.css';

// Registering chart.js components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  const [tasks, setTasks] = useState([
    { id: '1', name: 'Complete homework', status: 'pending', dueDate: null },
    { id: '2', name: 'Clean the house', status: 'completed', dueDate: null },
    { id: '3', name: 'Buy groceries', status: 'pending', dueDate: null },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);  // State for selected date for new task

  // Filter tasks based on the search query and filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Function to add a new task
  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask = {
        id: (tasks.length + 1).toString(),
        name: newTaskName,
        status: 'pending',
        dueDate: selectedDate, // Assign selected date to new task
      };
      setTasks([...tasks, newTask]);
      setNewTaskName('');
      setOpenDialog(false);
      setSelectedDate(null);  // Clear the date after task is added
    }
  };

  // Function to update the status of a task (e.g., completed or pending)
  const updateTaskStatus = (taskId, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: status } : task
      )
    );
  };

  // Function to delete a task
  const deleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setOpenConfirmDialog(false);
      setTaskToDelete(null);
    }
  };

  // Handle drag and drop to reorder tasks
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  // Calculate completed and pending tasks
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  // Calculate task percentages
  const completedPercentage = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
  const pendingPercentage = tasks.length ? (pendingTasks / tasks.length) * 100 : 0;

  // Chart Data for Pie Chart
  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Task Status',
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#4caf50', '#ff9800'],
      },
    ],
  };

  return (
    <div>
      <h1>Task Dashboard</h1>

      {/* Search input */}
      <TextField
        label="Search Tasks"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      {/* Filter Dropdown */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Filter by Status</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filter by Status"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </Select>
      </FormControl>

      {/* Add Task Button */}
      <Button id= "a" variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Add Task
      </Button>

      {/* Add Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Name"
            variant="outlined"
            fullWidth
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          {/* Date Picker */}
          <TaskDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addTask} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this task?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={deleteTask} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task List with Drag and Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ padding: 0, listStyle: 'none' }}
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: '#f4f4f4',
                        borderRadius: '5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div>
                        <span>{task.name}</span>
                        {task.dueDate && (
                          <div>
                            <strong>Due Date:</strong> {task.dueDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => updateTaskStatus(task.id, task.status === 'pending' ? 'completed' : 'pending')}
                        >
                          {task.status === 'pending' ? 'Mark as Completed' : 'Mark as Pending'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => {
                            setTaskToDelete(task.id); // Set task to delete
                            setOpenConfirmDialog(true); // Open confirmation dialog
                          }}
                          style={{ marginLeft: '10px' }}
                        >
                          Delete
                        </Button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
  <div style={{ width: '30%' }}>
    <Pie data={chartData} />
  </div>

  {/* Task Statistics */}
  <div style={{ width: '45%', marginTop: '80px'  }}>
    <Typography variant="h6">Task Statistics</Typography>
    <Typography>Total: {pendingTasks+completedTasks}</Typography>
    <Typography>Completed: {completedTasks}</Typography>
    <Typography>Pending: {pendingTasks}</Typography>
    <Typography>Completed Percentage: {completedPercentage.toFixed(2)}%</Typography>
    <Typography>Pending Percentage: {pendingPercentage.toFixed(2)}%</Typography>
  </div>
</div>

    </div>
  );
};

export default App;
