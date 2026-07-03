"use client";

import React, { useEffect } from 'react';
import './video-modal.css';

// Minimal YouTube modal replacing react-modal-video (unmaintained; broken on
// React 19). Overlay click or Escape closes; the iframe autoplays like the
// old widget did.
const VideoModal = ({ videoId, onClose }) => {
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    return (
        <div className="video-modal-overlay" onClick={onClose} role="dialog" aria-label="Video player">
            <div className="video-modal" onClick={(event) => event.stopPropagation()}>
                <button className="video-modal-close" onClick={onClose} aria-label="Close video">×</button>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default VideoModal;
