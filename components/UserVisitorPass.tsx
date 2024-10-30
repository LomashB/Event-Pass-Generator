"use client";

import html2canvas from "html2canvas";
import React, { useRef, useEffect, useState } from "react";

interface RegisterData {
  name: string;
  photo: string;
}

interface VisitorPassProps {
  data: RegisterData;
  onClose: () => void;
}

export default function VisitorPass({ data, onClose }: VisitorPassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [dataImage, setDataImage] = useState<string | null>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current === event.target) {
        onClose();
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    draw();
  }, [dataImage]);

  const draw = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      setLoading(true);
      setError(null);

      const visaTemplate = new Image();
      visaTemplate.src = "/fulvadi-invite-web.png"; 

      visaTemplate.onload = () => {
        canvas.width = visaTemplate.width;
        canvas.height = visaTemplate.height;

        setDimensions({
          width: visaTemplate.width,
          height: visaTemplate.height,
        });

        ctx.drawImage(visaTemplate, 0, 0);

        if (data.photo) {
          const userImg = new Image();
          userImg.src = data.photo;

          userImg.onload = () => {
            const photoAreaX = 785;
            const photoAreaY = 945;
            const photoAreaWidth = 167;
            const photoAreaHeight = 181;

            const scaleX = photoAreaWidth / userImg.width;
            const scaleY = photoAreaHeight / userImg.height;
            const scale = Math.max(scaleX, scaleY);

            const newWidth = userImg.width * scale;
            const newHeight = userImg.height * scale;

            const x = photoAreaX + (photoAreaWidth - newWidth) / 2;
            const y = photoAreaY + (photoAreaHeight - newHeight) / 2;

            ctx.save();
            ctx.beginPath();
            ctx.rect(photoAreaX, photoAreaY, photoAreaWidth, photoAreaHeight);
            ctx.clip();

            ctx.drawImage(userImg, x, y, newWidth, newHeight);
            ctx.restore();

            ctx.fillStyle = "white";
            ctx.font = "bold 24px Arial";
            ctx.textAlign = "left";

            const name = data.name || "JOHN DOE";
            ctx.fillText(name, 507, 1131);

            setLoading(false);
          };

          userImg.onerror = () => {
            setError("Failed to load user photo");
            setLoading(false);
          };
        } else {
          setLoading(false);
        }
      };

      visaTemplate.onerror = () => {
        setError("Failed to load template");
        setLoading(false);
      };
    }
  };

  const handleDownload = async () => {
    if (loading || error) return;

    const content = canvasRef.current;
    if (!content) return;

    try {
      setLoading(true);
      setError(null);

      html2canvas(content, { useCORS: true, allowTaint: true }).then((cnvs) => {
        if (cnvs.toDataURL) {
          const dataURL = cnvs.toDataURL("image/png", 1.0);
          console.log(dataURL);
          setDataImage(dataURL);
          const link = document.createElement("a");
          link.href = dataURL;
          link.download = `visitor-pass-${
            data.name?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "user"
          }-${new Date().getTime()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
      setLoading(false);
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "Failed to download image");
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
          <div className="p-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div
                ref={contentRef}
                className="relative flex items-center justify-center"
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    aspectRatio: dimensions.width / dimensions.height,
                  }}
                  className="rounded-lg"
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <div className="text-red-500 text-center p-4">{error}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={handleDownload}
                disabled={loading || !!error}
                className={`w-full py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                  loading || error
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {loading
                  ? "Processing..."
                  : error
                  ? "Try Again"
                  : "Download Photo"}
              </button>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
