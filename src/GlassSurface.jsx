import React, { useEffect, useRef, useId, useState } from 'react';
import './GlassSurface.css';

// Adapted from the GlassSurface component supplied by the user (React Bits).
export default function GlassSurface({
  children, width = 200, height = 80, borderRadius = 20, borderWidth = 0.07,
  brightness = 50, opacity = 0.93, blur = 11, displace = 0,
  backgroundOpacity = 0, saturation = 1, distortionScale = -180,
  redOffset = 0, greenOffset = 10, blueOffset = 20,
  xChannel = 'R', yChannel = 'G', mixBlendMode = 'difference',
  className = '', style = {}
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const filterId = 'glass-filter-' + id;
  const container = useRef(null);
  const map = useRef(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const webkit = /Safari/.test(ua) && !/Chrome|Chromium/.test(ua);
    setSupported(!webkit && !/Firefox/.test(ua) && CSS.supports('backdrop-filter', 'url(#' + filterId + ')'));
  }, [filterId]);

  useEffect(() => {
    let frame;
    const update = () => {
      const rect = container.current?.getBoundingClientRect();
      if (!rect || !map.current) return;
      const w = rect.width || 400, h = rect.height || 200;
      const edge = Math.min(w, h) * borderWidth * 0.5;
      const svg = '<svg viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect width="'+w+'" height="'+h+'" fill="black"/><rect width="'+w+'" height="'+h+'" rx="'+borderRadius+'" fill="url(#r)"/><rect width="'+w+'" height="'+h+'" rx="'+borderRadius+'" fill="url(#b)" style="mix-blend-mode:'+mixBlendMode+'"/><rect x="'+edge+'" y="'+edge+'" width="'+Math.max(0,w-edge*2)+'" height="'+Math.max(0,h-edge*2)+'" rx="'+borderRadius+'" fill="hsl(0 0% '+brightness+'% / '+opacity+')" style="filter:blur('+blur+'px)"/></svg>';
      map.current.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(svg));
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (container.current) observer?.observe(container.current);
    window.addEventListener('resize', schedule);
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); };
  }, [width, height, borderRadius, borderWidth, brightness, opacity, blur, mixBlendMode]);

  return <div ref={container} className={'glass-surface ' + (supported ? 'glass-surface--svg ' : 'glass-surface--fallback ') + className}
    style={{ ...style, width, height, borderRadius, '--glass-frost': backgroundOpacity, '--glass-saturation': saturation, '--filter-id': 'url(#'+filterId+')' }}>
    <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs><filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
        <feImage ref={map} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale={distortionScale+redOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispRed"/>
        <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale={distortionScale+greenOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispGreen"/>
        <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale={distortionScale+blueOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispBlue"/>
        <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
        <feBlend in="red" in2="green" mode="screen" result="rg"/>
        <feBlend in="rg" in2="blue" mode="screen" result="output"/>
        <feGaussianBlur in="output" stdDeviation={displace}/>
      </filter></defs>
    </svg>
    <div className="glass-surface__content">{children}</div>
  </div>;
}
