interface AuthFormWrapperProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthFormWrapper({ title, subtitle, children }: AuthFormWrapperProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)' }}
        />
      </div>

      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl border border-border p-8 space-y-6"
          style={{ background: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(16px)' }}
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            <p className="text-sm text-text-muted">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
