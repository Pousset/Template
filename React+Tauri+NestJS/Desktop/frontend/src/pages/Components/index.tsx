import { useState } from 'react';
import { Badge, Button, Card, CardDivider, CardHeader, Input, Spinner } from '@/components/ui';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-text-muted font-mono">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function Components() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-text-primary">Components</h1>
        <p className="text-sm text-text-secondary">Tous les composants UI disponibles avec leurs variantes.</p>
      </div>

      {/* BUTTON */}
      <Section title="Button">
        <Row label="variant">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Row>
        <Row label="size">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="state">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Full width</Button>
        </Row>
      </Section>

      {/* BADGE */}
      <Section title="Badge">
        <Row label="variant">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </Row>
        <Row label="size">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
        </Row>
      </Section>

      {/* INPUT */}
      <Section title="Input">
        <Row label="default">
          <div className="w-72">
            <Input placeholder="Texte..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </div>
        </Row>
        <Row label="with label + hint">
          <div className="w-72">
            <Input label="Email" placeholder="you@example.com" hint="Nous ne partageons pas votre email." />
          </div>
        </Row>
        <Row label="error state">
          <div className="w-72">
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              error={inputError || 'Ce champ est requis.'}
              onChange={() => setInputError('')}
            />
          </div>
        </Row>
        <Row label="with icons">
          <div className="w-72">
            <Input
              placeholder="Rechercher..."
              leftIcon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              }
            />
          </div>
        </Row>
        <Row label="disabled">
          <div className="w-72">
            <Input placeholder="Désactivé" disabled />
          </div>
        </Row>
      </Section>

      {/* CARD */}
      <Section title="Card">
        <Row label="padding">
          <Card padding="sm" className="text-sm text-text-secondary">
            padding sm
          </Card>
          <Card padding="md" className="text-sm text-text-secondary">
            padding md
          </Card>
          <Card padding="lg" className="text-sm text-text-secondary">
            padding lg
          </Card>
        </Row>
        <Row label="with CardHeader + CardDivider">
          <Card className="w-full max-w-sm">
            <CardHeader
              title="Titre de la carte"
              description="Description optionnelle sous le titre."
              action={<Badge variant="primary">Nouveau</Badge>}
            />
            <CardDivider />
            <p className="text-sm text-text-secondary">Contenu de la carte.</p>
          </Card>
        </Row>
      </Section>

      {/* SPINNER */}
      <Section title="Spinner">
        <Row label="size">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
      </Section>
    </div>
  );
}
