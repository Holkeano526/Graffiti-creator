
export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultUrl: string | null;
}

export interface UploadedFile {
  file: File;
  preview: string;
}
