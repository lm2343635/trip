"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { withBasePath } from "./base-path";
import { placeDetails } from "./place-details";

type StopKind = "start" | "sight" | "shower" | "hotel" | "coast" | "city" | "optional" | "sleep";

type Stop = {
  id: string;
  number: string;
  name: string;
  day: string;
  kind: StopKind;
  coords: [number, number];
  note: string;
};

type DayPlan = {
  day: string;
  weekday: string;
  kicker: string;
  theme: string;
  route: string;
  details: { label: string; text: string }[];
  stopIds: string[];
};

const stops: Stop[] = [
  { id: "tokyo", number: "起", name: "东京", day: "8/23", kind: "start", coords: [35.6895, 139.6917], note: "晚上出发。出发前已洗澡，当晚不再安排洗澡；沿东北道向福岛方向推进。" },
  { id: "goshikinuma", number: "01", name: "五色沼", day: "8/24", kind: "sight", coords: [37.655, 140.057], note: "去程必须保留的景点。游览后继续向鸣子温泉方向移动。" },
  { id: "naruko", number: "02", name: "鸣子峡", day: "8/25", kind: "sight", coords: [38.740, 140.710], note: "上午重点景点。之后经盛冈继续前往八幡平。" },
  { id: "kaikatsu", number: "浴", name: "快活CLUB 盛岡上堂店", day: "8/25", kind: "shower", coords: [39.735, 141.145], note: "固定淋浴点：8/25 使用，满足青森屋入住前至少一次快活CLUB的要求。" },
  { id: "hachimantai", number: "03", name: "八幡平", day: "8/25", kind: "sight", coords: [39.960, 140.850], note: "下午游览；晚间向鹿角、八幡平西侧或十和田方向推进并车中过夜。" },
  { id: "towada", number: "04", name: "十和田湖", day: "8/26", kind: "sight", coords: [40.460, 140.880], note: "与奥入濑溪流组成当天的深度游路线。" },
  { id: "oirase", number: "05", name: "奥入濑溪流", day: "8/26", kind: "sight", coords: [40.530, 140.990], note: "当天重点景点；洗澡安排十和田市周边日归温泉。" },
  { id: "hakkoda", number: "候", name: "八甲田（候选）", day: "8/27", kind: "optional", coords: [40.650, 140.860], note: "仅在天气和时间合适时安排，不是硬性主线。" },
  { id: "aomoriya", number: "宿", name: "星野リゾート 青森屋", day: "8/27", kind: "hotel", coords: [40.680, 141.370], note: "8/27 14:00–14:30抵达停车场，15:00办理入住；8/28中午12:00退房。" },
  { id: "hachinohe", number: "转", name: "八户", day: "8/28", kind: "city", coords: [40.510, 141.490], note: "青森屋退房后经八户进入三陆沿岸道路 E45。" },
  { id: "kitayamazaki", number: "A", name: "北山崎", day: "8/28", kind: "coast", coords: [39.960, 141.970], note: "三陆返程景点 A。按顺路性和当天时间安排停留。" },
  { id: "jodogahama", number: "B", name: "净土之滨", day: "8/28", kind: "coast", coords: [39.650, 141.980], note: "三陆返程景点 B。继续沿 E45 向宫古以南推进。" },
  { id: "goishi", number: "C", name: "碁石海岸", day: "8/28", kind: "coast", coords: [39.000, 141.730], note: "三陆返程景点 C。之后向大船渡、气仙沼或仙台北推进。" },
  { id: "sendai", number: "转", name: "仙台", day: "8/29", kind: "city", coords: [38.268, 140.869], note: "若8/28未完成三陆景点，可在早上顺延；之后以白天返回东京为目标。" },
];

const dayPlans: DayPlan[] = [
  {
    day: "8/23", weekday: "周日夜", kicker: "DAY 01", theme: "东京出发 · 夜间北上",
    route: "东京 → 东北道 → 福岛方向",
    stopIds: ["tokyo"],
    details: [
      { label: "出发", text: "晚上从东京出发，沿东北道北上，往福岛方向推进。" },
      { label: "洗澡", text: "出发前已经洗好澡，当晚不再安排洗澡。" },
      { label: "过夜", text: "车中过夜，优先选择高速 SA / PA 或其他合适休息点。" },
    ],
  },
  {
    day: "8/24", weekday: "周一", kicker: "DAY 02", theme: "五色沼 + 鸣子温泉方向",
    route: "东京北上 → 五色沼 → 鸣子方向",
    stopIds: ["goshikinuma"],
    details: [
      { label: "重点", text: "五色沼是确定保留的去程景点。" },
      { label: "晚上", text: "在鸣子周边活动，可逛温泉街。" },
      { label: "洗澡", text: "优先安排当地日归温泉。" },
      { label: "过夜", text: "鸣子周边车中过夜。" },
    ],
  },
  {
    day: "8/25", weekday: "周二", kicker: "DAY 03", theme: "鸣子峡 + 盛冈淋浴 + 八幡平",
    route: "鸣子峡 → 盛冈 → 快活CLUB盛岡上堂店 → 八幡平 → 鹿角方向",
    stopIds: ["naruko", "kaikatsu", "hachimantai"],
    details: [
      { label: "景点", text: "鸣子峡和八幡平都是当天必须保留的重点。" },
      { label: "洗澡", text: "固定在快活CLUB 盛岡上堂店淋浴，日期为8/25。" },
      { label: "约束", text: "这一站用于确保入住青森屋之前至少安排一次快活CLUB。" },
      { label: "过夜", text: "鹿角、八幡平西侧或十和田方向车中过夜。" },
    ],
  },
  {
    day: "8/26", weekday: "周三", kicker: "DAY 04", theme: "十和田湖 + 奥入濑溪流深度游",
    route: "鹿角方向 → 十和田湖 → 奥入濑溪流",
    stopIds: ["towada", "oirase"],
    details: [
      { label: "重点", text: "十和田湖与奥入濑溪流组成全天核心行程。" },
      { label: "洗澡", text: "安排十和田市周边日归温泉。" },
      { label: "过夜", text: "十和田、七户或八甲田周边车中过夜。" },
    ],
  },
  {
    day: "8/27", weekday: "周四", kicker: "DAY 05", theme: "轻松活动 → 青森屋",
    route: "八甲田候选 / 轻量活动 → 三泽 → 青森屋",
    stopIds: ["hakkoda", "aomoriya"],
    details: [
      { label: "上午", text: "视天气选择八甲田或其他轻量活动；八甲田只作为候选。" },
      { label: "硬约束", text: "14:00–14:30抵达青森屋停车场，15:00办理入住。" },
      { label: "住宿", text: "当晚入住星野リゾート 青森屋，洗澡也在青森屋完成。" },
    ],
  },
  {
    day: "8/28", weekday: "周五", kicker: "DAY 06", theme: "退房 → 三陆道返程",
    route: "青森屋 → 八户 → 北山崎 → 净土之滨 → 碁石海岸 → 继续南下",
    stopIds: ["aomoriya", "hachinohe", "kitayamazaki", "jodogahama", "goishi"],
    details: [
      { label: "硬约束", text: "中午12:00从青森屋退房。" },
      { label: "道路", text: "返程必须走三陆沿岸道路 E45 / 三陆道。" },
      { label: "景点", text: "按顺路性保留北山崎、净土之滨和碁石海岸。" },
      { label: "晚间目标", text: "推进到宫古以南、大船渡、气仙沼或仙台北，按当天强度决定。" },
      { label: "过夜", text: "在三陆道沿线选择合适休息点车中过夜。" },
    ],
  },
  {
    day: "8/29", weekday: "周六", kicker: "DAY 07", theme: "三陆道 / 仙台 → 东京",
    route: "继续南下 → 仙台 → 东京",
    stopIds: ["sendai", "tokyo"],
    details: [
      { label: "补充", text: "如果8/28来不及，可把部分三陆景点顺延到8/29早上。" },
      { label: "目标", text: "总体仍以8/29白天返回东京为目标。" },
    ],
  },
];

const outbound: [number, number][] = [
  [35.6895, 139.6917], [36.15, 139.75], [36.56, 139.88], [37.05, 140.05], [37.50, 140.32],
  [37.655, 140.057], [37.82, 140.35], [38.10, 140.63], [38.35, 140.72], [38.740, 140.710],
  [38.98, 140.94], [39.28, 141.12], [39.735, 141.145], [39.82, 141.03], [39.960, 140.850],
  [40.17, 140.78], [40.46, 140.88], [40.530, 140.990], [40.61, 141.12], [40.680, 141.370],
];

const returnRoute: [number, number][] = [
  [40.680, 141.370], [40.510, 141.490], [40.32, 141.73], [40.10, 141.82], [39.960, 141.970],
  [39.82, 141.96], [39.650, 141.980], [39.43, 141.94], [39.22, 141.86], [39.000, 141.730],
  [38.82, 141.60], [38.60, 141.50], [38.39, 141.30], [38.268, 140.869], [37.85, 140.91],
  [37.40, 140.96], [36.92, 140.88], [36.45, 140.30], [36.05, 139.92], [35.6895, 139.6917],
];

const optionalRoute: [number, number][] = [[40.530, 140.990], [40.650, 140.860], [40.68, 141.10], [40.680, 141.370]];
const stopById = new Map(stops.map((stop) => [stop.id, stop]));

function kindLabel(kind: StopKind) {
  return { start: "起点", sight: "景点", shower: "淋浴", hotel: "酒店", coast: "三陆景点", city: "途经", optional: "候选", sleep: "过夜" }[kind];
}

export function MapExperience() {
  const [activeDay, setActiveDay] = useState("8/27");
  const [selectedId, setSelectedId] = useState("aomoriya");
  const [mapReady, setMapReady] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const overlayRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  const activePlan = dayPlans.find((plan) => plan.day === activeDay) ?? dayPlans[0];
  const selectedStop = stopById.get(selectedId) ?? stops[0];
  const selectedDetail = placeDetails[selectedStop.id];

  useEffect(() => {
    if (!detailOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [detailOpen]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register(withBasePath("/sw.js")).catch(() => undefined);
      return;
    }
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
    if ("caches" in window) {
      caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("tohoku-trip-")).map((key) => caches.delete(key))));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function setupMap() {
      if (!mapElementRef.current || mapRef.current) return;
      const L = await import("leaflet");
      if (cancelled || !mapElementRef.current) return;
      leafletRef.current = L;
      const map = L.map(mapElementRef.current, {
        zoomControl: false,
        minZoom: 5,
        maxZoom: 9,
        maxBounds: [[34.9, 137.7], [41.7, 143.0]],
        maxBoundsViscosity: 0.7,
        preferCanvas: true,
      });
      L.tileLayer(withBasePath("/tiles/std/{z}/{x}/{y}.png"), {
        minZoom: 5,
        maxZoom: 9,
        noWrap: true,
        keepBuffer: 5,
        bounds: [[35.25, 138.2], [41.35, 142.55]],
        attribution: "地理院タイル",
      }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);
      map.fitBounds([[35.45, 139.25], [41.00, 142.15]], { padding: [28, 28] });
      mapRef.current = map;
      overlayRef.current = L.layerGroup().addTo(map);
      setMapReady(true);
    }
    setupMap();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const overlay = overlayRef.current;
    if (!L || !map || !overlay || !mapReady) return;
    overlay.clearLayers();

    const outboundMuted = activeDay === "8/28" || activeDay === "8/29";
    const returnMuted = ["8/23", "8/24", "8/25", "8/26", "8/27"].includes(activeDay);
    const addRoute = (points: [number, number][], color: string, options: { muted?: boolean; dash?: string } = {}) => {
      L.polyline(points, { color: "#fffdf7", weight: 9, opacity: options.muted ? 0.28 : 0.92, interactive: false }).addTo(overlay);
      L.polyline(points, { color, weight: 5, opacity: options.muted ? 0.22 : 0.95, dashArray: options.dash, lineCap: "round", lineJoin: "round", interactive: false }).addTo(overlay);
    };
    addRoute(outbound, "#1559c7", { muted: outboundMuted });
    addRoute(returnRoute, "#7b3fba", { muted: returnMuted });
    addRoute(optionalRoute, "#5b6d7b", { muted: activeDay !== "8/27", dash: "7 9" });

    stops.forEach((stop) => {
      const visible = stop.day === activeDay || (activeDay === "8/29" && stop.id === "tokyo") || (activeDay === "8/28" && stop.id === "aomoriya");
      const selected = stop.id === selectedId;
      const icon = L.divIcon({
        className: "trip-marker-shell",
        html: `<span class="trip-marker kind-${stop.kind}${selected ? " is-selected" : ""}${visible ? "" : " is-muted"}"><b>${stop.number}</b></span>`,
        iconSize: selected ? [42, 42] : [34, 34],
        iconAnchor: selected ? [21, 21] : [17, 17],
      });
      const marker = L.marker(stop.coords, { icon, riseOnHover: true, zIndexOffset: selected ? 1000 : visible ? 400 : 0 }).addTo(overlay);
      marker.bindTooltip(stop.name, {
        permanent: visible,
        direction: stop.coords[1] > 141.25 ? "left" : "right",
        offset: stop.coords[1] > 141.25 ? [-17, 0] : [17, 0],
        className: `place-label${visible ? "" : " is-muted"}`,
      });
      marker.on("click", () => {
        setSelectedId(stop.id);
        setActiveDay(stop.day);
        setDetailOpen(true);
        map.flyTo(stop.coords, Math.max(map.getZoom(), 8), { duration: 0.55 });
      });
    });
  }, [activeDay, selectedId, mapReady]);

  const activeStops = useMemo(() => activePlan.stopIds.map((id) => stopById.get(id)).filter((stop): stop is Stop => Boolean(stop)), [activePlan]);

  function chooseDay(day: string) {
    const plan = dayPlans.find((candidate) => candidate.day === day);
    if (!plan) return;
    setActiveDay(day);
    const planStops = plan.stopIds.map((id) => stopById.get(id)).filter((stop): stop is Stop => Boolean(stop));
    if (planStops[0]) setSelectedId(planStops[0].id);
    if (mapRef.current && planStops.length) {
      const bounds = planStops.map((stop) => stop.coords);
      mapRef.current.fitBounds(bounds, { padding: [90, 90], maxZoom: 8, animate: true });
    }
  }

  function chooseStop(stop: Stop) {
    setSelectedId(stop.id);
    if (!activePlan.stopIds.includes(stop.id)) setActiveDay(stop.day);
    setDetailOpen(true);
    mapRef.current?.flyTo(stop.coords, Math.max(mapRef.current.getZoom(), 8), { duration: 0.55 });
  }

  function returnToDayPlan() {
    setDetailOpen(false);
    setActiveDay(selectedStop.day);
    document.getElementById("day-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <main className="trip-shell">
      <header className="trip-header">
        <div>
          <p className="eyebrow">TOHOKU · 8/23—8/29 · 7 DAYS</p>
          <h1>东北自驾行程地图</h1>
          <p className="subtitle">东京北上，经五色沼、八幡平与奥入濑，沿三陆海岸 E45 返回。</p>
        </div>
        <div className="hard-deadlines" aria-label="关键时间">
          <span><b>8/27 · 15:00</b> 青森屋入住</span>
          <span><b>8/28 · 12:00</b> 青森屋退房</span>
        </div>
      </header>

      <section className="route-ribbon" aria-label="路线总览">
        <div><span>去程</span><p>东京 → 五色沼 → 鸣子峡 → 盛冈 → 八幡平 → 十和田 → 青森屋</p></div>
        <div><span>返程</span><p>青森屋 → 八户 → 北山崎 → 净土之滨 → 碁石海岸 → 仙台 → 东京</p></div>
        <div className="offline-status"><i /> 地图与行程已内置，可离线查看</div>
      </section>

      <section className="map-workspace">
        <nav className="day-rail" aria-label="选择日期">
          <div className="rail-heading"><span>行程</span><small>ITINERARY</small></div>
          {dayPlans.map((plan) => (
            <button key={plan.day} type="button" className={activeDay === plan.day ? "is-active" : ""} aria-pressed={activeDay === plan.day} onClick={() => chooseDay(plan.day)}>
              <span className="rail-day"><b>{plan.day}</b><small>{plan.weekday}</small></span>
              <span className="rail-theme">{plan.theme}</span>
              <span aria-hidden="true">›</span>
            </button>
          ))}
          <div className="rail-key">
            <span><i className="key-dot sight" />景点</span>
            <span><i className="key-dot shower" />淋浴</span>
            <span><i className="key-dot hotel" />酒店</span>
            <span><i className="key-dot coast" />三陆</span>
          </div>
        </nav>

        <div className="map-panel">
          <div ref={mapElementRef} className="leaflet-map" aria-label="可缩放的日本东北自驾地图" />
          {!mapReady && <div className="map-loading">正在加载离线地图…</div>}
          <div className="map-legend" aria-label="路线图例">
            <span><i className="route-swatch outbound" />去程</span>
            <span><i className="route-swatch returning" />三陆 E45 返程</span>
            <span><i className="route-swatch optional" />候选</span>
          </div>
          <article className="map-selection" aria-live="polite">
            <div className={`selection-code kind-${selectedStop.kind}`}>{selectedStop.number}</div>
            <div>
              <span>{selectedStop.day} · {kindLabel(selectedStop.kind)}</span>
              <h2>{selectedStop.name}</h2>
              <p>{selectedStop.note}</p>
            </div>
            <button type="button" onClick={() => setDetailOpen(true)} aria-label={`查看${selectedStop.name}图文攻略`}>查看图文攻略</button>
          </article>
          <a className="map-attribution" href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noreferrer">地图：国土地理院</a>
        </div>

        <aside className="day-detail" id="day-detail" aria-live="polite">
          <div className="detail-heading">
            <span>{activePlan.kicker}</span>
            <div><b>{activePlan.day}</b><small>{activePlan.weekday}</small></div>
          </div>
          <h2>{activePlan.theme}</h2>
          <div className="route-copy"><span>ROUTE</span><p>{activePlan.route}</p></div>

          <div className="day-stop-list">
            {activeStops.map((stop) => (
              <button key={stop.id} type="button" className={selectedId === stop.id ? "is-active" : ""} onClick={() => chooseStop(stop)} aria-label={`查看${stop.name}详细介绍`}>
                <span className={`mini-pin kind-${stop.kind}`}>{stop.number}</span>
                <span><b>{stop.name}</b><small>{kindLabel(stop.kind)} · 点击查看攻略</small></span>
              </button>
            ))}
          </div>

          <div className="plan-details">
            {activePlan.details.map((detail) => (
              <div key={detail.label}>
                <span>{detail.label}</span>
                <p>{detail.text}</p>
              </div>
            ))}
          </div>

          <div className="fixed-rules">
            <h3>全程固定条件</h3>
            <ul>
              <li>除8/27青森屋外，其余夜晚默认车中休息。</li>
              <li>PHEV本次不考虑充电，仅按加油安排。</li>
              <li>删除下北半岛整段，不绘制为路线。</li>
              <li>五色沼、鸣子峡与三陆三景必须保留。</li>
              <li>返程固定使用三陆沿岸道路 E45。</li>
            </ul>
          </div>
        </aside>
      </section>

      {detailOpen && selectedDetail && (
        <div
          className="place-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetailOpen(false);
          }}
        >
          <article className="place-modal" role="dialog" aria-modal="true" aria-labelledby="place-detail-title">
            <button ref={closeButtonRef} className="place-modal-close" type="button" onClick={() => setDetailOpen(false)} aria-label="关闭景点详情">×</button>

            <div className={selectedDetail.image ? "place-hero" : "place-hero place-no-photo"}>
              {selectedDetail.image ? (
                <>
                  {/* Local files are intentionally used so destination photography remains available offline. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={withBasePath(selectedDetail.image.src)} alt={selectedDetail.image.alt} />
                  <a className="photo-credit" href={selectedDetail.image.sourceUrl} target="_blank" rel="noreferrer">
                    摄影：{selectedDetail.image.credit} · {selectedDetail.image.license}
                  </a>
                </>
              ) : (
                <div className="place-no-photo-copy" aria-hidden="true">
                  <span>{selectedStop.day}</span>
                  <b>{selectedStop.number}</b>
                  <small>{kindLabel(selectedStop.kind)}</small>
                </div>
              )}
            </div>

            <div className="place-content">
              <header className="place-title-block">
                <p className="place-kicker">{selectedStop.day} · {kindLabel(selectedStop.kind)} · TOHOKU ROAD TRIP</p>
                <h2 id="place-detail-title">{selectedStop.name}</h2>
                <p className="place-tagline">{selectedDetail.tagline}</p>
                <p className="place-overview">{selectedDetail.overview}</p>
              </header>

              <dl className="place-facts">
                {selectedDetail.facts.map((fact) => (
                  <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
                ))}
              </dl>

              <section className="place-budget" aria-labelledby="budget-title">
                <span aria-hidden="true">¥</span>
                <div><h3 id="budget-title">2026-08 参考消费</h3><p>{selectedDetail.budget}</p></div>
              </section>

              <section className="place-section" aria-labelledby="food-title">
                <div className="place-section-heading"><span>LOCAL FOOD</span><h3 id="food-title">附近吃什么</h3></div>
                <div className="food-grid">
                  {selectedDetail.foods.map((food) => (
                    <article className="food-card" key={food.name}>
                      <div><h4>{food.name}</h4><b>{food.budget}</b></div>
                      <p>{food.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="place-section" aria-labelledby="tips-title">
                <div className="place-section-heading"><span>BEFORE YOU GO</span><h3 id="tips-title">到访提示</h3></div>
                <ul className="place-tips">
                  {selectedDetail.tips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </section>

              <section className="place-section" aria-labelledby="links-title">
                <div className="place-section-heading"><span>OFFICIAL & MAPS</span><h3 id="links-title">继续了解</h3></div>
                <div className="place-links">
                  {selectedDetail.links.map((link) => (
                    <a className="place-link" key={link.url} href={link.url} target="_blank" rel="noreferrer"><span>{link.label}</span><b aria-hidden="true">↗</b></a>
                  ))}
                </div>
              </section>

              <div className="place-modal-actions">
                <p>费用、营业时间与交通限制可能临时变化，出发前请以官方链接为准。</p>
                <button type="button" onClick={returnToDayPlan}>回到当天行程</button>
              </div>
            </div>
          </article>
        </div>
      )}

      <footer>
        <p>路线用于行程规划展示，不替代当天实时导航、道路管制及天气判断。</p>
        <p>离线包包含地图层、路线与完整行程文字。</p>
      </footer>
    </main>
  );
}
