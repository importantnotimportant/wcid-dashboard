import { fetchDashboardData } from '@/lib/sanity'

export const revalidate = 3600

function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">{title}</h3>
      {children}
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 mt-12 first:mt-0">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  )
}

function BigNumber({ value, label, color = 'gray' }: { value: number | string; label?: string; color?: 'gray' | 'green' | 'yellow' | 'red' }) {
  const colorClasses = {
    gray: 'text-gray-900',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  }
  return (
    <div>
      <div className={`text-4xl font-bold ${colorClasses[color]}`}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {label && <div className="text-sm text-gray-500 mt-1">{label}</div>}
    </div>
  )
}

function StatRow({ label, value, color = 'gray' }: { label: string; value: number; color?: 'gray' | 'green' | 'yellow' | 'red' }) {
  const colorClasses = {
    gray: 'text-gray-900',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  }
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${colorClasses[color]}`}>{value.toLocaleString()}</span>
    </div>
  )
}

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export default async function Dashboard() {
  const data = await fetchDashboardData()
  
  const usPercent = data.totalActions > 0 
    ? Math.round((data.usVsNonUs.us / data.totalActions) * 100)
    : 0
    
  const aplPercent = data.aplCoverage.total > 0
    ? Math.round((data.aplCoverage.withPositions / data.aplCoverage.total) * 100)
    : 0

  // Calculate content health score
  const healthIssues = data.actionsPastReviewDateCount + data.actionsMissingLogline + data.actionsMissingUrl + data.actionsMissingOrganization
  const healthColor = healthIssues === 0 ? 'green' : healthIssues < 50 ? 'yellow' : 'red'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">WCID Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last data update: {data.lastUpdated ? formatDate(data.lastUpdated) : 'Unknown'}
            {' · '}
            Dashboard refreshed: {formatDate(data.fetchedAt)}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ===== OVERVIEW ===== */}
        <SectionHeader title="Overview" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card title="Total Actions">
            <BigNumber value={data.totalActions} />
          </Card>
          <Card title="Countries Served">
            <BigNumber value={data.totalCountries} />
          </Card>
          <Card title="US Actions">
            <BigNumber value={`${usPercent}%`} label={`${data.usVsNonUs.us.toLocaleString()} of ${data.totalActions.toLocaleString()}`} />
          </Card>
          <Card title="APL Coverage">
            <BigNumber value={`${aplPercent}%`} label="actions with positions" />
          </Card>
        </div>

        {/* ===== BE HEARD ===== */}
        <SectionHeader title="Be Heard Actions" description="Constituent contact actions by geographic level" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card title="Total Be Heard">
            <BigNumber value={data.beHeardByLevel.total} />
          </Card>
          <Card title="Federal">
            <BigNumber value={data.beHeardByLevel.federal} />
          </Card>
          <Card title="State">
            <BigNumber value={data.beHeardByLevel.state} />
          </Card>
          <Card title="Local">
            <BigNumber value={data.beHeardByLevel.local} />
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Be Heard by State">
            {data.beHeardByState.length > 0 ? (
              <DataTable 
                data={data.beHeardByState.slice(0, 15)} 
                columns={[
                  { key: 'state', label: 'State' },
                  { key: 'count', label: 'Actions' },
                ]} 
              />
            ) : (
              <div className="text-gray-400 text-sm">No state-level actions</div>
            )}
          </Card>
          <Card title="States with No Be Heard Actions">
            <p className="text-sm text-gray-500 mb-3">
              {50 - data.beHeardByState.length} states without coverage
            </p>
            <div className="text-xs text-gray-400">
              (Compare against full state list to identify gaps)
            </div>
          </Card>
        </div>

        {/* ===== CONTENT DISTRIBUTION ===== */}
        <SectionHeader title="Content Distribution" description="How actions are categorized" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          <Card title="Actions by Country">
            <DataTable 
              data={data.actionsByCountry.slice(0, 12)} 
              columns={[
                { key: 'country', label: 'Country' },
                { key: 'count', label: 'Actions' },
              ]} 
            />
          </Card>

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

          <Card title="Top Verb + Noun Combos">
            <DataTable 
              data={data.verbNounCombos.slice(0, 10)} 
              columns={[
                { key: 'combo', label: 'Combination' },
                { key: 'count', label: '#' },
              ]} 
            />
          </Card>

          <Card title="Top Organizations">
            {data.topOrganizations.filter((o: any) => o.count > 0).slice(0, 10).map((org: any) => (
              <ProgressBar 
                key={org.name} 
                value={org.count} 
                max={data.topOrganizations[0]?.count || 1} 
                label={org.name} 
              />
            ))}
          </Card>
        </div>

        {/* ===== CONTENT HEALTH ===== */}
        <SectionHeader title="Content Health" description="Issues requiring attention" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <Card title="Past Review Date">
            <BigNumber 
              value={data.actionsPastReviewDateCount} 
              color={data.actionsPastReviewDateCount === 0 ? 'green' : data.actionsPastReviewDateCount < 20 ? 'yellow' : 'red'} 
            />
          </Card>
          <Card title="Missing Logline">
            <BigNumber 
              value={data.actionsMissingLogline} 
              color={data.actionsMissingLogline === 0 ? 'green' : 'yellow'} 
            />
          </Card>
          <Card title="Missing Description">
            <BigNumber 
              value={data.actionsMissingDescription} 
              color={data.actionsMissingDescription === 0 ? 'green' : 'yellow'} 
            />
          </Card>
          <Card title="Missing URL">
            <BigNumber 
              value={data.actionsMissingUrl} 
              color={data.actionsMissingUrl === 0 ? 'green' : 'yellow'} 
            />
          </Card>
          <Card title="No Organization">
            <BigNumber 
              value={data.actionsMissingOrganization} 
              color={data.actionsMissingOrganization === 0 ? 'green' : 'gray'} 
            />
          </Card>
          <Card title="Stale (6+ months)">
            <BigNumber 
              value={data.actionsStale6Months} 
              color={data.actionsStale6Months === 0 ? 'green' : data.actionsStale6Months < 100 ? 'yellow' : 'red'} 
            />
          </Card>
        </div>

        {data.actionsPastReviewDate.length > 0 && (
          <Card title="Actions Past Review Date" className="mb-8">
            <DataTable 
              data={data.actionsPastReviewDate.slice(0, 15)} 
              columns={[
                { key: 'title', label: 'Action', format: (v) => v?.substring(0, 40) + (v?.length > 40 ? '...' : '') },
                { key: 'category', label: 'Category' },
                { key: 'review_date', label: 'Review Date', format: formatDate },
              ]} 
            />
          </Card>
        )}

        {/* ===== TAXONOMY HEALTH ===== */}
        <SectionHeader title="Taxonomy Health" description="Unused tags and categories" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title={`Nouns with Zero Actions (${data.nounsWithZeroActions.length})`}>
            {data.nounsWithZeroActions.length > 0 ? (
              <div className="text-sm text-gray-600 max-h-48 overflow-y-auto">
                {data.nounsWithZeroActions.slice(0, 20).map((noun: any) => (
                  <span key={noun.slug} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-2">
                    {noun.name}
                  </span>
                ))}
                {data.nounsWithZeroActions.length > 20 && (
                  <span className="text-gray-400">...and {data.nounsWithZeroActions.length - 20} more</span>
                )}
              </div>
            ) : (
              <div className="text-green-600">All nouns are in use ✓</div>
            )}
          </Card>
          <Card title={`Skills with Zero Actions (${data.skillsWithZeroActions.length})`}>
            {data.skillsWithZeroActions.length > 0 ? (
              <div className="text-sm text-gray-600 max-h-48 overflow-y-auto">
                {data.skillsWithZeroActions.slice(0, 20).map((skill: any, i: number) => (
                  <span key={i} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-2">
                    {skill.name}
                  </span>
                ))}
                {data.skillsWithZeroActions.length > 20 && (
                  <span className="text-gray-400">...and {data.skillsWithZeroActions.length - 20} more</span>
                )}
              </div>
            ) : (
              <div className="text-green-600">All skills are in use ✓</div>
            )}
          </Card>
        </div>

        {/* ===== RECENCY ===== */}
        <SectionHeader title="Recency" description="Content creation and update activity" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card title="Created Last 30 Days">
            <BigNumber value={data.actionsCreatedLast30Days} color={data.actionsCreatedLast30Days > 0 ? 'green' : 'gray'} />
          </Card>
          <Card title="Created Last 60 Days">
            <BigNumber value={data.actionsCreatedLast60Days} color={data.actionsCreatedLast60Days > 0 ? 'green' : 'gray'} />
          </Card>
          <Card title="Created Last 90 Days">
            <BigNumber value={data.actionsCreatedLast90Days} color={data.actionsCreatedLast90Days > 0 ? 'green' : 'gray'} />
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Recently Updated">
            <DataTable 
              data={data.recentlyUpdatedActions} 
              columns={[
                { key: 'title', label: 'Action', format: (v) => v?.substring(0, 35) + (v?.length > 35 ? '...' : '') },
                { key: '_updatedAt', label: 'Updated', format: formatTimeAgo },
              ]} 
            />
          </Card>
          <Card title="Recently Created">
            <DataTable 
              data={data.recentlyCreatedActions} 
              columns={[
                { key: 'title', label: 'Action', format: (v) => v?.substring(0, 35) + (v?.length > 35 ? '...' : '') },
                { key: '_createdAt', label: 'Created', format: formatTimeAgo },
              ]} 
            />
          </Card>
        </div>

        {/* ===== APL FRAMEWORK ===== */}
        <SectionHeader title="APL Framework Integration" description="Actually Pro Life position mapping" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card title="With Positions">
            <BigNumber value={data.aplCoverage.withPositions} color="green" />
          </Card>
          <Card title="Without Positions">
            <BigNumber value={data.aplCoverage.withoutPositions} color="gray" />
          </Card>
          <Card title="Total Actions">
            <BigNumber value={data.aplCoverage.total} />
          </Card>
        </div>
        
        <Card title="Positions with Most Actions" className="mb-8">
          {data.actionsByPosition.filter((p: any) => p.count > 0).length > 0 ? (
            <DataTable 
              data={data.actionsByPosition.filter((p: any) => p.count > 0).slice(0, 15)} 
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Position', format: (v) => v?.substring(0, 50) + (v?.length > 50 ? '...' : '') },
                { key: 'count', label: 'Actions' },
              ]} 
            />
          ) : (
            <div className="text-gray-400 text-sm">APL positions not yet imported</div>
          )}
        </Card>

      </main>

      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          WCID Internal Dashboard · Data refreshes hourly
        </div>
      </footer>
    </div>
  )
}
