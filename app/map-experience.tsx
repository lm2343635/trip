"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoCentroid, geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import geoData from "./tohoku-geojson.json";

type Stop = {
  id: string;
  name: string;
  shortName: string;
  day: string;
  date: string;
  kind: "start" | "sight" | "shower" | "hotel" | "coast" | "city" | "optional";
  coords: [number, number];
  note: string;
  order?: number;
};

type ViewState = { scale: number; x: number; y: number };

const WIDTH = 660;
const HEIGHT = 920;
const MIN_SCALE = 1;
const MAX_SCALE = 4.5;

const stops: Stop[] = [
  { id: "tokyo", name: "东京", shortName: "东京", day: "8/23", date: "8月23日 · 周日夜", kind: "start", coords: [139.6917, 35.6895], note: "洗澡后出发，沿东北道北上；夜间在高速 SA / PA 休息。" },
  { id: "goshikinuma", name: "五色沼", shortName: "五色沼", day: "8/24", date: "8月24日 · 周一", kind: "sight", coords: [140.057, 37.655], note: "当天主景点。傍晚前往鸣子方向，夜宿鸣子周边。", order: 1 },
  { id: "naruko", name: "鸣子峡", shortName: "鸣子峡", day: "8/25", date: "8月25日 · 周二", kind: "sight", coords: [140.71, 38.74], note: "上午游览后继续北上盛冈。", order: 2 },
  { id: "kaikatsu", name: "快活CLUB 盛岡上堂店", shortName: "快活CLUB", day: "8/25", date: "8月25日 · 周二", kind: "shower", coords: [141.145, 39.735], note: "固定淋浴点：确保在青森屋入住前至少安排一次快活CLUB。" },
  { id: "hachimantai", name: "八幡平", shortName: "八幡平", day: "8/25", date: "8月25日 · 周二", kind: "sight", coords: [140.85, 39.96], note: "下午由盛冈前往八幡平，之后向鹿角 / 十和田方向推进。", order: 3 },
  { id: "towada", name: "十和田湖", shortName: "十和田湖", day: "8/26", date: "8月26日 · 周三", kind: "sight", coords: [140.88, 40.46], note: "与奥入濑溪流组成当天的深度游路线。", order: 4 },
  { id: "oirase", name: "奥入濑溪流", shortName: "奥入濑", day: "8/26", date: "8月26日 · 周三", kind: "sight", coords: [140.99, 40.53], note: "当天重点景点；晚间在十和田 / 七户 / 八甲田周边休息。", order: 5 },
  { id: "hakkoda", name: "八甲田", shortName: "八甲田（候选）", day: "8/27", date: "8月27日 · 周四", kind: "optional", coords: [140.86, 40.65], note: "仅作为天气良好时的上午候选，不是硬性主线。" },
  { id: "aomoriya", name: "星野リゾート 青森屋", shortName: "青森屋", day: "8/27", date: "8月27日 · 周四", kind: "hotel", coords: [141.37, 40.68], note: "14:00–14:30 抵达停车场；15:00 入住。8/28 中午 12:00 退房。" },
  { id: "hachinohe", name: "八户", shortName: "八户", day: "8/28", date: "8月28日 · 周五", kind: "city", coords: [141.49, 40.51], note: "青森屋退房后由此进入三陆沿岸道路 E45。" },
  { id: "kitayamazaki", name: "北山崎", shortName: "北山崎", day: "8/28", date: "8月28日 · 周五", kind: "coast", coords: [141.97, 39.96], note: "三陆返程景点 A；视当天时间安排停留。" },
  { id: "jodogahama", name: "净土之滨", shortName: "净土之滨", day: "8/28", date: "8月28日 · 周五", kind: "coast", coords: [141.98, 39.65], note: "三陆返程景点 B；沿 E45 南下。" },
  { id: "goishi", name: "碁石海岸", shortName: "碁石海岸", day: "8/28", date: "8月28日 · 周五", kind: "coast", coords: [141.73, 39.0], note: "三陆返程景点 C；之后继续向气仙沼 / 仙台推进。" },
  { id: "sendai", name: "仙台", shortName: "仙台", day: "8/29", date: "8月29日 · 周六", kind: "city", coords: [140.87, 38.27], note: "完成三陆沿岸段后回到主线，白天返回东京。" },
];

const outbound = [
  [139.6917, 35.6895], [139.88, 36.56], [140.16, 37.15], [140.057, 37.655],
  [140.42, 38.0], [140.71, 38.74], [141.145, 39.735], [140.85, 39.96],
  [140.88, 40.46], [140.99, 40.53], [141.37, 40.68],
] as [number, number][];

const returnRoute = [
  [141.37, 40.68], [141.49, 40.51], [141.78, 40.2], [141.97, 39.96],
  [141.98, 39.65], [141.82, 39.3], [141.73, 39.0], [141.45, 38.66],
  [141.17, 38.43], [140.87, 38.27], [140.91, 37.2], [140.45, 36.1], [139.6917, 35.6895],
] as [number, number][];

const optionalRoute = [[140.99, 40.53], [140.86, 40.65], [141.37, 40.68]] as [number, number][];
const days = ["全部", "8/23", "8/24", "8/25", "8/26", "8/27", "8/28", "8/29"];
const prefectureNames: Record<string, string> = { 青森県: "青森", 岩手県: "岩手", 宮城県: "宫城", 秋田県: "秋田", 山形県: "山形", 福島県: "福岛", 新潟県: "新潟", 群馬県: "群马", 栃木県: "栃木", 茨城県: "茨城", 埼玉県: "埼玉", 東京都: "东京", 千葉県: "千叶" };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function kindLabel(kind: Stop["kind"]) {
  return { start: "起点", sight: "景点", shower: "淋浴", hotel: "住宿", coast: "三陆景点", city: "途经", optional: "候选" }[kind];
}

export function MapExperience() {
  const [selectedDay, setSelectedDay] = useState("全部");
  const [selectedId, setSelectedId] = useState("aomoriya");
  const [view, setView] = useState<ViewState>({ scale: 1, x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gestureStart = useRef<{ view: ViewState; distance?: number; midpoint?: { x: number; y: number } }>();

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  const geography = useMemo(() => {
    const collection = geoData as unknown as GeoPermissibleObjects;
    const projection = geoMercator().fitExtent([[42, 28], [618, 892]], collection);
    const path = geoPath(projection);
    return { projection, path };
  }, []);

  const selectedStop = stops.find((stop) => stop.id === selectedId) ?? stops[0];
  const visibleStops = selectedDay === "全部" ? stops : stops.filter((stop) => stop.day === selectedDay);

  function clientToMap(clientX: number, clientY: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: ((clientX - rect.left) / rect.width) * WIDTH, y: ((clientY - rect.top) / rect.height) * HEIGHT };
  }

  function zoomAt(nextScale: number, point = { x: WIDTH / 2, y: HEIGHT / 2 }) {
    setView((current) => {
      const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      const x = point.x - ((point.x - current.x) / current.scale) * scale;
      const y = point.y - ((point.y - current.y) / current.scale) * scale;
      return scale === 1 ? { scale: 1, x: 0, y: 0 } : { scale, x, y };
    });
  }

  function focusStop(stop: Stop) {
    const point = geography.projection(stop.coords);
    if (!point) return;
    const scale = 2.15;
    setSelectedId(stop.id);
    setView({ scale, x: WIDTH / 2 - point[0] * scale, y: HEIGHT / 2 - point[1] * scale });
  }

  function handlePointerDown(event: React.PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, clientToMap(event.clientX, event.clientY));
    const points = [...pointers.current.values()];
    gestureStart.current = points.length === 2
      ? { view, ...pinchData(points) }
      : { view, midpoint: points[0] };
  }

  function pinchData(points: { x: number; y: number }[]) {
    const [a, b] = points;
    return { distance: Math.hypot(b.x - a.x, b.y - a.y), midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
  }

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!pointers.current.has(event.pointerId) || !gestureStart.current) return;
    pointers.current.set(event.pointerId, clientToMap(event.clientX, event.clientY));
    const points = [...pointers.current.values()];
    const start = gestureStart.current;
    if (points.length === 1) {
      const original = start.midpoint ?? points[0];
      setView({ ...start.view, x: start.view.x + points[0].x - original.x, y: start.view.y + points[0].y - original.y });
      return;
    }
    if (points.length === 2 && start.distance && start.midpoint) {
      const current = pinchData(points);
      const scale = clamp(start.view.scale * (current.distance / start.distance), MIN_SCALE, MAX_SCALE);
      setView({
        scale,
        x: current.midpoint.x - ((start.midpoint.x - start.view.x) / start.view.scale) * scale,
        y: current.midpoint.y - ((start.midpoint.y - start.view.y) / start.view.scale) * scale,
      });
    }
  }

  function handlePointerUp(event: React.PointerEvent<SVGSVGElement>) {
    pointers.current.delete(event.pointerId);
    const points = [...pointers.current.values()];
    gestureStart.current = points.length ? { view, midpoint: points[0] } : undefined;
  }

  return (
    <main className="trip-shell">
      <header className="trip-header">
        <div>
          <p className="eyebrow">8/23 — 8/29 · DRIVE NORTH</p>
          <h1>东北自驾路线图</h1>
          <p className="subtitle">东京出发，穿过山湖与溪流，再沿三陆海岸回家。</p>
        </div>
        <div className="header-facts" aria-label="行程摘要">
          <span><strong>7</strong> 天</span>
          <span><strong>14</strong> 个标注</span>
          <span className="offline-mark"><i /> 可离线</span>
        </div>
      </header>

      <nav className="day-filter" aria-label="按日期查看">
        {days.map((day) => (
          <button key={day} type="button" aria-pressed={selectedDay === day} onClick={() => setSelectedDay(day)}>{day}</button>
        ))}
      </nav>

      <section className="workspace">
        <aside className="itinerary-panel" aria-label="行程标注">
          <div className="panel-heading">
            <p>路线标注</p>
            <span>{selectedDay === "全部" ? "全程" : selectedDay}</span>
          </div>
          <div className="stop-list">
            {visibleStops.map((stop) => (
              <button key={stop.id} type="button" className={`stop-row ${selectedId === stop.id ? "is-active" : ""}`} onClick={() => focusStop(stop)}>
                <span className={`stop-symbol kind-${stop.kind}`}>{stop.order ?? (stop.kind === "hotel" ? "宿" : "•")}</span>
                <span>
                  <strong>{stop.name}</strong>
                  <small>{stop.day} · {kindLabel(stop.kind)}</small>
                </span>
                <span className="row-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <article className="stop-detail" aria-live="polite">
            <p className="detail-date">{selectedStop.date}</p>
            <h2>{selectedStop.name}</h2>
            <p>{selectedStop.note}</p>
          </article>
        </aside>

        <div className="map-stage">
          <div className="map-toolbar" aria-label="地图控制">
            <button type="button" aria-label="放大地图" onClick={() => zoomAt(view.scale * 1.35)}>＋</button>
            <button type="button" aria-label="缩小地图" onClick={() => zoomAt(view.scale / 1.35)}>−</button>
            <button type="button" className="reset-button" onClick={() => setView({ scale: 1, x: 0, y: 0 })}>全程</button>
          </div>
          <svg
            ref={svgRef}
            className="route-map"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-labelledby="map-title map-desc"
            onWheel={(event) => { event.preventDefault(); zoomAt(view.scale * (event.deltaY < 0 ? 1.18 : 0.84), clientToMap(event.clientX, event.clientY)); }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <title id="map-title">8月23日至29日日本东北自驾路线图</title>
            <desc id="map-desc">蓝线为东京至青森屋的去程，紫线为三陆沿岸道路返程，虚线为八甲田候选路线。</desc>
            <rect width={WIDTH} height={HEIGHT} className="ocean" />
            <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
              {(geoData.features as typeof geoData.features).map((feature) => (
                <path key={feature.properties.name} d={geography.path(feature as unknown as GeoPermissibleObjects) ?? ""} className="prefecture" vectorEffect="non-scaling-stroke" />
              ))}
              {(geoData.features as typeof geoData.features).map((feature) => {
                const center = geography.projection(geoCentroid(feature as unknown as GeoPermissibleObjects));
                if (!center) return null;
                return <text key={`${feature.properties.name}-label`} x={center[0]} y={center[1]} className="prefecture-label">{prefectureNames[feature.properties.name]}</text>;
              })}

              <path d={geography.path({ type: "LineString", coordinates: outbound } as GeoPermissibleObjects) ?? ""} className={`route route-outbound ${selectedDay === "8/28" || selectedDay === "8/29" ? "is-muted" : ""}`} vectorEffect="non-scaling-stroke" />
              <path d={geography.path({ type: "LineString", coordinates: returnRoute } as GeoPermissibleObjects) ?? ""} className={`route route-return ${["8/23", "8/24", "8/25", "8/26", "8/27"].includes(selectedDay) ? "is-muted" : ""}`} vectorEffect="non-scaling-stroke" />
              <path d={geography.path({ type: "LineString", coordinates: optionalRoute } as GeoPermissibleObjects) ?? ""} className="route route-optional" vectorEffect="non-scaling-stroke" />

              {stops.map((stop) => {
                const point = geography.projection(stop.coords);
                if (!point) return null;
                const isVisible = selectedDay === "全部" || stop.day === selectedDay;
                const isSelected = stop.id === selectedId;
                return (
                  <g key={stop.id} className={`map-stop kind-${stop.kind} ${isVisible ? "" : "is-dim"} ${isSelected ? "is-selected" : ""}`} transform={`translate(${point[0]} ${point[1]})`} onClick={(event) => { event.stopPropagation(); setSelectedId(stop.id); }} role="button" aria-label={`${stop.name}，${stop.day}`}>
                    <circle r={isSelected ? 10 : 7} className="marker-halo" vectorEffect="non-scaling-stroke" />
                    <circle r={isSelected ? 6 : 4.5} className="marker-core" vectorEffect="non-scaling-stroke" />
                    <text x={stop.coords[0] > 141.2 ? -12 : 12} y={4} textAnchor={stop.coords[0] > 141.2 ? "end" : "start"} className="stop-label">{stop.shortName}</text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="legend" aria-label="地图图例">
            <span><i className="line outbound" /> 去程</span>
            <span><i className="line returning" /> 三陆返程 E45</span>
            <span><i className="line optional" /> 候选</span>
          </div>
          <p className="map-hint">滚轮或双指缩放 · 拖动平移 · 点击标注查看详情</p>
        </div>
      </section>

      <footer>
        <span>路线用于行程概览，不替代实时导航。</span>
        <span>地图边界：国土数值信息，经简化并内置</span>
      </footer>
    </main>
  );
}
