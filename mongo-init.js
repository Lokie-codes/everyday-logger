// mongo-init.js
db = db.getSiblingDB('task_tracker');

// Create user for the application
db.createUser({
  user: 'task_app_user',
  pwd: 'task_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'task_tracker'
    }
  ]
});

// Create collections
db.createCollection('tasks');
db.createCollection('taskCompletions');

// Insert default tasks
const defaultTasks = [
  {
    name: "Wake up at 6.30AM",
    isDefault: true,
    userId: "default_user",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Meditate for 5 mins",
    isDefault: true,
    userId: "default_user",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Go To Gym",
    isDefault: true,
    userId: "default_user",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Go for walking",
    isDefault: true,
    userId: "default_user",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.tasks.insertMany(defaultTasks);

// Create indexes
db.tasks.createIndex({ userId: 1 });
db.taskCompletions.createIndex({ userId: 1, date: 1 });
db.taskCompletions.createIndex({ taskId: 1, date: 1 });