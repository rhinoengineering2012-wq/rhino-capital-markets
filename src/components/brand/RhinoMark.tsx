interface RhinoMarkProps {
  className?: string;
}

export default function RhinoMark({ className = 'h-8 w-8' }: RhinoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="#FFD60A" aria-hidden="true">
      <path d="M6 38c0-8 6-13 16-14l16-1c3-.2 4-2 4-4.5V15l4-6 4 9v5c3 1.5 5 4 5 8v5c0 1-.5 2-1.5 2.5L52 40v7h-5v-5H26v5h-5v-5h-4v5h-5v-5l-6-1.5C6 40.5 6 39.5 6 38z" />
      <path d="M46 14l9-12 1.5 13.5L46 14z" />
      <circle cx="49" cy="27" r="1.6" fill="#000" />
    </svg>
  );
}
