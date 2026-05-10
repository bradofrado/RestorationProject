'use client';

import { XIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import Button from '../../base/buttons/button';
import bomData from './bom-names.json';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Category = 'prophet' | 'king' | 'villain' | 'minor';
type SortMode = 'total' | 'span' | 'name';
type ActiveCategory = Category | 'all';

interface Mention {
  book: string;
  chapter: number;
}

interface Person {
  name: string;
  category: Category;
  mentions: Mention[];
}

interface ProcessedPerson extends Person {
  bookCounts: Record<string, number>;
  total: number;
  span: number;
}

interface TooltipState {
  name: string;
  book: string;
  count: number;
  total: number;
  x: number;
  y: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const BOOKS: string[] = [
  '1 Nephi',
  '2 Nephi',
  'Jacob',
  'Enos',
  'Jarom',
  'Omni',
  'Words of Mormon',
  'Mosiah',
  'Alma',
  'Helaman',
  '3 Nephi',
  '4 Nephi',
  'Mormon',
  'Ether',
  'Moroni',
];

const BOOK_SHORT: Record<string, string> = {
  '1 Nephi': '1 Ne',
  '2 Nephi': '2 Ne',
  Jacob: 'Jacob',
  Enos: 'Enos',
  Jarom: 'Jarom',
  Omni: 'Omni',
  'Words of Mormon': 'W of M',
  Mosiah: 'Mosiah',
  Alma: 'Alma',
  Helaman: 'Hel',
  '3 Nephi': '3 Ne',
  '4 Nephi': '4 Ne',
  Mormon: 'Morm',
  Ether: 'Ether',
  Moroni: 'Moro',
};

const CATEGORIES: ActiveCategory[] = [
  'all',
  'prophet',
  'king',
  'villain',
  'minor',
];

// HSL values per category for programmatic cell coloring
const CAT_HSL: Record<Category, { h: number; s: number }> = {
  prophet: { h: 213, s: 72 },
  king: { h: 34, s: 82 },
  villain: { h: 10, s: 68 },
  minor: { h: 100, s: 63 },
};

// Tailwind-safe dot colors (must be full class strings, not constructed)
const CAT_DOT_CLASS: Record<Category, string> = {
  prophet: 'bg-blue-600',
  king: 'bg-amber-700',
  villain: 'bg-red-700',
  minor: 'bg-green-700',
};

const CAT_BUTTON_ACTIVE: Record<ActiveCategory, string> = {
  all: 'bg-stone-600 border-stone-600 text-white',
  prophet: 'bg-blue-600 border-blue-600 text-white',
  king: 'bg-amber-700 border-amber-700 text-white',
  villain: 'bg-red-700 border-red-700 text-white',
  minor: 'bg-green-700 border-green-700 text-white',
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function buildCounts(data: Person[]): ProcessedPerson[] {
  return data.map((person) => {
    const bookCounts: Record<string, number> = {};
    for (const { book } of person.mentions) {
      bookCounts[book] = (bookCounts[book] ?? 0) + 1;
    }
    const total = person.mentions.length;
    const bookIndices = BOOKS.map((_, i) => i).filter(
      (i) => bookCounts[BOOKS[i] ?? ''] ?? 0 > 0
    );
    const span =
      bookIndices.length > 1
        ? bookIndices[bookIndices.length - 1]! - bookIndices[0]!
        : bookIndices.length;
    return { ...person, bookCounts, total, span };
  });
}

function cellStyle(
  count: number,
  max: number,
  category: Category
): React.CSSProperties {
  if (!count) return { background: 'transparent' };
  const { h, s } = CAT_HSL[category];
  const t = Math.pow(count / max, 0.55);
  const l = Math.round(95 - t * 62);
  const textL = t > 0.4 ? 18 : 32;
  return {
    background: `hsl(${h}, ${s}%, ${l}%)`,
    color: `hsl(${h}, ${s}%, ${textL}%)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface BomHeatmapProps {
  data?: Person[];
}

export default function BomHeatmap({
  data = bomData as Person[],
}: BomHeatmapProps) {
  const [show, setShow] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all');
  const [sortMode, setSortMode] = useState<SortMode>('total');
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const processed = useMemo(() => buildCounts(data), [data]);

  const filtered = useMemo<ProcessedPerson[]>(() => {
    const base =
      activeCategory === 'all'
        ? processed
        : processed.filter((d) => d.category === activeCategory);
    return [...base].sort((a, b) => {
      if (sortMode === 'total') return b.total - a.total;
      if (sortMode === 'span') return b.span - a.span;
      return a.name.localeCompare(b.name);
    });
  }, [processed, activeCategory, sortMode]);

  const max = useMemo(
    () => Math.max(...filtered.flatMap((d) => Object.values(d.bookCounts)), 1),
    [filtered]
  );

  if (!show) {
    return <Button onClick={() => setShow(true)}>Show Heatmap</Button>;
  }

  return (
    <div className="relative min-h-screen bg-stone-50 p-6 font-serif">
      {/* Header */}
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-stone-800">
        Book of Mormon — Name Frequency
      </h1>
      <p className="mb-6 font-sans text-sm text-stone-400">
        Each cell shows how many times a name appears in that book. Hover for
        details.
      </p>
      <div className="absolute right-0 top-0">
        <Button mode="secondary" onClick={() => setShow(false)}>
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const label =
              cat === 'all'
                ? 'All'
                : cat.charAt(0).toUpperCase() + cat.slice(1) + 's';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1 font-sans text-xs transition-all duration-150 ${
                  isActive
                    ? CAT_BUTTON_ACTIVE[cat]
                    : 'border-stone-300 bg-white text-stone-500 hover:border-stone-400'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2 font-sans">
          <label className="text-xs text-stone-400">Sort by</label>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-md border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 focus:outline-none"
          >
            <option value="total">Total mentions</option>
            <option value="span">Book span</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-2 font-sans text-xs text-stone-400">
        <span>fewer</span>
        <div className="h-2 w-24 rounded-full bg-gradient-to-r from-stone-100 to-blue-600" />
        <span>more mentions</span>
        <div className="mx-2 h-4 w-px bg-stone-200" />
        {(['prophet', 'king', 'villain', 'minor'] as Category[]).map((cat) => (
          <span key={cat} className="flex items-center gap-1 capitalize">
            <span className={`h-2 w-2 rounded-full ${CAT_DOT_CLASS[cat]}`} />
            {cat}
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="border-collapse" style={{ minWidth: 680 }}>
          <thead>
            <tr>
              <th className="w-32 pb-2 pr-3 text-right font-sans text-xs font-normal text-stone-300" />
              {BOOKS.map((book) => (
                <th
                  key={book}
                  title={book}
                  className="whitespace-nowrap px-0.5 pb-2 text-center font-sans text-[10px] font-medium tracking-wide text-stone-400"
                >
                  {BOOK_SHORT[book]}
                </th>
              ))}
              <th className="pb-2 pl-3 font-sans text-[10px] font-normal text-stone-300">
                total
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.name}>
                {/* Name */}
                <td className="pb-0.5 pr-3 text-right align-middle">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-stone-700">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        CAT_DOT_CLASS[row.category]
                      }`}
                    />
                    {row.name}
                  </span>
                </td>

                {/* Cells */}
                {BOOKS.map((book) => {
                  const count = row.bookCounts[book] ?? 0;
                  const style = cellStyle(count, max, row.category);
                  return (
                    <td key={book} className="p-0.5">
                      <div
                        className="flex h-6 w-8 cursor-default items-center justify-center rounded font-sans text-[10px] font-semibold transition-transform duration-100 hover:scale-125"
                        style={style}
                        onMouseEnter={(e) =>
                          count &&
                          setTooltip({
                            name: row.name,
                            book,
                            count,
                            total: row.total,
                            x: e.clientX,
                            y: e.clientY,
                          })
                        }
                        onMouseMove={(e) =>
                          count &&
                          setTooltip(
                            (t) => t && { ...t, x: e.clientX, y: e.clientY }
                          )
                        }
                        onMouseLeave={() => setTooltip(null)}
                      >
                        {count > 0 ? count : ''}
                      </div>
                    </td>
                  );
                })}

                {/* Total */}
                <td className="pl-3 align-middle font-sans text-xs tabular-nums text-stone-400">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-stone-100 bg-white px-3 py-2 font-sans text-xs leading-relaxed shadow-md"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <p className="font-semibold text-stone-800">{tooltip.name}</p>
          <p className="text-stone-600">
            {tooltip.book}: {tooltip.count} mention
            {tooltip.count !== 1 ? 's' : ''}
          </p>
          <p className="text-stone-400">Total mentions: {tooltip.total}</p>
        </div>
      )}
    </div>
  );
}
