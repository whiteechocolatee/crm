import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex gap-4">
      <Button disabled size="lg" variant="primary">
        Button
      </Button>
      <Button variant="destructive">Button</Button>
      <Button size="sm" variant="secondary">
        Button
      </Button>
      <Button variant="ghost">Button</Button>
      <Button variant="teritary">Button</Button>
      <Button variant="muted">Button</Button>
    </div>
  );
}
