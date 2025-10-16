import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const OverlayManager = ({ overlays, onOverlayUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingOverlay, setEditingOverlay] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    content: '',
    color: '#000000', // NEW: Default text color
    position: { x: 50, y: 50 },
    size: { width: '150px', height: '40px' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOverlay) {
        await axios.put(`${API_BASE}/overlays/${editingOverlay._id}`, formData);
      } else {
        await axios.post(`${API_BASE}/overlays`, formData);
      }
      resetForm();
      onOverlayUpdate();
    } catch (error) {
      console.error('Error saving overlay:', error);
      alert('Error saving overlay: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (overlayId) => {
    if (window.confirm('Are you sure you want to delete this overlay?')) {
      try {
        await axios.delete(`${API_BASE}/overlays/${overlayId}`);
        onOverlayUpdate();
      } catch (error) {
        console.error('Error deleting overlay:', error);
        alert('Error deleting overlay: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleEdit = (overlay) => {
    setEditingOverlay(overlay);
    setFormData({
      name: overlay.name,
      type: overlay.type,
      content: overlay.content,
      position: overlay.position,
      size: overlay.size
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'text',
      content: '',
      color: '#000000', // NEW: Reset to default color
      position: { x: 50, y: 50 },
      size: { width: '150px', height: '40px' }
    });
    setEditingOverlay(null);
    setShowForm(false);
  };

  return (
    <div className="overlay-manager">
      <div className="overlay-header">
        <h3>🎨 Overlay Manager</h3>
        <button onClick={() => setShowForm(true)} className="add-btn">
          + Add Overlay
        </button>
      </div>

      {showForm && (
        <div className="overlay-form">
          <h4>{editingOverlay ? '✏️ Edit' : '➕ Add'} Overlay</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter overlay name"
              required
            />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="logo">Logo</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              {formData.type === 'text' ? 'Text Content:' : 'Logo URL:'}
            </label>
            {formData.type === 'text' ? (
              <input
                type="text"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter text to display"
                required
              />
            ) : (
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            )}
          </div>

          {/* NEW: Color Picker for Text Overlays */}
          {formData.type === 'text' && (
            <div className="form-group">
              <label>Text Color:</label>
              <div className="color-picker-container">
                <input
                  type="color"
                  value={formData.color || '#000000'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="color-picker"
                />
                <span className="color-value">{formData.color || '#000000'}</span>
                <div className="color-presets">
                  {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className="color-preset"
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Size:</label>
            <div className="size-inputs">
              <input
                type="text"
                placeholder="Width (e.g., 150px)"
                value={formData.size.width}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  size: { ...formData.size, width: e.target.value }
                })}
              />
              <input
                type="text"
                placeholder="Height (e.g., 40px)"
                value={formData.size.height}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  size: { ...formData.size, height: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingOverlay ? 'Update' : 'Create'} Overlay
            </button>
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
        </div>
      )}

      <div className="overlay-list">
        <h5>Active Overlays ({overlays.length})</h5>
        {overlays.length === 0 ? (
          <p className="no-overlays">No overlays created yet. Add one to get started!</p>
        ) : (
          overlays.map((overlay) => (
            <div key={overlay._id} className="overlay-item">
              <div className="overlay-info">
                <strong>{overlay.name}</strong>
                <span className="overlay-type">Type: {overlay.type}</span>
                <span className="overlay-content">
                  {overlay.type === 'text' ? overlay.content : 'Logo Image'}
                </span>
              </div>
              <div className="overlay-actions">
                <button 
                  onClick={() => handleEdit(overlay)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(overlay._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OverlayManager;