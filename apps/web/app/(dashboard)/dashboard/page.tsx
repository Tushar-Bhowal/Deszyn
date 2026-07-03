import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Total projects', value: '12' },
  { label: 'Designs generated', value: '48' },
  { label: 'Names verified', value: '320' },
  { label: 'Exports', value: '9' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your design activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
