'use client';

import { XIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import Button from '../../base/buttons/button';
import bomData from './bom-names.json';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Category = 'prophet' | 'king' | 'villain' | 'minor';
type SortMode = 'total' | 'span' | 'name' | 'first';
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
  chapterCounts: Record<string, Record<number, number>>;
  total: number;
  span: number;
  chapterSpan: number | null;
  firstMention: number | null;
}

type ZoomLevel = 0 | 1 | 2 | 3;

type Column =
  | { type: 'book'; book: string; label: string }
  | { type: 'group'; book: string; start: number; end: number; label: string }
  | { type: 'chapter'; book: string; chapter: number; label: string };

interface TooltipState {
  name: string;
  columnLabel: string;
  count: number;
  total: number;
  span: number;
  chapterSpan: number | null;
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

// Static chapter counts derived from /data/json directory structure
const BOOK_CHAPTERS: Record<string, number> = {
  '1 Nephi': 22,
  '2 Nephi': 33,
  Jacob: 7,
  Enos: 1,
  Jarom: 1,
  Omni: 1,
  'Words of Mormon': 1,
  Mosiah: 29,
  Alma: 63,
  Helaman: 16,
  '3 Nephi': 30,
  '4 Nephi': 1,
  Mormon: 9,
  Ether: 15,
  Moroni: 10,
};

// Group sizes for each zoom level (1, 2, 3). Level 0 = book view.
const ZOOM_GROUP_SIZES: Record<1 | 2 | 3, number> = { 1: 10, 2: 5, 3: 1 };

const ZOOM_LEVEL_LABELS: Record<ZoomLevel, string> = {
  0: 'Books',
  1: 'Chapter groups (10)',
  2: 'Chapter groups (5)',
  3: 'Individual chapters',
};

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

const CAT_HSL: Record<Category, { h: number; s: number }> = {
  prophet: { h: 213, s: 72 },
  king: { h: 34, s: 82 },
  villain: { h: 10, s: 68 },
  minor: { h: 100, s: 63 },
};

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
    const chapterCounts: Record<string, Record<number, number>> = {};

    for (const { book, chapter } of person.mentions) {
      bookCounts[book] = (bookCounts[book] ?? 0) + 1;
      if (!chapterCounts[book]) chapterCounts[book] = {};
      (chapterCounts[book] ?? {})[chapter] =
        ((chapterCounts[book] ?? {})[chapter] ?? 0) + 1;
    }

    const total = person.mentions.length;
    const bookIndices = BOOKS.map((_, i) => i).filter(
      (i) => (bookCounts[BOOKS[i] ?? ''] ?? 0) > 0
    );
    const span =
      bookIndices.length > 1
        ? bookIndices[bookIndices.length - 1]! - bookIndices[0]!
        : bookIndices.length - 1;
    const chapterSpan =
      bookIndices.length === 1
        ? person.mentions[person.mentions.length - 1]!.chapter -
          person.mentions[0]!.chapter
        : null;
    const firstMention = person.mentions[0] ?? null;
    const firstMentionScore =
      firstMention !== null
        ? (BOOKS.indexOf(firstMention.book) ?? 0) * 1000 +
          (firstMention.chapter ?? 0)
        : null;
    return {
      ...person,
      bookCounts,
      chapterCounts,
      total,
      span,
      chapterSpan,
      firstMention: firstMentionScore,
    };
  });
}

function getColumns(zoomedBook: string | null, zoomLevel: ZoomLevel): Column[] {
  return BOOKS.flatMap((book): Column[] => {
    const short = BOOK_SHORT[book] ?? book;

    if (book !== zoomedBook || zoomLevel === 0) {
      return [{ type: 'book', book, label: short }];
    }

    const totalChapters = BOOK_CHAPTERS[book] ?? 1;
    const groupSize = ZOOM_GROUP_SIZES[zoomLevel];

    if (groupSize === 1) {
      return Array.from(
        { length: totalChapters },
        (_, i): Column => ({
          type: 'chapter',
          book,
          chapter: i + 1,
          label: String(i + 1),
        })
      );
    }

    const cols: Column[] = [];
    for (let start = 1; start <= totalChapters; start += groupSize) {
      const end = Math.min(start + groupSize - 1, totalChapters);
      cols.push({
        type: 'group',
        book,
        start,
        end,
        label: start === end ? String(start) : `${start}–${end}`,
      });
    }
    return cols;
  });
}

function getCount(person: ProcessedPerson, col: Column): number {
  if (col.type === 'book') {
    return person.bookCounts[col.book] ?? 0;
  } else if (col.type === 'group') {
    const chapters = person.chapterCounts[col.book] ?? {};
    let count = 0;
    for (let ch = col.start; ch <= col.end; ch++) {
      count += chapters[ch] ?? 0;
    }
    return count;
  } else {
    return (person.chapterCounts[col.book] ?? {})[col.chapter] ?? 0;
  }
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
  const [zoomedBook, setZoomedBook] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(0);

  const processed = useMemo(() => buildCounts(data), [data]);

  const filtered = useMemo<ProcessedPerson[]>(() => {
    const base =
      activeCategory === 'all'
        ? processed
        : processed.filter((d) => d.category === activeCategory);
    return [...base].sort((a, b) => {
      if (sortMode === 'total') return b.total - a.total;
      if (sortMode === 'span') {
        const d = b.span - a.span;
        if (d !== 0) return d;
        if (b.chapterSpan !== null && a.chapterSpan !== null) {
          const d = b.chapterSpan - a.chapterSpan;
          if (d !== 0) return d;
        }
        return (a.firstMention ?? 0) - (b.firstMention ?? 0);
      }
      if (sortMode === 'first')
        return (a.firstMention ?? 0) - (b.firstMention ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [processed, activeCategory, sortMode]);

  const columns = useMemo(
    () => getColumns(zoomedBook, zoomLevel),
    [zoomedBook, zoomLevel]
  );

  const max = useMemo(
    () =>
      Math.max(
        ...filtered.flatMap((d) => columns.map((col) => getCount(d, col))),
        1
      ),
    [filtered, columns]
  );

  function handleBookHeaderClick(book: string) {
    if (zoomedBook !== book) {
      // Zoom into a new book at level 1
      setZoomedBook(book);
      setZoomLevel(1);
    } else if (zoomLevel < 3) {
      // Zoom in further on the same book
      setZoomLevel((prev) => (prev + 1) as ZoomLevel);
    } else {
      // Fully zoomed — collapse back to book view
      setZoomedBook(null);
      setZoomLevel(0);
    }
  }

  function handleZoomOut() {
    if (zoomLevel <= 1) {
      setZoomedBook(null);
      setZoomLevel(0);
    } else {
      setZoomLevel((prev) => (prev - 1) as ZoomLevel);
    }
  }

  if (!show) {
    return <Button onClick={() => setShow(true)}>Show Heatmap</Button>;
  }

  const isZoomed = zoomedBook !== null && zoomLevel > 0;

  return (
    <div className="relative min-h-screen bg-stone-50 p-6 font-serif">
      {/* Header */}
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-stone-800">
        Book of Mormon — Name Frequency
      </h1>
      <p className="mb-4 font-sans text-sm text-stone-400">
        Each cell shows how many times a name appears in that{' '}
        {zoomLevel === 0
          ? 'book'
          : zoomLevel === 3
          ? 'chapter'
          : 'chapter group'}
        . Hover for details.{' '}
        {!isZoomed && (
          <span className="text-stone-300">
            Click a book header to zoom into its chapters.
          </span>
        )}
      </p>
      <div className="absolute right-0 top-0">
        <Button mode="secondary" onClick={() => setShow(false)}>
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* Zoom breadcrumb */}
      {isZoomed && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5 font-sans text-xs">
          <button
            onClick={() => {
              setZoomedBook(null);
              setZoomLevel(0);
            }}
            className="text-stone-400 underline hover:text-stone-600"
          >
            All Books
          </button>
          <span className="text-stone-300">›</span>
          <span className="font-medium text-stone-700">{zoomedBook}</span>
          <span className="text-stone-300">›</span>
          <span className="text-stone-500">{ZOOM_LEVEL_LABELS[zoomLevel]}</span>
          <button
            onClick={handleZoomOut}
            className="ml-3 rounded border border-stone-200 bg-white px-2 py-0.5 text-stone-500 hover:border-stone-400 hover:text-stone-700"
          >
            ← Zoom out
          </button>
          {zoomLevel < 3 && (
            <button
              onClick={() => setZoomLevel((prev) => (prev + 1) as ZoomLevel)}
              className="rounded border border-stone-200 bg-white px-2 py-0.5 text-stone-500 hover:border-stone-400 hover:text-stone-700"
            >
              Zoom in →
            </button>
          )}
        </div>
      )}

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
            <option value="first">First mention</option>
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
              {columns.map((col, i) => {
                if (col.type === 'book') {
                  const isCurrentZoomed = col.book === zoomedBook;
                  return (
                    <th
                      key={`book-${col.book}-${i}`}
                      title={`${col.book} — click to zoom into chapters`}
                      onClick={() => handleBookHeaderClick(col.book)}
                      className={`cursor-pointer select-none whitespace-nowrap px-0.5 pb-2 text-center font-sans text-[10px] font-medium tracking-wide transition-colors ${
                        isCurrentZoomed
                          ? 'text-stone-700 underline underline-offset-2'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      {col.label}
                    </th>
                  );
                }

                // Chapter group or individual chapter column
                const isFirst =
                  i === 0 ||
                  columns[i - 1]?.book !== col.book ||
                  columns[i - 1]?.type === 'book';
                return (
                  <th
                    key={`col-${col.book}-${i}`}
                    title={
                      col.type === 'group'
                        ? `${col.book} Ch ${col.start}–${col.end}`
                        : `${col.book} Ch ${col.chapter}`
                    }
                    className={`whitespace-nowrap px-0.5 pb-2 text-center font-sans text-[10px] font-medium tracking-wide text-stone-500 ${
                      isFirst ? 'border-l border-stone-200 pl-1' : ''
                    }`}
                  >
                    {col.label}
                  </th>
                );
              })}
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
                {columns.map((col, i) => {
                  const count = getCount(row, col);
                  const style = cellStyle(count, max, row.category);
                  const isFirst =
                    i === 0 ||
                    columns[i - 1]?.book !== col.book ||
                    columns[i - 1]?.type === 'book';
                  const isExpandedCol = col.type !== 'book';

                  let tooltipLabel: string;
                  if (col.type === 'book') {
                    tooltipLabel = col.book;
                  } else if (col.type === 'group') {
                    tooltipLabel = `${col.book} Ch ${col.start}–${col.end}`;
                  } else {
                    tooltipLabel = `${col.book} Ch ${col.chapter}`;
                  }

                  return (
                    <td
                      key={`${col.book}-${i}`}
                      className={`p-0.5 ${
                        isFirst && isExpandedCol
                          ? 'border-l border-stone-200 pl-1'
                          : ''
                      }`}
                    >
                      <div
                        className="flex h-6 w-8 cursor-default items-center justify-center rounded font-sans text-[10px] font-semibold transition-transform duration-100 hover:scale-125"
                        style={style}
                        onMouseEnter={(e) =>
                          count &&
                          setTooltip({
                            name: row.name,
                            columnLabel: tooltipLabel,
                            count,
                            total: row.total,
                            x: e.clientX,
                            y: e.clientY,
                            span: row.span + 1,
                            chapterSpan:
                              row.chapterSpan !== null
                                ? row.chapterSpan + 1
                                : null,
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
            {tooltip.columnLabel}: {tooltip.count} mention
            {tooltip.count !== 1 ? 's' : ''}
          </p>
          <p className="text-stone-400">Total mentions: {tooltip.total}</p>
          {tooltip.chapterSpan !== null ? (
            <p className="text-stone-400">
              Chapter span: {tooltip.chapterSpan}
            </p>
          ) : (
            <p className="text-stone-400">Book span: {tooltip.span}</p>
          )}
        </div>
      )}
    </div>
  );
}
