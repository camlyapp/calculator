"use client";

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Download, FileImage, FileText, Loader2 } from 'lucide-react';

interface DownloadResultsProps {
  resultsRef: React.RefObject<HTMLDivElement>;
  fileName: string;
}

const DownloadResults = ({ resultsRef, fileName }: DownloadResultsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: 'png' | 'jpeg' | 'pdf') => {
    if (!resultsRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(resultsRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null, 
      });

      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${fileName}.pdf`);
      } else {
        const image = canvas.toDataURL(`image/${format}`, 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = `${fileName}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating download:', error);
      // You might want to show a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isDownloading}>
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download Results
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleDownload('png')}>
          <FileImage className="mr-2 h-4 w-4" />
          Download as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('jpeg')}>
          <FileImage className="mr-2 h-4 w-4" />
          Download as JPG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadResults;
