import express from 'express';
import { Note } from '../models/Note.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { validateRequest, noteSchema, noteIdSchema } from '../middleware/validation.js';
import { createError } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /notes - Get all notes for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    // Transform notes to include 'id' field
    const transformedNotes = notes.map(note => ({
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    res.json({ notes: transformedNotes });
  } catch (error) {
    next(error);
  }
});

// POST /notes - Create a new note
router.post('/', authenticateToken, validateRequest(noteSchema), async (req: AuthRequest, res, next) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      userId: req.user._id,
      title,
      content,
    });

    await note.save();

    res.status(201).json({
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /notes/:id - Update a note
router.put('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate the id parameter
    if (!id) {
      throw createError('Note ID is required', 400, 'MISSING_ID');
    }

    // Validate the body data
    if (!title || !content) {
      throw createError('Title and content are required', 400, 'MISSING_FIELDS');
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      throw createError('Title and content cannot be empty', 400, 'EMPTY_FIELDS');
    }

    if (title.length > 200) {
      throw createError('Title too long (max 200 characters)', 400, 'TITLE_TOO_LONG');
    }

    if (content.length > 10000) {
      throw createError('Content too long (max 10000 characters)', 400, 'CONTENT_TOO_LONG');
    }

    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) {
      throw createError('Note not found', 404, 'NOTE_NOT_FOUND');
    }

    note.title = title.trim();
    note.content = content.trim();
    await note.save();

    res.json({
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /notes/:id - Delete a note
router.delete('/:id', authenticateToken, validateRequest(noteIdSchema), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) {
      throw createError('Note not found', 404, 'NOTE_NOT_FOUND');
    }

    await Note.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
