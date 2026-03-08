import { Upload, FileText } from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  onFileSelect: (file: File) => void;
}

const UploadDropzone = ({ onFileSelect }: Props) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      }`}
    >
      {fileName ? (
        <>
          <FileText className="h-10 w-10 text-primary" />
          <p className="text-sm font-medium text-foreground">{fileName}</p>
          <p className="text-xs text-muted-foreground">File ready. Click "Translate" to proceed.</p>
        </>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Drag & drop your PDF here</p>
            <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
          </div>
        </>
      )}
      <input type="file" accept=".pdf" onChange={handleChange} className="absolute inset-0 cursor-pointer opacity-0" />
    </div>
  );
};

export default UploadDropzone;
