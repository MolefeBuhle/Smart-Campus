// Storage keys for all data in the application
export const STORAGE_KEYS = {
  USERS: 'campus_users',
  APPOINTMENTS: 'campus_appointments',
  MAINTENANCE: 'campus_maintenance',
  NOTIFICATIONS: 'campus_notifications',
  TIME_SLOTS: 'campus_time_slots',
  ROOMS: 'campus_rooms',
  CURRENT_USER: 'campus_current_user'
};

// Get data from localStorage
export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

// Save data to localStorage
export const setData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting data for key ${key}:`, error);
    return false;
  }
};

// Add a new item to a collection
export const addItem = (key, item) => {
  const items = getData(key) || [];
  const newItem = { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() };
  items.push(newItem);
  setData(key, items);
  return newItem;
};

// Update an existing item in a collection
export const updateItem = (key, itemId, updates, idField = 'id') => {
  const items = getData(key) || [];
  const index = items.findIndex(item => item[idField] === itemId);
  
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    setData(key, items);
    return items[index];
  }
  return null;
};

// Delete an item from a collection
export const deleteItem = (key, itemId, idField = 'id') => {
  const items = getData(key) || [];
  const filteredItems = items.filter(item => item[idField] !== itemId);
  setData(key, filteredItems);
  return filteredItems;
};

// Get a single item from a collection by ID
export const getItem = (key, itemId, idField = 'id') => {
  const items = getData(key) || [];
  return items.find(item => item[idField] === itemId) || null;
};