import React from 'react';

export const SketchfabAstronaut: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent border-0 shadow-none select-none">
      <iframe
        title="Astronaut"
        src="https://sketchfab.com/models/f176f4f0408d4034b4d3ef62f05b2332/embed?autostart=1&preload=1&ui_theme=dark&transparent=1&ui_infos=0&ui_watermark=0&ui_controls=0&ui_general_controls=0&ui_fullscreen=0&ui_ar=0&ui_vr=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_hint=0"
        className="absolute -top-11 -bottom-11 left-0 right-0 w-full h-[calc(100%+88px)] border-0 bg-transparent"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        loading="eager"
      />
    </div>
  );
};
