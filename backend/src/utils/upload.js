import multer from 'multer';
import path from 'path';

// Konfigurasi penyimpanan lokal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Simpan di folder public/uploads
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Penamaan file unik: timestamp + ekstensi asli
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter hanya gambar
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak valid. Hanya JPG, PNG, dan WEBP yang diperbolehkan.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Maksimal 5MB
  },
  fileFilter: fileFilter
});

export default upload;
