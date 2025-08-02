
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
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Download, FileImage, FileText, Loader2, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadResultsProps {
  resultsRef: React.RefObject<HTMLDivElement>;
  fileName: string;
}

const DownloadResults = ({ resultsRef, fileName }: DownloadResultsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const generateCanvas = async () => {
    if (!resultsRef.current) throw new Error("Result container not found.");

    const elementToCapture = resultsRef.current;
    const timestampElement = document.createElement('div');
    const now = new Date();
    timestampElement.innerText = `Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    timestampElement.style.padding = '10px';
    timestampElement.style.marginTop = '20px';
    timestampElement.style.textAlign = 'center';
    timestampElement.style.fontSize = '12px';
    timestampElement.style.color = 'gray';

    elementToCapture.appendChild(timestampElement);

    try {
        const canvas = await html2canvas(elementToCapture, {
            useCORS: true,
            scale: 2,
            backgroundColor: null,
        });
        return canvas;
    } finally {
        elementToCapture.removeChild(timestampElement);
    }
  };

  const handleShare = async () => {
    if (!resultsRef.current) return;
    setIsProcessing(true);

    try {
        const canvas = await generateCanvas();
        if (!canvas) throw new Error("Could not generate canvas.");

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) {
            throw new Error("Could not create blob from canvas");
        }

        const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'Loan Calculation Results',
                text: 'Check out my financial calculation from LoanSage!',
                files: [file],
            });
        } else {
            toast({
                title: "Share Not Supported",
                description: "Your browser doesn't support sharing files. Try downloading the result instead, or use a mobile device.",
                variant: 'destructive'
            });
        }
    } catch (error: any) {
        console.error('Error sharing:', error);
        if (error.name !== 'AbortError') { // Don't show error if user cancels share
            toast({
                title: "Sharing Failed",
                description: "Something went wrong while trying to share the results.",
                variant: 'destructive'
            });
        }
    } finally {
        setIsProcessing(false);
    }
  };


  const handleDownload = async (format: 'png' | 'jpeg' | 'pdf') => {
    if (!resultsRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = await generateCanvas();
       if (!canvas) throw new Error("Could not generate canvas.");

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
      toast({
        title: "Download Failed",
        description: "An error occurred while generating the download.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Share / Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
