import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'syt2s38k',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false, // We want fresh data for the dashboard
})

// GROQ queries for dashboard metrics
export const queries = {
  // Total actions count
  totalActions: `count(*[_type == "action"])`,
  
  // Actions by category (verb)
  actionsByCategory: `
    *[_type == "category"] {
      "name": title,
      "slug": slug.current,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc)
  `,
  
  // Actions by noun
  actionsByNoun: `
    *[_type == "noun"] {
      "name": title,
      "slug": slug.current,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...25]
  `,
  
  // Actions by country - location.countries is an array
  actionsByCountry: `
    *[_type == "action" && defined(location.countries) && length(location.countries) > 0] {
      "countries": location.countries
    }
  `,
  
  // Total countries - count unique values across all location.countries arrays
  totalCountries: `
    count(array::unique(*[_type == "action" && defined(location.countries)].location.countries[]))
  `,
  
  // US vs non-US actions
  usVsNonUs: `{
    "us": count(*[_type == "action" && "US" in location.countries]),
    "nonUs": count(*[_type == "action" && defined(location.countries) && length(location.countries) > 0 && !("US" in location.countries)]),
    "noCountry": count(*[_type == "action" && (!defined(location.countries) || length(location.countries) == 0)])
  }`,
  
  // Most common skills
  actionsBySkill: `
    *[_type == "skill"] {
      "name": title,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...15]
  `,
  
  // Positions with most actions (APL integration)
  actionsByPosition: `
    *[_type == "position"] {
      "id": position_id,
      "name": name,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...20]
  `,
  
  // Principles with most actions
  actionsByPrinciple: `
    *[_type == "principle"] {
      "id": principle_id,
      "name": title,
      "type": principle_type,
      "count": count(*[_type == "position" && references(^._id)] | {
        "actionCount": count(*[_type == "action" && references(^._id)])
      }.actionCount)
    } | order(count desc)
  `,
  
  // Be Heard actions by level
  // Federal = US in countries, no states specified
  // State = has states specified
  // Local = has cities or zipcodes specified
  beHeardByLevel: `{
    "federal": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id) && "US" in location.countries && (!defined(location.states) || length(location.states) == 0)]),
    "state": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id) && defined(location.states) && length(location.states) > 0 && (!defined(location.cities) || length(location.cities) == 0) && (!defined(location.zipcodes) || length(location.zipcodes) == 0)]),
    "local": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id) && (length(location.cities) > 0 || length(location.zipcodes) > 0)]),
    "total": count(*[_type == "action" && references(*[_type == "category" && slug.current == "be-heard"]._id)])
  }`,
  
  // Most common verb + noun combinations
  verbNounCombos: `
    *[_type == "action" && count(categories) > 0 && count(nouns) > 0] {
      "category": categories[0]->title,
      "noun": nouns[0]->title
    }
  `,
  
  // Actions with positions assigned (APL coverage)
  aplCoverage: `{
    "withPositions": count(*[_type == "action" && count(position_ids) > 0]),
    "withoutPositions": count(*[_type == "action" && (count(position_ids) == 0 || !defined(position_ids))]),
    "total": count(*[_type == "action"])
  }`,
  
  // Last updated timestamp
  lastUpdated: `*[_type == "action"] | order(_updatedAt desc) [0] { _updatedAt }`,
}

export async function fetchDashboardData() {
  const [
    totalActions,
    actionsByCategory,
    actionsByNoun,
    actionsByCountryRaw,
    totalCountries,
    usVsNonUs,
    actionsBySkill,
    actionsByPosition,
    beHeardByLevel,
    verbNounCombosRaw,
    aplCoverage,
    lastUpdated,
  ] = await Promise.all([
    sanityClient.fetch(queries.totalActions),
    sanityClient.fetch(queries.actionsByCategory),
    sanityClient.fetch(queries.actionsByNoun),
    sanityClient.fetch(queries.actionsByCountry),
    sanityClient.fetch(queries.totalCountries),
    sanityClient.fetch(queries.usVsNonUs),
    sanityClient.fetch(queries.actionsBySkill),
    sanityClient.fetch(queries.actionsByPosition),
    sanityClient.fetch(queries.beHeardByLevel),
    sanityClient.fetch(queries.verbNounCombos),
    sanityClient.fetch(queries.aplCoverage),
    sanityClient.fetch(queries.lastUpdated),
  ])

  // Process country counts - now handling arrays of countries per action
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
    totalActions,
    actionsByCategory,
    actionsByNoun,
    actionsByCountry,
    totalCountries,
    usVsNonUs,
    actionsBySkill,
    actionsByPosition,
    beHeardByLevel,
    verbNounCombos,
    aplCoverage,
    lastUpdated: lastUpdated?._updatedAt || null,
    fetchedAt: new Date().toISOString(),
  }
}
