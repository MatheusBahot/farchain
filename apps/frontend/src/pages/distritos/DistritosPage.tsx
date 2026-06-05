import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2, MapPin, Pill, ShieldCheck } from 'lucide-react';

const distritos = [
  { nome: 'Centro Histórico', tipo: 'Distrito', lat: -12.9714, lng: -38.5014, unidades: 18 },
  { nome: 'Itapuã', tipo: 'Distrito', lat: -12.9451, lng: -38.3637, unidades: 12 },
  { nome: 'São Marcos', tipo: 'Distrito', lat: -12.9328, lng: -38.4309, unidades: 9 },
  { nome: 'Brotas', tipo: 'Distrito', lat: -12.9833, lng: -38.4931, unidades: 15 },
  { nome: 'Cabula/Beiru', tipo: 'Distrito', lat: -12.9528, lng: -38.4594, unidades: 11 },
  { nome: 'Barra/Rio Vermelho', tipo: 'Distrito', lat: -13.0095, lng: -38.5320, unidades: 14 },
  { nome: 'Liberdade', tipo: 'Distrito', lat: -12.9448, lng: -38.4986, unidades: 10 },
  { nome: 'Pau da Lima', tipo: 'Distrito', lat: -12.9285, lng: -38.4694, unidades: 8 },
  { nome: 'Subúrbio Ferroviário', tipo: 'Distrito', lat: -12.8842, lng: -38.4801, unidades: 16 },
  { nome: 'Cajazeiras', tipo: 'Distrito', lat: -12.9083, lng: -38.4105, unidades: 13 },
  { nome: 'Boca do Rio', tipo: 'Distrito', lat: -12.9825, lng: -38.4282, unidades: 9 },
  { nome: 'Valéria', tipo: 'Distrito', lat: -12.8577, lng: -38.4303, unidades: 6 },
];

const caf = { nome: 'CAF Central Salvador', lat: -12.9704, lng: -38.5124 };

const blueIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function DistritosPage() {
  const [active, setActive] = useState(distritos[0]);

  return (
    <div className="space-y-5 text-slate-950">
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
          Território sanitário
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] md:text-5xl">
          12 Distritos Sanitários de Salvador.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Visualize cobertura territorial, unidades vinculadas e raio operacional
          da CAF Central no mapa geográfico.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
          <MapContainer center={[-12.96, -38.48]} zoom={11} scrollWheelZoom className="h-[620px] rounded-[24px]">
            <TileLayer
              attribution='&copy; OpenStreetMap &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <Circle
              center={[caf.lat, caf.lng]}
              radius={12000}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.12 }}
            />

            <Marker position={[caf.lat, caf.lng]} icon={blueIcon}>
              <Popup>
                <strong>{caf.nome}</strong><br />Raio de cobertura aproximado: 12 km
              </Popup>
            </Marker>

            {distritos.map((d) => (
              <Marker
                key={d.nome}
                position={[d.lat, d.lng]}
                icon={blueIcon}
                eventHandlers={{ click: () => setActive(d) }}
              >
                <Popup>
                  <strong>{d.nome}</strong><br />
                  {d.unidades} unidades vinculadas
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
          <div className="rounded-[24px] bg-blue-50 p-5">
            <MapPin className="text-blue-600" size={24} />
            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">
              {active.nome}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {active.unidades} unidades vinculadas
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {distritos.map((d) => (
              <button
                key={d.nome}
                onClick={() => setActive(d)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  active.nome === d.nome ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{d.nome}</span>
                <span className="text-xs opacity-75">{d.unidades}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Distritos', value: '12', icon: MapPin },
          { label: 'Unidades', value: '141', icon: Building2 },
          { label: 'CAF Central', value: '1', icon: Pill },
          { label: 'Cobertura', value: '100%', icon: ShieldCheck },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
              <Icon className="text-blue-600" size={22} />
              <p className="mt-4 text-xs text-slate-500">{s.label}</p>
              <p className="text-3xl font-black">{s.value}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
