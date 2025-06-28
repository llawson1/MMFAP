
import { Router } from 'express';
import UploadedDataProcessor from '../services/uploaded-data-processor.js';

const router = Router();

// Process latest uploaded team data
router.get('/process-latest', async (req, res) => {
  try {
    const result = await UploadedDataProcessor.processLatestUpload();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to process uploaded data: ${error}`
    });
  }
});

// Validate uploaded data
router.post('/validate', async (req, res) => {
  try {
    const { data } = req.body;
    const validation = await UploadedDataProcessor.validateUploadedData(data);
    res.json(validation);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Validation failed: ${error}`
    });
  }
});

// Get upload statistics
router.get('/stats', async (req, res) => {
  try {
    const result = await UploadedDataProcessor.processLatestUpload();
    if (result.success && result.stats) {
      res.json({
        success: true,
        stats: result.stats,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No uploaded data found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get stats: ${error}`
    });
  }
});

// Get detailed file information
router.get('/files', async (req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const uploadDir = path.join(process.cwd(), 'attached_assets');
    const files = fs.readdirSync(uploadDir)
      .filter(file => 
        file.endsWith('.xls') || 
        file.endsWith('.xlsx') || 
        file.endsWith('.csv') ||
        file.endsWith('.txt')
      )
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime,
          type: file.split('.').pop(),
          encoding: 'auto-detected'
        };
      })
      .sort((a, b) => b.modified.getTime() - a.modified.getTime());

    res.json({
      success: true,
      files,
      totalFiles: files.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to list files: ${error}`
    });
  }
});

export default router;
