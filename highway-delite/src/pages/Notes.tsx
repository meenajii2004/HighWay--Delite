import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, X, Check, Loader2, Save } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, truncateText } from '../lib/utils';
import toast from 'react-hot-toast';
import logoImage from '../assets/Logo.svg';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateNoteData {
  title: string;
  content: string;
}

interface EditNoteData {
  id: string;
  title: string;
  content: string;
}

const Notes = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateNoteData>({ title: '', content: '' });
  const [editData, setEditData] = useState<CreateNoteData>({ title: '', content: '' });

  // Fetch notes
  const { data: notesData, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await api.get('/notes');
      return response.data;
    },
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteData) => api.post('/notes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      toast.success('Note created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create note');
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: (data: EditNoteData) => api.put(`/notes/${data.id}`, { title: data.title, content: data.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setEditingNote(null);
      setEditData({ title: '', content: '' });
      toast.success('Note updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update note');
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => api.delete(`/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete note');
    },
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    createNoteMutation.mutate(formData);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditData({ title: note.title, content: note.content });
  };

  const handleUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.title.trim() || !editData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote, ...editData });
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditData({ title: '', content: '' });
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const notes = notesData?.notes || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="HD Logo" 
                className="h-8 w-8 mr-2"
              />
              <h1 className="text-xl font-semibold text-gray-900">HD</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Note Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </button>
        </div>

        {/* Create Note Form */}
        {showCreateForm && (
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Create New Note</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field mt-1"
                  placeholder="Enter note title"
                  maxLength={200}
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input-field mt-1 resize-none"
                  rows={4}
                  placeholder="Enter note content"
                  maxLength={10000}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createNoteMutation.isPending}
                  className="btn-primary flex items-center"
                >
                  {createNoteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Create Note
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Edit className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first note to get started
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes
              .filter((note: Note) => note && note.id) // Filter out notes without IDs
              .map((note: Note) => (
              <div key={note.id} className="card">
                {editingNote === note.id ? (
                  // Edit Form
                  <form onSubmit={handleUpdateNote} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Edit Note</h3>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div>
                      <label htmlFor={`edit-title-${note.id}`} className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id={`edit-title-${note.id}`}
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="input-field mt-1"
                        placeholder="Enter note title"
                        maxLength={200}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`edit-content-${note.id}`} className="block text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <textarea
                        id={`edit-content-${note.id}`}
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                        className="input-field mt-1 resize-none"
                        rows={4}
                        placeholder="Enter note content"
                        maxLength={10000}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateNoteMutation.isPending}
                        className="btn-primary flex items-center"
                      >
                        {updateNoteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  // Note Display
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditNote(note)}
                          disabled={deleteNoteMutation.isPending}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit note"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={deleteNoteMutation.isPending}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                      {truncateText(note.content, 150)}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      Created: {formatDate(note.createdAt)}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
