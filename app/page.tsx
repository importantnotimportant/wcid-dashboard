import { fetchDashboardData } from '@/lib/sanity'

// Revalidate every hour
export const revalidate = 3600

// Simple card component
function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">{title}</h3>
      {children}
    </div>
  )
}

// Big number display
function BigNumber({ value, label }: { value: number | string; label?: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {label && <div className="text-sm text-gray-500 mt-1">{label}</div>}
    </div>
  )
}

// Table component
function DataTable({ data, columns }: { data: any[]; columns: { key: string; label: string; format?: (v: any) => string }[] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400 text-sm">No data</div>
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-2 font-medium text-gray-600">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-100">
              {columns.map((col) => (
                <td key={col.key} className="py-2 text-gray-800">
                  {col.format ? col.format(row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Progress bar
function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}

export default async function Dashboard() {
  const data = await fetchDashboardData()
  
  const usPercent = data.totalActions > 0 
    ? Math.round((data.usVsNonUs.us / data.totalActions) * 100)
    : 0
    
  const aplPercent = data.aplCoverage.total > 0
    ? Math.round((data.aplCoverage.withPositions / data.aplCoverage.total) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">WCID Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last data update: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown'}
            {' · '}
            Dashboard refreshed: {new Date(data.fetchedAt).toLocaleString()}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card title="Total Actions">
            <BigNumber value={data.totalActions} />
          </Card>
          <Card title="Countries Served">
            <BigNumber value={data.totalCountries} />
          </Card>
          <Card title="US vs International">
            <BigNumber value={`${usPercent}%`} label="US actions" />
          </Card>
          <Card title="APL Coverage">
            <BigNumber value={`${aplPercent}%`} label="actions with positions" />
          </Card>
        </div>

        {/* Be Heard breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card title="Be Heard Actions" className="md:col-span-1">
            <BigNumber value={data.beHeardByLevel.total} />
          </Card>
          <Card title="Federal" className="md:col-span-1">
            <BigNumber value={data.beHeardByLevel.federal} />
          </Card>
          <Card title="State" className="md:col-span-1">
            <BigNumber value={data.beHeardByLevel.state} />
          </Card>
          <Card title="Local" className="md:col-span-1">
            <BigNumber value={data.beHeardByLevel.local} />
          </Card>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Actions by Verb */}
          <Card title="Actions by Verb (Category)">
            {data.actionsByCategory.slice(0, 10).map((cat: any) => (
              <ProgressBar 
                key={cat.slug} 
                value={cat.count} 
                max={data.actionsByCategory[0]?.count || 1} 
                label={cat.name} 
              />
            ))}
          </Card>

          {/* Actions by Noun (top 15) */}
          <Card title="Top Nouns">
            {data.actionsByNoun.slice(0, 12).map((noun: any) => (
              <ProgressBar 
                key={noun.slug} 
                value={noun.count} 
                max={data.actionsByNoun[0]?.count || 1} 
                label={noun.name} 
              />
            ))}
          </Card>

          {/* Actions by Country */}
          <Card title="Actions by Country">
            <DataTable 
              data={data.actionsByCountry.slice(0, 12)} 
              columns={[
                { key: 'country', label: 'Country' },
                { key: 'count', label: 'Actions', format: (v) => v.toLocaleString() },
              ]} 
            />
          </Card>

          {/* Top Skills */}
          <Card title="Most Common Skills">
            {data.actionsBySkill.filter((s: any) => s.count > 0).slice(0, 10).map((skill: any) => (
              <ProgressBar 
                key={skill.name} 
                value={skill.count} 
                max={data.actionsBySkill[0]?.count || 1} 
                label={skill.name} 
              />
            ))}
          </Card>

          {/* Verb + Noun Combinations */}
          <Card title="Top Verb + Noun Combos">
            <DataTable 
              data={data.verbNounCombos.slice(0, 10)} 
              columns={[
                { key: 'combo', label: 'Combination' },
                { key: 'count', label: '#', format: (v) => v.toLocaleString() },
              ]} 
            />
          </Card>

          {/* Positions with most actions (APL) */}
          <Card title="Positions with Most Actions">
            {data.actionsByPosition.filter((p: any) => p.count > 0).length > 0 ? (
              <DataTable 
                data={data.actionsByPosition.filter((p: any) => p.count > 0).slice(0, 12)} 
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'name', label: 'Position', format: (v) => v?.substring(0, 30) + (v?.length > 30 ? '...' : '') },
                  { key: 'count', label: '#' },
                ]} 
              />
            ) : (
              <div className="text-gray-400 text-sm">APL positions not yet imported</div>
            )}
          </Card>
        </div>

        {/* APL Coverage detail */}
        <div className="mt-8">
          <Card title="APL Framework Integration">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{data.aplCoverage.withPositions.toLocaleString()}</div>
                <div className="text-sm text-gray-500">With Positions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-400">{data.aplCoverage.withoutPositions.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Without Positions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{data.aplCoverage.total.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Actions</div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          WCID Internal Dashboard · Data refreshes hourly
        </div>
      </footer>
    </div>
  )
}
