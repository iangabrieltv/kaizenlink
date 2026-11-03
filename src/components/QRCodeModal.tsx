import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, Globe, Sparkles, ExternalLink } from 'lucide-react';
import { LinkItem } from '../types/index';

interface QRCodeModalProps {
  link: LinkItem | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ link, onClose }) => {
  const [domainMode, setDomainMode] = useState<'official' | 'active'>('official');
  const [copied, setCopied] = useState(false);
  const [svgData, setSvgData] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!link) return null;

  const activeHost = typeof window !== 'undefined' ? window.location.origin : '';
  const officialUrl = `https://kaizen.visual/${link.slug}`;
  const activeUrl = `${activeHost}/r/${link.slug}`;
  const targetUrl = domainMode === 'official' ? officialUrl : activeUrl;

  useEffect(() => {
    if (!targetUrl || !canvasRef.current) return;

    // Render Canvas QR Code (PNG)
    QRCode.toCanvas(
      canvasRef.current,
      targetUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#101113',
          light: '#FFFFFF',
        },
      },
      (error) => {
        if (error) console.error('Error generating canvas QR:', error);
      }
    );

    // Render SVG string
    QRCode.toString(
      targetUrl,
      {
        type: 'svg',
        margin: 2,
        color: {
          dark: '#101113',
          light: '#FFFFFF',
        },
      },
      (err, svg) => {
        if (!err && svg) {
          setSvgData(svg);
        }
      }
    );
  }, [targetUrl, link]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${link.slug}_kaizen.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSVG = () => {
    if (!svgData) return;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${link.slug}_kaizen.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1B1D21] border border-[#292C31] rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#292C31]">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#F5F5F5]">QR Code do Link</h3>
            <p className="text-xs text-[#92969F]">{link.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#92969F] hover:text-[#F5F5F5] hover:bg-[#202227] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Domain Toggle */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-[#92969F] mb-1.5 block">
            Apontar QR Code para qual endereço?
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#151619] border border-[#292C31]">
            <button
              type="button"
              onClick={() => setDomainMode('official')}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                domainMode === 'official'
                  ? 'bg-[#C5A46D] text-[#101113] font-semibold shadow-xs'
                  : 'text-[#92969F] hover:text-[#F5F5F5]'
              }`}
            >
              <span className="flex items-center gap-1 font-heading">
                <Globe className="w-3 h-3" /> kaizen.visual
              </span>
              <span className="text-[10px] opacity-80">Domínio da Marca</span>
            </button>

            <button
              type="button"
              onClick={() => setDomainMode('active')}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                domainMode === 'active'
                  ? 'bg-[#C5A46D] text-[#101113] font-semibold shadow-xs'
                  : 'text-[#92969F] hover:text-[#F5F5F5]'
              }`}
            >
              <span className="flex items-center gap-1 font-heading">
                <Sparkles className="w-3 h-3" /> URL Ativa
              </span>
              <span className="text-[10px] opacity-80">Teste Imediato</span>
            </button>
          </div>
        </div>

        {/* QR Code Canvas Card */}
        <div className="my-5 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-black/50 border border-[#292C31]">
            <canvas ref={canvasRef} className="rounded-lg block" />
          </div>

          <div className="mt-3 flex items-center gap-2 max-w-full px-3 py-1.5 rounded-lg bg-[#151619] border border-[#292C31]">
            <span className="text-xs font-mono text-[#C5A46D] truncate">{targetUrl}</span>
            <button
              onClick={copyUrl}
              className="text-[#92969F] hover:text-[#F5F5F5] transition-colors cursor-pointer shrink-0"
              title="Copiar URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#43B581]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {domainMode === 'official' && (
            <p className="text-[11px] text-[#92969F] mt-1 text-center">
              Perfeito para impressos, cartões de visita e campanhas de clientes.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#292C31]">
          <button
            onClick={downloadPNG}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#202227] hover:bg-[#292C31] text-[#F5F5F5] text-xs font-semibold border border-[#292C31] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C5A46D]" />
            <span>Baixar PNG</span>
          </button>
          <button
            onClick={downloadSVG}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C5A46D] hover:bg-[#d4b680] text-[#101113] text-xs font-bold transition-colors cursor-pointer shadow-md shadow-[#C5A46D]/15"
          >
            <Download className="w-4 h-4" />
            <span>Baixar SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
