import { User } from '@shared/schema';

export interface AsesorData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bidangKompetensi?: string;
  nomorRegistrasi?: string;
  isActive?: boolean;
}

// Fungsi untuk menambahkan asesor
export async function createAsesor(data: AsesorData): Promise<User> {
  // Gunakan XMLHttpRequest sebagai alternatif dari fetch
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/admin/asesors?_=${Date.now()}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error('Invalid JSON response: ' + xhr.responseText));
        }
      } else {
        reject(new Error(`${xhr.status}: ${xhr.statusText || xhr.responseText}`));
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('Network error occurred'));
    };
    
    xhr.send(JSON.stringify(data));
  });
}

// Fungsi untuk mengupdate asesor
export async function updateAsesor(id: number, data: Partial<AsesorData>): Promise<User> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `/api/admin/asesors/${id}?_=${Date.now()}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error('Invalid JSON response: ' + xhr.responseText));
        }
      } else {
        reject(new Error(`${xhr.status}: ${xhr.statusText || xhr.responseText}`));
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('Network error occurred'));
    };
    
    xhr.send(JSON.stringify(data));
  });
}

// Fungsi untuk menghapus asesor
export async function deleteAsesor(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/admin/asesors/${id}?_=${Date.now()}`, true);
    xhr.withCredentials = true;
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`${xhr.status}: ${xhr.statusText || xhr.responseText}`));
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('Network error occurred'));
    };
    
    xhr.send();
  });
}

// Fungsi untuk mendapatkan daftar asesor
export async function getAsesors(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/admin/asesors?_=${Date.now()}`, true);
    xhr.withCredentials = true;
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error('Invalid JSON response: ' + xhr.responseText));
        }
      } else {
        reject(new Error(`${xhr.status}: ${xhr.statusText || xhr.responseText}`));
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('Network error occurred'));
    };
    
    xhr.send();
  });
}