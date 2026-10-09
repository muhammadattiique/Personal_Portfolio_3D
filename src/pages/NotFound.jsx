import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found</title>
      </Helmet>

      <main className="min-h-[85vh] flex flex-col items-center justify-center text-center px-5 pt-32 pb-24">
        <span className="font-mono text-eyebrow text-accent uppercase tracking-widest mb-4">
          ERROR 404
        </span>
        <h1 className="font-display text-display-xl font-extrabold text-foreground tracking-tight">
          PAGE NOT FOUND
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted max-w-md mx-auto leading-relaxed">
          The requested coordinate does not exist or has been relocated to another directory.
        </p>

        <div className="mt-10">
          <Button to="/" variant="primary" size="lg" icon={<ArrowLeft size={16} />}>
            Return to Index
          </Button>
        </div>
      </main>
    </>
  );
}

