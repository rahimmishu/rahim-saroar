/// <reference types="vite/client" />

interface ImportMetaEnv {
  // ── Cloudinary (browser-safe) ──────────────────────────
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
  readonly VITE_GALLERY_ADMIN_EMAIL: string;

  // ── অন্য VITE_ variables যদি থাকে add করুন ────────────
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
