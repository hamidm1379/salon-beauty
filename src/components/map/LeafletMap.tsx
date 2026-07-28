"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMapType } from "leaflet";

interface LeafletMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  className?: string;
}

export function LeafletMap({
  lat,
  lng,
  zoom = 16,
  title,
  className,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMapType | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;

    async function init() {
      const L = await import("leaflet");

      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 32px;
          height: 32px;
          background: var(--color-primary, #7c3aed);
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(124,58,237,0.4);
        "><div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      if (title) marker.bindPopup(title).openPopup();

      mapInstance.current = map;
    }

    init();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [lat, lng, zoom, title]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: "300px" }}
    />
  );
}
