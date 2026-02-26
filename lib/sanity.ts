import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'syt2s38k',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export const queries = {
  // ===== OVERVIEW =====
  totalActions: `count(*[_type == "action"])`,
  
  totalCountries: `
    count(array::unique(*[_type == "action" && defined(location.countries)].location.countries[]))
  `,
  
  usVsNonUs: `{
    "us": count(*[_type == "action" && "United States" in location.countries]),
    "nonUs": count(*[_type == "action" && defined(location.countries) && length(location.countries) > 0 && !("United States" in location.countries)]),
    "noCountry": count(*[_type == "action" && (!defined(location.countries) || length(location.countries) == 0)])
  }`,
  
  aplCoverage: `{
    "withPositions": count(*[_type == "action" && count(position_ids) > 0]),
    "withoutPositions": count(*[_type == "action" && (count(position_ids) == 0 || !defined(position_ids))]),
    "total": count(*[_type == "action"])
  }`,

  // ===== BE HEARD =====
  beHeardByLevel: `{
    "federal": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id) && "United States" in location.countries && (!defined(location.states) || length(location.states) == 0) && (!defined(location.cities) || length(location.cities) == 0)]),
    "state": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id) && defined(location.states) && length(location.states) > 0 && (!defined(location.cities) || length(location.cities) == 0) && (!defined(location.zipcodes) || length(location.zipcodes) == 0)]),
    "local": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id) && ((defined(location.cities) && length(location.cities) > 0) || (defined(location.zipcodes) && length(location.zipcodes) > 0))]),
    "total": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id)])
  }`,
  
  beHeardByState: `
    *[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id) && defined(location.states) && length(location.states) > 0] {
      "states": location.states
    }
  `,

  // ===== CONTENT DISTRIBUTION =====
  actionsByCategory: `
    *[_type == "category"] {
      "name": title,
      "slug": slug.current,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc)
  `,
  
  actionsByNoun: `
    *[_type == "noun"] {
      "name": title,
      "slug": slug.current,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...25]
  `,
  
  actionsByCountry: `
    *[_type == "action" && defined(location.countries) && length(location.countries) > 0] {
      "countries": location.countries
    }
  `,
  
  actionsBySkill: `
    *[_type == "skill"] {
      "name": title,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...15]
  `,
  
  verbNounCombos: `
    *[_type == "action" && count(categories) > 0 && count(nouns) > 0] {
      "category": categories[0]->title,
      "noun": nouns[0]->title
    }
  `,

  // ===== CONTENT HEALTH =====
  actionsPastReviewDate: `
    *[_type == "action" && defined(review_date) && review_date < now()] | order(review_date asc) [0...20] {
      title,
      review_date,
      "category": categories[0]->title
    }
  `,
  
  actionsPastReviewDateCount: `count(*[_type == "action" && defined(review_date) && review_date < now()])`,
  
  actionsMissingLogline: `count(*[_type == "action" && (!defined(logline) || logline == "")])`,
  
  actionsMissingDescription: `count(*[_type == "action" && (!defined(description) || length(description) == 0)])`,
  
  actionsMissingUrl: `count(*[_type == "action" && (!defined(url) || url == "")])`,
  
  actionsMissingOrganization: `count(*[_type == "action" && !defined(organization)])`,
  
  actionsStale6Months: `count(*[_type == "action" && _updatedAt < dateTime(now()) - 60*60*24*180])`,

  // ===== TAXONOMY HEALTH =====
  nounsWithZeroActions: `
    *[_type == "noun" && count(*[_type == "action" && references(^._id)]) == 0] {
      "name": title,
      "slug": slug.current
    } | order(name asc)
  `,
  
  skillsWithZeroActions: `
    *[_type == "skill" && count(*[_type == "action" && references(^._id)]) == 0] {
      "name": title
    } | order(name asc)
  `,

  // ===== ORGANIZATION INSIGHTS =====
  topOrganizations: `
    *[_type == "organization"] {
      "name": name,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...15]
  `,

  // ===== RECENCY =====
  actionsCreatedLast30Days: `count(*[_type == "action" && _createdAt > dateTime(now()) - 60*60*24*30])`,
  actionsCreatedLast60Days: `count(*[_type == "action" && _createdAt > dateTime(now()) - 60*60*24*60])`,
  actionsCreatedLast90Days: `count(*[_type == "action" && _createdAt > dateTime(now()) - 60*60*24*90])`,
  
  recentlyUpdatedActions: `
    *[_type == "action"] | order(_updatedAt desc) [0...10] {
      title,
      _updatedAt,
      "category": categories[0]->title
    }
  `,
  
  recentlyCreatedActions: `
    *[_type == "action"] | order(_createdAt desc) [0...10] {
      title,
      _createdAt,
      "category": categories[0]->title
    }
  `,

  // ===== APL =====
  actionsByPosition: `
    *[_type == "position"] {
      "id": position_id,
      "name": name,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...20]
  `,
  
  lastUpdated: `*[_type == "action"] | order(_updatedAt desc) [0] { _updatedAt }`,
}

export async function fetchDashboardData() {
  const [
    totalActions,
    totalCountries,
    usVsNonUs,
    aplCoverage,
    beHeardByLevel,
    beHeardByStateRaw,
    actionsByCategory,
    actionsByNoun,
    actionsByCountryRaw,
    actionsBySkill,
    verbNounCombosRaw,
    actionsPastReviewDate,
    actionsPastReviewDateCount,
    actionsMissingLogline,
    actionsMissingDescription,
    actionsMissingUrl,
    actionsMissingOrganization,
    actionsStale6Months,
    nounsWithZeroActions,
    skillsWithZeroActions,
    topOrganizations,
    actionsCreatedLast30Days,
    actionsCreatedLast60Days,
    actionsCreatedLast90Days,
    recentlyUpdatedActions,
    recentlyCreatedActions,
    actionsByPosition,
    lastUpdated,
  ] = await Promise.all([
    sanityClient.fetch(queries.totalActions),
    sanityClient.fetch(queries.totalCountries),
    sanityClient.fetch(queries.usVsNonUs),
    sanityClient.fetch(queries.aplCoverage),
    sanityClient.fetch(queries.beHeardByLevel),
    sanityClient.fetch(queries.beHeardByState),
    sanityClient.fetch(queries.actionsByCategory),
    sanityClient.fetch(queries.actionsByNoun),
    sanityClient.fetch(queries.actionsByCountry),
    sanityClient.fetch(queries.actionsBySkill),
    sanityClient.fetch(queries.verbNounCombos),
    sanityClient.fetch(queries.actionsPastReviewDate),
    sanityClient.fetch(queries.actionsPastReviewDateCount),
    sanityClient.fetch(queries.actionsMissingLogline),
    sanityClient.fetch(queries.actionsMissingDescription),
    sanityClient.fetch(queries.actionsMissingUrl),
    sanityClient.fetch(queries.actionsMissingOrganization),
    sanityClient.fetch(queries.actionsStale6Months),
    sanityClient.fetch(queries.nounsWithZeroActions),
    sanityClient.fetch(queries.skillsWithZeroActions),
    sanityClient.fetch(queries.topOrganizations),
    sanityClient.fetch(queries.actionsCreatedLast30Days),
    sanityClient.fetch(queries.actionsCreatedLast60Days),
    sanityClient.fetch(queries.actionsCreatedLast90Days),
    sanityClient.fetch(queries.recentlyUpdatedActions),
    sanityClient.fetch(queries.recentlyCreatedActions),
    sanityClient.fetch(queries.actionsByPosition),
    sanityClient.fetch(queries.lastUpdated),
  ])

  // Process country counts
  const countryCounts: Record<string, number> = {}
  actionsByCountryRaw.forEach((a: { countries: string[] }) => {
    if (a.countries && Array.isArray(a.countries)) {
      a.countries.forEach((country: string) => {
        countryCounts[country] = (countryCounts[country] || 0) + 1
      })
    }
  })
  const actionsByCountry = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)

  // Process Be Heard by state
  const stateCounts: Record<string, number> = {}
  beHeardByStateRaw.forEach((a: { states: string[] }) => {
    if (a.states && Array.isArray(a.states)) {
      a.states.forEach((state: string) => {
        stateCounts[state] = (stateCounts[state] || 0) + 1
      })
    }
  })
  const beHeardByState = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)

  // Process verb+noun combinations
  const comboCounts: Record<string, number> = {}
  verbNounCombosRaw.forEach((a: { category: string; noun: string }) => {
    if (a.category && a.noun) {
      const key = `${a.category} + ${a.noun}`
      comboCounts[key] = (comboCounts[key] || 0) + 1
    }
  })
  const verbNounCombos = Object.entries(comboCounts)
    .map(([combo, count]) => ({ combo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  return {
    // Overview
    totalActions,
    totalCountries,
    usVsNonUs,
    aplCoverage,
    // Be Heard
    beHeardByLevel,
    beHeardByState,
    // Content Distribution
    actionsByCategory,
    actionsByNoun,
    actionsByCountry,
    actionsBySkill,
    verbNounCombos,
    // Content Health
    actionsPastReviewDate,
    actionsPastReviewDateCount,
    actionsMissingLogline,
    actionsMissingDescription,
    actionsMissingUrl,
    actionsMissingOrganization,
    actionsStale6Months,
    // Taxonomy Health
    nounsWithZeroActions,
    skillsWithZeroActions,
    // Organization Insights
    topOrganizations,
    // Recency
    actionsCreatedLast30Days,
    actionsCreatedLast60Days,
    actionsCreatedLast90Days,
    recentlyUpdatedActions,
    recentlyCreatedActions,
    // APL
    actionsByPosition,
    // Meta
    lastUpdated: lastUpdated?._updatedAt || null,
    fetchedAt: new Date().toISOString(),
  }
}
