import React, { useEffect, useRef } from 'react';
import { createAstronautScene, AstronautSceneInstance } from './AstronautScene';
import { VitalStatus } from '../../types/vitals';
import { CameraViewPreset } from '../../state/useVitalStore';

interface SceneContainerProps {
  status: VitalStatus;
  heartRate: number;
  cameraView: CameraViewPreset;
  customModelUrl: string;
  onModelLoaded?: (success: boolean) => void;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  status,
  heartRate,
  cameraView,
  customModelUrl,
  onModelLoaded,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneInstanceRef = useRef<AstronautSceneInstance | null>(null);

  // Initialize WebGL Scene once on mount
  useEffect(() => {
    if (!mountRef.current) return;

    const instance = createAstronautScene(mountRef.current, status);
    sceneInstanceRef.current = instance;

    return () => {
      instance.dispose();
      sceneInstanceRef.current = null;
    };
  }, []); // Run once

  // React to status / vital changes smoothly
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.updateStatus(status, heartRate);
    }
  }, [status, heartRate]);

  // React to camera preset changes
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setCameraTarget(cameraView);
    }
  }, [cameraView]);

  // React to custom model URL changes
  useEffect(() => {
    if (!sceneInstanceRef.current) return;
    if (customModelUrl && customModelUrl.trim() !== '') {
      sceneInstanceRef.current.loadCustomModel(customModelUrl).then((success) => {
        if (onModelLoaded) onModelLoaded(success);
      });
    } else {
      sceneInstanceRef.current.resetToProcedural();
    }
  }, [customModelUrl, onModelLoaded]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto touch-none"
      style={{ zIndex: 0 }}
    />
  );
};
