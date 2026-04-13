import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { getData, STORAGE_KEYS } from '../../utils/storage';
import toast from 'react-hot-toast';

const MaintenanceForm = () => {
  const { reportIssue } = useMaintenance();
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    roomId: '',
    roomName: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allRooms = getData(STORAGE_KEYS.ROOMS) || [];
    setRooms(allRooms);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'roomId') {
      const selectedRoom = rooms.find(room => room.id === value);
      setFormData({
        ...formData,
        roomId: value,
        roomName: selectedRoom ? selectedRoom.name : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.roomId) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await reportIssue(
      formData.title,
      formData.description,
      formData.roomId,
      formData.roomName,
      formData.priority
    );
    setLoading(false);

    if (result.success) {
      setFormData({
        title: '',
        description: '',
        roomId: '',
        roomName: '',
        priority: 'medium'
      });
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Report a Maintenance Issue</h1>
        <p className="text-blue-100">Help us keep our campus facilities in top condition</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Broken projector, AC not working"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location/Room
                </label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.building} (Floor {room.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === 'low'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Low</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={formData.priority === 'medium'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Medium</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={formData.priority === 'high'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">High</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Please provide a detailed description of the issue..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Guidelines</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>⚠️ Emergency Issues:</strong> For urgent matters (fire, flood, electrical hazard), call campus security immediately: <strong>011-555-1111</strong>
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>📸 Include Photos:</strong> If possible, attach photos of the issue
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>⏱️ Response Time:</strong> 
                  <br />High priority: 24 hours
                  <br />Medium priority: 3 days
                  <br />Low priority: 5 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceForm;