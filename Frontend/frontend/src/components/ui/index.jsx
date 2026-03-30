// ── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-400',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-400',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm gap-1.5', md: 'px-4 py-2.5 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all
            ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <select
        className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all appearance-none
          ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'}
          ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    slate: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-light">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ message, type = 'error' }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <div className={`px-4 py-3 rounded-xl border text-sm font-medium ${styles[type]}`}>
      {message}
    </div>
  );
}