import React, { useState, useEffect } from 'react';
import './App.css';

// Get API URL from environment or default to local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [wines, setWines] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Red',
    region: '',
    vintage: new Date().getFullYear(),
    rating: 5,
    price: '',
    notes: '',
    photo: null
  });
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wines on mount
  useEffect(() => {
    fetchWines();
  }, []);

  const fetchWines = async () => {
    try {
      const response = await fetch(`${API_URL}/api/wines`);
      if (response.ok) {
        const data = await response.json();
        setWines(data);
      }
    } catch (err) {
      setError('Failed to load wines');
      console.error('Error fetching wines:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let photoUrl = formData.photo;
      
      // Upload photo if selected
      if (photoFile) {
        const formDataPhoto = new FormData();
        formDataPhoto.append('file', photoFile);
        
        const photoResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formDataPhoto
        });
        
        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          photoUrl = photoData.url;
        }
      }

      const wineData = {
        ...formData,
        vintage: parseInt(formData.vintage),
        rating: parseInt(formData.rating),
        price: formData.price ? parseFloat(formData.price) : null,
        photo: photoUrl
      };

      const url = editingId 
        ? `${API_URL}/api/wines/${editingId}`
        : `${API_URL}/api/wines`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wineData)
      });

      if (response.ok) {
        await fetchWines();
        resetForm();
      } else {
        throw new Error('Failed to save wine');
      }
    } catch (err) {
      setError('Failed to save wine');
      console.error('Error saving wine:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wine) => {
    setFormData({
      name: wine.name,
      type: wine.type,
      region: wine.region,
      vintage: wine.vintage,
      rating: wine.rating,
      price: wine.price || '',
      notes: wine.notes || '',
      photo: wine.photo
    });
    setEditingId(wine.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this wine?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/wines/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchWines();
      }
    } catch (err) {
      setError('Failed to delete wine');
      console.error('Error deleting wine:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Red',
      region: '',
      vintage: new Date().getFullYear(),
      rating: 5,
      price: '',
      notes: '',
      photo: null
    });
    setEditingId(null);
    setPhotoFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🍷 Wine Notes</h1>
        <p>Track and remember your favorite wines</p>
      </header>

      <main className="container">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <section className="form-section">
          <h2>{editingId ? 'Edit Wine' : 'Add New Wine'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Wine Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Château Margaux"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Red">Red</option>
                  <option value="White">White</option>
                  <option value="Rosé">Rosé</option>
                  <option value="Sparkling">Sparkling</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Fortified">Fortified</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="region">Region *</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Bordeaux, France"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vintage">Vintage</label>
                <input
                  type="number"
                  id="vintage"
                  name="vintage"
                  value={formData.vintage}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (1-10) *</label>
                <input
                  type="range"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
                <span className="rating-value">{formData.rating}/10</span>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="29.99"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Tasting Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe the aroma, taste, finish..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="photo">Photo</label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {formData.photo && (
                  <img 
                    src={formData.photo.startsWith('data:') ? formData.photo : `${API_URL}${formData.photo}`} 
                    alt="Wine preview" 
                    className="photo-preview"
                  />
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Wine' : 'Add Wine')}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="wines-section">
          <h2>Your Wine Collection ({wines.length})</h2>
          <div className="wines-grid">
            {wines.map(wine => (
              <div key={wine.id} className="wine-card">
                {wine.photo && (
                  <img 
                    src={wine.photo.startsWith('data:') ? wine.photo : `${API_URL}${wine.photo}`} 
                    alt={wine.name}
                    className="wine-photo"
                  />
                )}
                <div className="wine-details">
                  <h3>{wine.name}</h3>
                  <p className="wine-type">{wine.type} • {wine.vintage}</p>
                  <p className="wine-region">📍 {wine.region}</p>
                  <div className="wine-rating">
                    {'⭐'.repeat(Math.round(wine.rating / 2))}
                    <span> {wine.rating}/10</span>
                  </div>
                  {wine.price && <p className="wine-price">${wine.price}</p>}
                  {wine.notes && <p className="wine-notes">{wine.notes}</p>}
                  <div className="wine-actions">
                    <button onClick={() => handleEdit(wine)}>Edit</button>
                    <button onClick={() => handleDelete(wine.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;