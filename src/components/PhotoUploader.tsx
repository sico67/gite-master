import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  photos: string[];
  coverPhoto?: string;
  onPhotosChange: (photos: string[], coverPhoto?: string) => void;
  maxPhotos?: number;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  photos = [], 
  coverPhoto,
  onPhotosChange,
  maxPhotos = 10 
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos autorisées`);
      return;
    }

    setUploading(true);

    try {
      const newPhotos: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Vérifier taille (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert(`${file.name} est trop volumineux (max 2MB)`);
          continue;
        }

        // Vérifier type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} n'est pas une image`);
          continue;
        }

        // Convertir en base64
        const base64 = await fileToBase64(file);
        newPhotos.push(base64);
      }

      const updatedPhotos = [...photos, ...newPhotos];
      const newCoverPhoto = coverPhoto || (updatedPhotos.length > 0 ? updatedPhotos[0] : undefined);
      
      onPhotosChange(updatedPhotos, newCoverPhoto);
    } catch (error) {
      console.error('Erreur upload photos:', error);
      alert('Erreur lors de l\'upload des photos');
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Redimensionner l'image
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max 1200px de largeur
          if (width > 1200) {
            height = (height * 1200) / width;
            width = 1200;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compression JPEG 80%
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressed);
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    let newCoverPhoto = coverPhoto;

    // Si on supprime la photo de couverture, prendre la première
    if (coverPhoto === photos[index]) {
      newCoverPhoto = updatedPhotos.length > 0 ? updatedPhotos[0] : undefined;
    }

    onPhotosChange(updatedPhotos, newCoverPhoto);
  };

  const handleSetCover = (index: number) => {
    onPhotosChange(photos, photos[index]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Photos ({photos.length}/{maxPhotos})
        </h3>
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || photos.length >= maxPhotos}
            className="hidden"
          />
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
            uploading || photos.length >= maxPhotos
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
            <Upload size={16} />
            {uploading ? 'Upload...' : 'Ajouter photos'}
          </div>
        </label>
      </div>

      {/* Grid photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`relative group rounded-lg overflow-hidden border-2 ${
              coverPhoto === photo ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-32 object-cover"
            />
            
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
              {coverPhoto !== photo && (
                <button
                  onClick={() => handleSetCover(index)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-opacity"
                >
                  Couverture
                </button>
              )}
              <button
                onClick={() => handleRemovePhoto(index)}
                className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>

            {/* Badge couverture */}
            {coverPhoto === photo && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                Couverture
              </div>
            )}
          </div>
        ))}

        {/* Placeholder si pas de photos */}
        {photos.length === 0 && (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <ImageIcon className="text-gray-400 mb-3" size={48} />
            <p className="text-sm text-gray-500 mb-2">Aucune photo ajoutée</p>
            <p className="text-xs text-gray-400">Cliquez sur "Ajouter photos" pour commencer</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Conseils:</strong> Max {maxPhotos} photos, 2MB par photo. 
          Les images sont automatiquement redimensionnées et compressées.
          {coverPhoto && ' La première photo sert de couverture par défaut.'}
        </p>
      </div>
    </div>
  );
};

export default PhotoUploader;
