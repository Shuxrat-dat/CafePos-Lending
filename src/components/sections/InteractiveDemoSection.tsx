'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CakeSlice, ChefHat, Coffee, Minus, Play, Plus, RotateCcw, Salad, ShoppingCart, Square, Users, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { useFormatNumber, useTranslation } from '@/i18n/useTranslation';
import type { Order, OrderItem, OrderStatus, Table } from '@/types/restaurant';
import { initialTables } from '@/data/tableData';
import { menuCategories, menuItems, getMenuItemsByCategory } from '@/data/menuData';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'hot-dishes': UtensilsCrossed,
  salads: Salad,
  drinks: Coffee,
  desserts: CakeSlice,
};

const TABLE_TONE: Record<Table['status'], string> = {
  free: 'border-fresh/50 bg-fresh/10 text-fresh',
  occupied: 'border-cafe/60 bg-cafe/15 text-cafe-soft',
  waiting: 'border-[#ffb74d]/60 bg-[#ffb74d]/12 text-[#ffcf8a]',
  serving: 'border-[#6b9bff]/60 bg-[#6b9bff]/12 text-[#a9c4ff]',
};

const ORDER_TONE: Record<OrderStatus, string> = {
  new: 'bg-cafe/20 text-cafe-soft',
  cooking: 'bg-[#6b9bff]/20 text-[#a9c4ff]',
  ready: 'bg-fresh/20 text-fresh',
};

const FLOW: OrderStatus[] = ['new', 'cooking', 'ready'];

export function InteractiveDemoSection() {
  const { t, locale } = useTranslation();
  const fmt = useFormatNumber();
  const reduce = useReducedMotion();
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0].id);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const timers = useRef<number[]>([]);
  const orderNo = useRef(1000);

  const selectedTable = tables.find((tb) => tb.id === selectedTableId) ?? null;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const markTable = (id: string, status: Table['status']) =>
    setTables((prev) => prev.map((tb) => (tb.id === id ? { ...tb, status } : tb)));

  const handleTableSelect = (table: Table) => {
    setSelectedTableId(table.id);
    if (table.status === 'free') markTable(table.id, 'occupied');
    setCurrentOrder([]);
  };

  const handleAddItem = (menuItemId: string) => {
    const menuItem = menuItems.find((i) => i.id === menuItemId);
    if (!menuItem) return;
    setCurrentOrder((prev) =>
      prev.some((i) => i.menuItemId === menuItemId)
        ? prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { menuItemId, quantity: 1, price: menuItem.price }],
    );
  };

  const handleRemoveItem = (menuItemId: string) => {
    setCurrentOrder((prev) =>
      prev.flatMap((i) => (i.menuItemId !== menuItemId ? [i] : i.quantity > 1 ? [{ ...i, quantity: i.quantity - 1 }] : [])),
    );
  };

  /** Sends the given lines for the given table — no stale state from closures. */
  const sendToKitchen = (table: Table, lines: OrderItem[]) => {
    if (lines.length === 0) return;
    orderNo.current += 1;
    setOrders((prev) => [
      ...prev,
      {
        id: String(orderNo.current),
        tableId: table.id,
        tableNumber: table.number,
        items: lines,
        status: 'new',
        createdAt: new Date(),
        total: lines.reduce((sum, i) => sum + i.price * i.quantity, 0),
      },
    ]);
    setCurrentOrder([]);
    markTable(table.id, 'serving');
  };

  const setOrderStatus = (orderId: string, status: OrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

  const resetDemo = () => {
    clearTimers();
    setTables(initialTables);
    setSelectedTableId(null);
    setCurrentOrder([]);
    setOrders([]);
    setIsAutoPlaying(false);
  };

  /** Scripted walk-through: table 2 → two dishes → kitchen → cooking → ready. */
  const startAuto = () => {
    resetDemo();
    setIsAutoPlaying(true);
    const table = initialTables[1];
    const pasta = menuItems.find((m) => m.id === 'pasta-carbonara')!;
    const coffee = menuItems.find((m) => m.id === 'cappuccino')!;
    const lines: OrderItem[] = [
      { menuItemId: pasta.id, quantity: 1, price: pasta.price },
      { menuItemId: coffee.id, quantity: 2, price: coffee.price },
    ];
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(600, () => {
      setSelectedTableId(table.id);
      markTable(table.id, 'occupied');
      setSelectedCategory('hot-dishes');
    });
    at(1500, () => setCurrentOrder([lines[0]]));
    at(2200, () => setSelectedCategory('drinks'));
    at(2700, () => setCurrentOrder(lines));
    at(3900, () => sendToKitchen(table, lines));
    at(5600, () => setOrders((prev) => prev.map((o, i) => (i === prev.length - 1 ? { ...o, status: 'cooking' } : o))));
    at(7600, () => {
      setOrders((prev) => prev.map((o, i) => (i === prev.length - 1 ? { ...o, status: 'ready' } : o)));
      setIsAutoPlaying(false);
    });
  };

  const stopAuto = () => {
    clearTimers();
    setIsAutoPlaying(false);
  };

  const total = currentOrder.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const panel = 'theme-dark flex flex-col rounded-[24px] border border-paper/12 bg-[linear-gradient(180deg,#141d35,#0a1122)] p-5 shadow-[0_50px_100px_-50px_rgb(20_30_60/0.7)]';

  return (
    <section id="demo" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-[60%] -z-10 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(240_169_69/0.14),transparent)]" />
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <SectionHeader title={t.demo.heading} lead={t.demo.description} align="split" />

        <Reveal delay={200} className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={startAuto} disabled={isAutoPlaying} className="btn btn-gold disabled:opacity-50">
            <span className="btn-label">
              <Play className="size-4" aria-hidden />
              {t.demo.startDemo}
            </span>
          </button>
          <button type="button" onClick={stopAuto} disabled={!isAutoPlaying} className="btn btn-ghost disabled:opacity-40">
            <span className="btn-label">
              <Square className="size-4" aria-hidden />
              {t.demo.stopDemo}
            </span>
          </button>
          <button type="button" onClick={resetDemo} className="btn btn-ghost">
            <span className="btn-label">
              <RotateCcw className="size-4" aria-hidden />
              {t.demo.resetDemo}
            </span>
          </button>
          <AnimatePresence>
            {isAutoPlaying && (
              <motion.span
                role="status"
                initial={{ opacity: 0, transform: 'translateX(-6px)' }}
                animate={{ opacity: 1, transform: 'translateX(0px)' }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[0.88rem] text-cafe-soft"
              >
                <span className="size-2 animate-pulse rounded-full bg-cafe" aria-hidden />
                {t.demo.running}
              </motion.span>
            )}
          </AnimatePresence>
        </Reveal>
        <p className="mt-3 text-[0.82rem] text-mist">{t.demo.demoNote}</p>

        <Reveal variant="clip" delay={150} className="mt-10 grid gap-5 lg:grid-cols-3">
          {/* Floor plan */}
          <div className={panel}>
            <h3 className="flex items-center gap-2 font-display text-base font-medium text-paper">
              <Users className="size-4 text-cafe" aria-hidden /> {t.demo.floorPlan}
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {tables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => handleTableSelect(table)}
                  aria-pressed={selectedTableId === table.id}
                  className={`min-h-20 rounded-2xl border p-3 text-left transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 active:scale-[0.97] ${TABLE_TONE[table.status]} ${
                    selectedTableId === table.id ? 'shadow-[0_0_0_2px_#e2b65c,0_10px_24px_-10px_rgb(226_182_92/0.6)]' : ''
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {t.common.table} {table.number}
                  </span>
                  <span className="mt-1 block text-[0.7rem] opacity-85">{t.demo.tableStatus[table.status]}</span>
                </button>
              ))}
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-[0.75rem] text-mist">
              {(['free', 'occupied', 'waiting', 'serving'] as const).map((status) => (
                <li key={status} className="flex items-center gap-2">
                  <span className={`size-3 rounded border ${TABLE_TONE[status]}`} aria-hidden />
                  {t.demo.tableStatus[status]}
                </li>
              ))}
            </ul>
          </div>

          {/* Waiter interface */}
          <div className={panel}>
            <h3 className="flex items-center gap-2 font-display text-base font-medium text-paper">
              <ShoppingCart className="size-4 text-cafe" aria-hidden /> {t.demo.waiterInterface}
            </h3>
            {selectedTable ? (
              <>
                <div className="mt-4 rounded-xl bg-paper/[0.05] px-3 py-2 text-sm text-cafe-soft">
                  {t.common.table} {selectedTable.number}
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {menuCategories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.id] ?? UtensilsCrossed;
                    const on = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        aria-pressed={on}
                        className={`relative isolate flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors duration-200 ${
                          on ? 'text-[#1a1206]' : 'border border-paper/10 text-mist hover:text-paper'
                        }`}
                      >
                        {on && (
                          <motion.span
                            layoutId="cafe-demo-cat"
                            transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.15 }}
                            className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(180deg,#f3d9a0,#d9a64a)]"
                          />
                        )}
                        <Icon className="size-3.5" aria-hidden />
                        {cat.name[locale]}
                      </button>
                    );
                  })}
                </div>
                <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                  {getMenuItemsByCategory(selectedCategory).map((item) => {
                    const inOrder = currentOrder.find((i) => i.menuItemId === item.id);
                    return (
                      <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl bg-paper/[0.04] p-2.5">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm text-paper">{item.name[locale]}</div>
                          <div className="text-xs text-cafe-soft">
                            {fmt(item.price)} {t.common.currency}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {inOrder && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                aria-label={`${t.demo.removeFromOrder}: ${item.name[locale]}`}
                                className="grid size-8 place-items-center rounded-lg bg-paper/10 text-paper hover:bg-paper/15 active:scale-95"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <motion.span key={inOrder.quantity} initial={reduce ? false : { transform: 'scale(1.4)' }} animate={{ transform: 'scale(1)' }} className="min-w-5 text-center text-sm font-bold text-gold">
                                {inOrder.quantity}
                              </motion.span>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleAddItem(item.id)}
                            aria-label={`${t.demo.addToOrder}: ${item.name[locale]}`}
                            className="grid size-8 place-items-center rounded-lg bg-[linear-gradient(180deg,#f3d9a0,#d9a64a)] text-[#1a1206] active:scale-95"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <AnimatePresence initial={false}>
                  {currentOrder.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, transform: 'translateY(8px)' }}
                      animate={{ opacity: 1, transform: 'translateY(0px)' }}
                      exit={{ opacity: 0 }}
                      className="mt-auto border-t border-paper/10 pt-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-paper">{t.demo.total}</span>
                        <span className="font-display text-lg text-gold">
                          {fmt(total)} {t.common.currency}
                        </span>
                      </div>
                      <button type="button" onClick={() => selectedTable && sendToKitchen(selectedTable, currentOrder)} className="btn btn-gold w-full">
                        <span className="btn-label">
                          <ChefHat className="size-4" aria-hidden />
                          {t.demo.sendToKitchen}
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="my-auto py-12 text-center text-sm text-mist">
                <Users className="mx-auto mb-3 size-10 opacity-30" aria-hidden />
                {t.demo.selectTable}
              </div>
            )}
          </div>

          {/* Kitchen display */}
          <div className={panel}>
            <h3 className="flex items-center gap-2 font-display text-base font-medium text-paper">
              <ChefHat className="size-4 text-cafe" aria-hidden /> {t.demo.kitchenDisplay}
            </h3>
            <div className="mt-4 max-h-[460px] space-y-3 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {orders.map((order) => {
                  const idx = FLOW.indexOf(order.status);
                  const next = FLOW[idx + 1] as Exclude<OrderStatus, 'new'> | undefined;
                  return (
                    <motion.div
                      key={order.id}
                      layout={!reduce}
                      initial={{ opacity: 0, transform: 'translateX(-24px) scale(0.96)' }}
                      animate={{ opacity: 1, transform: 'translateX(0px) scale(1)' }}
                      exit={{ opacity: 0, transform: 'scale(0.96)' }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold text-paper">
                            {t.common.order} #{order.id}
                          </div>
                          <div className="text-xs text-cafe-soft">
                            {t.common.table} {order.tableNumber}
                          </div>
                        </div>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={order.status}
                            initial={{ opacity: 0, transform: 'translateY(4px)' }}
                            animate={{ opacity: 1, transform: 'translateY(0px)' }}
                            exit={{ opacity: 0, transform: 'translateY(-4px)' }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-full px-2.5 py-1 text-xs ${ORDER_TONE[order.status]}`}
                          >
                            {t.demo.orderStatuses[order.status]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-mist">
                        {order.items.map((item) => (
                          <li key={item.menuItemId}>
                            {menuItems.find((m) => m.id === item.menuItemId)?.name[locale]} ×{item.quantity}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper/10">
                        <motion.div
                          className={`h-full origin-left rounded-full ${order.status === 'ready' ? 'bg-fresh' : 'bg-cafe'}`}
                          initial={false}
                          animate={{ transform: `scaleX(${(idx + 1) / FLOW.length})` }}
                          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        />
                      </div>
                      {next && (
                        <button
                          type="button"
                          onClick={() => setOrderStatus(order.id, next)}
                          className="mt-3 min-h-9 w-full rounded-xl bg-[linear-gradient(180deg,#f3d9a0,#d9a64a)] px-3 text-xs font-semibold text-[#1a1206] transition-transform active:scale-[0.97]"
                        >
                          {t.demo.nextStatus[next]}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {orders.length === 0 && (
                <div className="py-12 text-center text-sm text-mist">
                  <ChefHat className="mx-auto mb-3 size-10 opacity-30" aria-hidden />
                  {t.demo.noOrders}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
