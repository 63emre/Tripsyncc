import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Desteklenen dosya türleri
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Maksimum dosya boyutu (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Dosya türünün izin verilen türler arasında olup olmadığını kontrol eder
 * @param mimetype MIME türü
 * @returns İzin verilen bir tür mü
 */
export function isAllowedFileType(mimetype: string): boolean {
  return ALLOWED_FILE_TYPES.includes(mimetype);
}

/**
 * Dosya boyutunun izin verilen maksimum boyutu aşıp aşmadığını kontrol eder
 * @param size Boyut (byte)
 * @returns İzin verilen bir boyut mu
 */
export function isAllowedFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

/**
 * Dosya adını güvenli hale getirerek özel karakterleri temizler ve benzersiz bir isim oluşturur
 * @param fileName Orijinal dosya adı
 * @returns Güvenli ve benzersiz dosya adı
 */
export function sanitizeFileName(fileName: string): string {
  const extension = path.extname(fileName);
  const uniqueName = uuidv4();
  
  return `${uniqueName}${extension}`;
}

/**
 * Yükleme dizinini kontrol eder ve yoksa oluşturur
 * @param subdir Alt dizin (uploads/ altında)
 * @returns Tam dizin yolu
 */
export function ensureUploadDirectory(subdir: string = ''): string {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  return uploadDir;
}

/**
 * FormData'dan dosyayı ve diğer alanları çıkarır
 * @param request HTTP isteği
 * @param fieldName Dosya alan adı
 * @returns Dosya ve diğer alanlar
 */
export async function extractFileFromFormData(request: NextRequest, fieldName: string = 'file') {
  try {
    const formData = await request.formData();
    const file = formData.get(fieldName) as File;
    
    if (!file) {
      throw new Error('Dosya bulunamadı');
    }
    
    if (!isAllowedFileType(file.type)) {
      throw new Error('Desteklenmeyen dosya türü');
    }
    
    if (!isAllowedFileSize(file.size)) {
      throw new Error(`Dosya boyutu çok büyük (maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
    }
    
    return {
      file,
      otherFields: Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => key !== fieldName)
      ),
    };
  } catch (error) {
    throw new Error(`Dosya çıkarma hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
}

/**
 * Dosyayı diske kaydereder ve public URL'ini döndürür
 * @param file Kaydedilecek dosya
 * @param subdir Alt dizin (uploads/ altında)
 * @returns Public URL
 */
export async function saveFileToDisk(file: File, subdir: string = ''): Promise<string> {
  try {
    const uploadDir = ensureUploadDirectory(subdir);
    const fileName = sanitizeFileName(file.name);
    const filePath = path.join(uploadDir, fileName);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    fs.writeFileSync(filePath, buffer);
    
    return `/uploads/${subdir ? `${subdir}/` : ''}${fileName}`;
  } catch (error) {
    throw new Error(`Dosya kaydetme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
}

/**
 * FormData'dan gelen dosyayı işleyerek kaydeder
 * @param formData Form verisi
 * @param fieldName Alan adı
 * @param folder Kaydedilecek klasör
 * @returns Kaydedilen dosya URL'i
 */
export async function handleFileUpload(
  formData: FormData,
  fieldName: string = 'file',
  folder: string = 'general'
): Promise<string | null> {
  try {
    // Form verisinden dosyayı al
    const file = formData.get(fieldName) as File;
    
    if (!file) {
      console.error(`${fieldName} alanında dosya bulunamadı`);
      return null;
    }
    
    // Dosya türü kontrolü
    if (!isAllowedFileType(file.type)) {
      console.error(`Desteklenmeyen dosya türü: ${file.type}`);
      return null;
    }
    
    // Dosya boyutu kontrolü
    if (!isAllowedFileSize(file.size)) {
      console.error(`Dosya boyutu çok büyük: ${file.size} bytes`);
      return null;
    }
    
    // Dosya içeriğini arraybuffer'a çevir
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Dosya için benzersiz isim oluştur
    const fileName = sanitizeFileName(file.name);
    
    // Klasör yolu
    const uploadFolder = ensureUploadDirectory(folder);
    
    // Dosya yolu
    const filePath = path.join(uploadFolder, fileName);
    
    // Dosyayı kaydet
    fs.writeFileSync(filePath, buffer);
    
    // Dosya URL'ini döndür
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return null;
  }
}

/**
 * Dosya boyutunu insanların okuyabileceği formata çevirir
 * @param bytes Byte cinsinden boyut
 * @returns Formatlanmış boyut
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

/**
 * Dosyayı siler
 * @param fileUrl Dosyanın URL'i
 * @returns Silme işlemi başarılı mı?
 */
export function deleteFile(fileUrl: string): boolean {
  try {
    // URL'den dosya yolunu çıkar
    const publicBasePath = '/uploads/';
    const relativePath = fileUrl.startsWith(publicBasePath) ? fileUrl.substring(publicBasePath.length) : fileUrl;
    
    const filePath = path.join(process.cwd(), 'public', 'uploads', relativePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Dosya silme hatası:', error);
    return false;
  }
}