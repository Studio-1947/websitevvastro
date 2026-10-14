export interface Tool {
  title: string;
  body: string;
  /** Inner markup of a 24×24 stroke icon. */
  icon: string;
}

export interface ToolkitContent {
  title: string;
  lede: string;
  tools: Tool[];
}

export const toolkit: ToolkitContent = {
  title: 'Everything in one place',
  lede: 'All of it works from the same stock, so nothing is typed in twice.',
  tools: [
    {
      title: 'Billing',
      body: 'Quick search and printed bills.',
      icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>',
    },
    {
      title: 'Batches and expiry',
      body: 'Every batch with its expiry date.',
      icon: '<path d="M12 2 21 7v10l-9 5-9-5V7Z"/><path d="M12 12 21 7M12 12v10M12 12 3 7"/>',
    },
    {
      title: 'Purchase orders',
      body: 'Order from suppliers and track deliveries.',
      icon: '<path d="M2 6h12v10H2z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
    },
    {
      title: 'Shelf locations',
      body: 'Know which rack every item is on.',
      icon: '<path d="M4 3v18M20 3v18M4 9h16M4 15h16"/>',
    },
    {
      title: 'Prescription scan',
      body: "Read a doctor's prescription into the bill.",
      icon: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
    },
    {
      title: 'Medicine alerts',
      body: "A warning when two medicines on a bill don't mix.",
      icon: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    },
    {
      title: 'Records',
      body: 'Kept as you work, ready for regulatory reports.',
      icon: '<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    },
    {
      title: 'Sales reports',
      body: 'What sells, where, and when to restock.',
      icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    },
  ],
};
