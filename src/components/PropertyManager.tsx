import React, { useState, useEffect } from 'react';
import { Home, Plus, Edit, Copy, Trash2, Eye, EyeOff, Save, X, Upload } from 'lucide-react';
import PropertyService, { Property } from '../services/PropertyService';

const PropertyManager: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [currentTab, setCurrentTab] = useState<'list' | 'edit'>('list');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = () => {
    setProperties(PropertyService.getProperties());
  };

  const handleAddProperty = () => {
    setEditingProperty(PropertyService.createEmptyProperty());
    setCurrentTab('edit');
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setCurrentTab('edit');
  };

  const handleSaveProperty = () => {
    if (!editingProperty) return;

    if (editingProperty.id) {
      PropertyService.updateProperty(editingProperty.id, editingProperty);
    } else {
      PropertyService.addProperty(editingProperty as Property);
    }

    loadProperties();
    setCurrentTab('list');
    setEditingProperty(null);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('Supprimer cette propriété ? Cette action est irréversible.')) {
      PropertyService.deleteProperty(id);
      loadProperties();
    }
  };

  const handleToggleActive = (id: string) => {
    const property = PropertyService.getPropertyById(id);
    if (property) {
      PropertyService.updateProperty(id, { isActive: !property.isActive });
      loadProperties();
    }
  };

  const handleTogglePublished = (id: string) => {
    const property = PropertyService.getPropertyById(id);
    if (property) {
      PropertyService.updateProperty(id, { isPublished: !property.isPublished });
      loadProperties();
    }
  };

  const handleDuplicate = (id: string) => {
    PropertyService.duplicateProperty(id);
    loadProperties();
  };

  if (currentTab === 'edit' && editingProperty) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentTab('list');
                setEditingProperty(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold">
              {editingProperty.id ? 'Modifier' : 'Nouvelle'} propriété
            </h2>
          </div>
          <button
            onClick={handleSaveProperty}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={20} />
            Enregistrer
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">Informations générales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input
                  type="text"
                  value={editingProperty.name}
                  onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Villa Mer & Soleil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  value={editingProperty.type}
                  onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="villa">Villa</option>
                  <option value="appartement">Appartement</option>
                  <option value="gite">Gîte</option>
                  <option value="chambre">Chambre</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Description courte *</label>
              <input
                type="text"
                value={editingProperty.description?.short}
                onChange={(e) => setEditingProperty({
                  ...editingProperty,
                  description: { ...editingProperty.description!, short: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Villa spacieuse avec piscine"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Description longue *</label>
              <textarea
                value={editingProperty.description?.long}
                onChange={(e) => setEditingProperty({
                  ...editingProperty,
                  description: { ...editingProperty.description!, long: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Description détaillée de votre propriété..."
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">Adresse</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingProperty.address?.street}
                onChange={(e) => setEditingProperty({
                  ...editingProperty,
                  address: { ...editingProperty.address!, street: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Rue"
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={editingProperty.address?.city}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    address: { ...editingProperty.address!, city: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ville"
                />
                <input
                  type="text"
                  value={editingProperty.address?.zipCode}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    address: { ...editingProperty.address!, zipCode: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Code postal"
                />
                <input
                  type="text"
                  value={editingProperty.address?.country}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    address: { ...editingProperty.address!, country: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Pays"
                />
              </div>
            </div>
          </div>

          {/* Capacité */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">Capacité</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Voyageurs</label>
                <input
                  type="number"
                  value={editingProperty.capacity?.guests}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    capacity: { ...editingProperty.capacity!, guests: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Chambres</label>
                <input
                  type="number"
                  value={editingProperty.capacity?.bedrooms}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    capacity: { ...editingProperty.capacity!, bedrooms: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lits</label>
                <input
                  type="number"
                  value={editingProperty.capacity?.beds}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    capacity: { ...editingProperty.capacity!, beds: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Salles de bain</label>
                <input
                  type="number"
                  value={editingProperty.capacity?.bathrooms}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    capacity: { ...editingProperty.capacity!, bathrooms: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Tarification */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">Tarification</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prix/nuit (€)</label>
                <input
                  type="number"
                  value={editingProperty.pricing?.basePrice}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    pricing: { ...editingProperty.pricing!, basePrice: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Frais ménage (€)</label>
                <input
                  type="number"
                  value={editingProperty.pricing?.cleaningFee}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    pricing: { ...editingProperty.pricing!, cleaningFee: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Caution (€)</label>
                <input
                  type="number"
                  value={editingProperty.pricing?.deposit}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    pricing: { ...editingProperty.pricing!, deposit: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Mes Propriétés</h2>
          <p className="text-gray-600 mt-1">{properties.length} propriété(s)</p>
        </div>
        <button
          onClick={handleAddProperty}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle propriété
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="relative h-48">
              <img
                src={property.coverPhoto || property.photos[0] || 'https://via.placeholder.com/400x300'}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                {property.isActive ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">Actif</span>
                ) : (
                  <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">Inactif</span>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{property.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{property.address.city}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{property.capacity.guests} pers.</span>
                <span>{property.capacity.bedrooms} ch.</span>
                <span className="font-semibold text-blue-600">{property.pricing.basePrice}€/nuit</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProperty(property)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Modifier
                </button>
                <button
                  onClick={() => handleToggleActive(property.id)}
                  className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                  title={property.isActive ? 'Désactiver' : 'Activer'}
                >
                  {property.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleDuplicate(property.id)}
                  className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                  title="Dupliquer"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyManager;
