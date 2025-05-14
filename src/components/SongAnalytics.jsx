import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import MessageModal from "./MessageModal";

function LineChart({ data, color, label }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  const width = 180, height = 40, pad = 4;
  const points = data.map((d, i) => [
    pad + i * ((width-2*pad)/(data.length-1)),
    height - pad - (d.count/max)*(height-2*pad)
  ]);
  const path = points.map((p,i) => (i===0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  return (
    <div className="flex flex-col items-start mb-2">
      <div className="text-xs mb-1">{label}</div>
      <svg width={width} height={height} className="bg-gray-50 rounded">
        <path d={path} fill="none" stroke={color} strokeWidth="2" />
        {points.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={2} fill={color} />)}
      </svg>
    </div>
  );
}

export default function SongAnalytics({ songId, days = 30 }) {
  const { user } = useAuth();
  const [showMsg, setShowMsg] = useState(false);
  const [msgUser, setMsgUser] = useState(null);
  const [sentMsg, setSentMsg] = useState(false);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState(null);
  const [series, setSeries] = useState({ play: [], like: [], share: [], comment: [] });
  useEffect(() => {
    fetch(`http://localhost:5000/api/analytics/song/${songId}`)
      .then(res => res.ok ? res.json() : null)
      .then(setStats);
    ['play','like','share','comment'].forEach(type => {
      fetch(`http://localhost:5000/api/analytics/timeseries/song/${songId}?type=${type}&days=${days}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setSeries(s => ({ ...s, [type]: data })));
    });
  }, [songId, days]);
  if (!stats) return null;
  const [geo, setGeo] = useState({ countries: [], cities: [] });
  const [deviceStats, setDeviceStats] = useState({ devices: [], browsers: [] });
  const [listeners, setListeners] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/api/analytics/geo/song/${songId}`)
      .then(res => res.ok ? res.json() : { countries: [], cities: [] })
      .then(setGeo);
    fetch(`http://localhost:5000/api/analytics/device/song/${songId}`)
      .then(res => res.ok ? res.json() : { devices: [], browsers: [] })
      .then(setDeviceStats);
    fetch(`http://localhost:5000/api/analytics/listeners/song/${songId}`)
      .then(res => res.ok ? res.json() : [])
      .then(setListeners);
  }, [songId]);

  function exportCSV() {
    const rows = [
      ['Date','Plays','Likes','Shares','Comments'],
    ];
    const dates = Array.from(new Set([
      ...series.play.map(d=>d.date),
      ...series.like.map(d=>d.date),
      ...series.share.map(d=>d.date),
      ...series.comment.map(d=>d.date)
    ])).sort();
    dates.forEach(date => {
      rows.push([
        date,
        series.play.find(d=>d.date===date)?.count||0,
        series.like.find(d=>d.date===date)?.count||0,
        series.share.find(d=>d.date===date)?.count||0,
        series.comment.find(d=>d.date===date)?.count||0
      ]);
    });
    const csv = rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `song-analytics-${songId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="mt-2">
      <div className="flex gap-4 text-sm text-gray-600 mb-2">
        <div title="Plays">▶️ {stats.plays || 0}</div>
        <div title="Likes">♥ {stats.likes || 0}</div>
        <div title="Shares">🔗 {stats.shares || 0}</div>
        <button className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition" onClick={exportCSV} title="Export CSV">Export CSV</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <LineChart data={series.play} color="#84cc16" label={`Plays (${days}d)`} />
        <LineChart data={series.like} color="#eab308" label={`Likes (${days}d)`} />
        <LineChart data={series.share} color="#2563eb" label={`Shares (${days}d)`} />
        <LineChart data={series.comment} color="#6366f1" label={`Comments (${days}d)`} />
      </div>
      <div className="flex flex-wrap gap-8 mt-4">
        <div>
          <div className="font-semibold mb-1">Top Countries</div>
          <ul className="text-xs bg-gray-50 rounded p-2">
            {geo.countries.length === 0 && <li className="text-gray-400">No data</li>}
            {geo.countries.map(c => <li key={c._id}>{c._id || 'Unknown'}: {c.count}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-1">Top Cities</div>
          <ul className="text-xs bg-gray-50 rounded p-2">
            {geo.cities.length === 0 && <li className="text-gray-400">No data</li>}
            {geo.cities.map(c => <li key={c._id}>{c._id || 'Unknown'}: {c.count}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-1">Top Devices</div>
          <ul className="text-xs bg-gray-50 rounded p-2">
            {deviceStats.devices.length === 0 && <li className="text-gray-400">No data</li>}
            {deviceStats.devices.map(d => <li key={d._id}>{d._id || 'Unknown'}: {d.count}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-1">Top Browsers</div>
          <ul className="text-xs bg-gray-50 rounded p-2">
            {deviceStats.browsers.length === 0 && <li className="text-gray-400">No data</li>}
            {deviceStats.browsers.map(b => <li key={b._id}>{b._id || 'Unknown'}: {b.count}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-1">Top Listeners</div>
          <ul className="text-xs bg-gray-50 rounded p-2">
            {listeners.length === 0 && <li className="text-gray-400">No data</li>}
            {listeners.map(l => (
              <li key={l._id} className="flex items-center gap-2 mb-1">
                {l.avatar && <img src={l.avatar} alt="avatar" className="w-6 h-6 rounded-full" />}
                <span className="font-semibold">{l.name || l.email || l._id || 'Unknown'}</span>
                <span className="text-gray-500">({l.email})</span>
                <span className="ml-auto text-blue-700 font-bold">{l.count} plays</span>
                <button className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition" onClick={() => { setMsgUser(l); setShowMsg(true); }}>Message</button>
              </li>
            ))}
          </ul>
          <MessageModal
            open={showMsg}
            onClose={() => setShowMsg(false)}
            recipient={msgUser || {}}
            onSend={async (message) => {
              setSending(true);
              // Generate threadId
              const emails = [user.email, msgUser.email].sort();
              const threadId = emails.join('-');
              // Save message to thread
              await fetch("http://localhost:5000/api/message/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ threadId, from: user.email, message })
              });
              setShowMsg(false);
              setSending(false);
              setSentMsg(true);
              setTimeout(() => setSentMsg(false), 2000);
            }}
          />
          {sentMsg && <div className="text-green-600 text-xs mt-2">Message sent!</div>}
        </div>
      </div>
    </div>
  );
}
