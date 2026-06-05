import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import type { UnidadeSaude } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix ícone padrão Leaflet + Vite
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Ícones customizados por tipo
function criarIcone(cor: string) {
  return L.divIcon({
    html: `<div style="
      width:12px; height:12px; border-radius:50%;
      background:${cor}; border:2px solid white;
      box-shadow:0 0 0 2px ${cor}40;
    "></div>`,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

const ICONES = {
  CAF:        criarIcone('#3b82f6'),
  Hospital:   criarIcone('#ef4444'),
  UBS:        criarIcone('#22c55e'),
  Policlínica:criarIcone('#f59e0b'),
  default:    criarIcone('#64748b'),
};

interface Props {
  unidades: UnidadeSaude[];
  height?: string;
  className?: string;
}

// Centro de Salvador, BA
const CENTRO_SALVADOR: [number, number] = [-12.9714, -38.5014];

export default function MapaSaude({ unidades, height = '400px', className = '' }: Props) {
  const unidadesComCoordenadas = unidades.filter(
    (u) => u.latitude && u.longitude,
  );

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-grafite-700 ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={CENTRO_SALVADOR}
        zoom={11}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {unidadesComCoordenadas.map((u) => {
          const pos: [number, number] = [u.latitude!, u.longitude!];
          const icone = ICONES[u.tipo as keyof typeof ICONES] ?? ICONES.default;

          return (
            <Marker key={u.id} position={pos} icon={icone}>
              <Popup className="farchain-popup">
                <div style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  minWidth: '200px',
                  padding: '4px',
                }}>
                  <p style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
                    {u.nome}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>{u.tipo}</p>
                  {u.bairro && (
                    <p style={{ color: '#64748b', fontSize: '11px' }}>{u.bairro}</p>
                  )}
                  {u.ehCAF && (
                    <span style={{
                      display: 'inline-block', marginTop: '6px',
                      background: '#1d4ed8', color: 'white',
                      padding: '1px 8px', borderRadius: '9999px',
                      fontSize: '10px', fontWeight: 600,
                    }}>
                      CAF Central
                    </span>
                  )}
                </div>
              </Popup>

              {/* Raio de cobertura para CAF */}
              {u.ehCAF && (
                <Circle
                  center={pos}
                  radius={5000}
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.05,
                    weight: 1,
                    dashArray: '4 4',
                  }}
                />
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
