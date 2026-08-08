// Typography primitives — spec item 5: "Custom component or module for
// headers, paragraphs, subheaders, labels, inputs, and error messages."
// Personality comes from weight contrast on the single Geist variable font
// (100–900) rather than a second display family: headers sit at 700–900,
// body copy at 400, captions at 500 with wide tracking.

export function Header({ children, className = "" }) {
  return (
    <h1 className={`font-sans font-extrabold tracking-tight text-forest text-3xl md:text-4xl leading-[1.1] ${className}`}>
      {children}
    </h1>
  );
}

export function Subheader({ children, className = "" }) {
  return (
    <h2 className={`font-sans font-semibold text-forest-600 text-lg md:text-xl ${className}`}>
      {children}
    </h2>
  );
}

export function Paragraph({ children, className = "" }) {
  return (
    <p className={`font-sans font-normal text-ink/80 text-base leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`block font-sans font-medium text-sm text-forest-700 mb-1.5 tracking-wide ${className}`}>
      {children}
    </label>
  );
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm font-medium text-rust flex items-center gap-1.5">
      <span aria-hidden="true">&#9888;</span> {children}
    </p>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <span className={`font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-moss-600 ${className}`}>
      {children}
    </span>
  );
}
