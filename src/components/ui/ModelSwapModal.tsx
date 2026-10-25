import React, { useState } from 'react';
import { X, Box, Check, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { DEFAULT_3D_MODEL_URL } from '../3d/AstronautScene';

interface ModelSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModelUrl: string;
  onApplyModelUrl: (url: string) => void;
}

export const ModelSwapModal: React.FC<ModelSwapModalProps> = ({
  isOpen,
  onClose,
  activeModelUrl,
  onApplyModelUrl,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(activeModelUrl || DEFAULT_3D_MODEL_URL);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCodeSnippet = () => {
    navigator.clipboard.writeText(`export const DEFAULT_3D_MODEL_URL = '${inputUrl}';`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const samplePresets = [
    {
      name: 'Procedural NASA EVA Twin (Built-in)',
      url: '',
      desc: 'High-performance composite digital twin with pulsing chest beacon & holographic rings',
    },
    {
      name: 'Sci-Fi Flight Helmet (Default)',
      url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      desc: 'Three.js official PBR damaged sci-fi astronaut helmet asset',
    },
    {
      name: 'Khronos Flight Helmet GLTF',
      url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/FlightHelmet/glTF/FlightHelmet.gltf',
      desc: 'Khronos Group PBR flight helmet model',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-xl p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-mono font-bold text-white tracking-wider">
              3D MODEL LOADER CONFIGURATION
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Swap with your custom GLTF or GLB 3D assets
            </p>
          </div>
        </div>

        {/* Source Code Location Guide */}
        <div className="p-3 mb-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between text-cyan-300 font-semibold">
            <span>FILE: /src/components/3d/AstronautScene.ts</span>
            <span className="text-[10px] text-slate-400">Line 14</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            In your code, you can easily swap the default URL anytime by editing:
          </p>
          <div className="relative flex items-center justify-between p-2 rounded bg-black/60 border border-slate-800 text-cyan-400 text-[11px] overflow-x-auto">
            <code>export const DEFAULT_3D_MODEL_URL = &quot;{inputUrl || DEFAULT_3D_MODEL_URL}&quot;;</code>
            <button
              onClick={handleCopyCodeSnippet}
              className="ml-2 p-1 text-slate-400 hover:text-white transition-colors shrink-0"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live URL Input */}
        <div className="space-y-1.5 mb-4">
          <label className="text-xs font-mono text-slate-300 block">
            LIVE TEST 3D MODEL URL (.gltf or .glb):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://.../model.gltf or leave blank for Procedural Twin"
              className="flex-1 px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => {
                onApplyModelUrl(inputUrl);
                onClose();
              }}
              className="flex items-center gap-1 px-4 py-2 text-xs font-mono font-bold bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-mono text-slate-400">QUICK PRESETS:</span>
          <div className="space-y-1.5">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputUrl(preset.url);
                  onApplyModelUrl(preset.url);
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-colors flex items-center justify-between ${
                  inputUrl === preset.url
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="font-semibold text-white">{preset.name}</div>
                  <div className="text-[10px] text-slate-400">{preset.desc}</div>
                </div>
                {inputUrl === preset.url && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
