import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'syt2s38k',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Country to continent mapping
export const countryToContinent: Record<string, string> = {
  // North America
  'United States': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'Guatemala': 'North America',
  'Honduras': 'North America',
  'El Salvador': 'North America',
  'Nicaragua': 'North America',
  'Costa Rica': 'North America',
  'Panama': 'North America',
  'Cuba': 'North America',
  'Jamaica': 'North America',
  'Haiti': 'North America',
  'Dominican Republic': 'North America',
  // South America
  'Brazil': 'South America',
  'Argentina': 'South America',
  'Peru': 'South America',
  'Colombia': 'South America',
  'Chile': 'South America',
  'Ecuador': 'South America',
  'Bolivia': 'South America',
  'Paraguay': 'South America',
  'Uruguay': 'South America',
  'Venezuela': 'South America',
  'Guyana': 'South America',
  'Suriname': 'South America',
  // Europe
  'United Kingdom': 'Europe',
  'Germany': 'Europe',
  'France': 'Europe',
  'Italy': 'Europe',
  'Spain': 'Europe',
  'Netherlands': 'Europe',
  'Belgium': 'Europe',
  'Sweden': 'Europe',
  'Norway': 'Europe',
  'Denmark': 'Europe',
  'Finland': 'Europe',
  'Ireland': 'Europe',
  'Portugal': 'Europe',
  'Greece': 'Europe',
  'Poland': 'Europe',
  'Austria': 'Europe',
  'Switzerland': 'Europe',
  'Czech Republic': 'Europe',
  'Romania': 'Europe',
  'Hungary': 'Europe',
  'Ukraine': 'Europe',
  'Russia': 'Europe',
  // Africa
  'Kenya': 'Africa',
  'Tanzania': 'Africa',
  'Nigeria': 'Africa',
  'Uganda': 'Africa',
  'South Africa': 'Africa',
  'Ethiopia': 'Africa',
  'Ghana': 'Africa',
  'Senegal': 'Africa',
  'Rwanda': 'Africa',
  'Malawi': 'Africa',
  'Zambia': 'Africa',
  'Zimbabwe': 'Africa',
  'Mozambique': 'Africa',
  'Madagascar': 'Africa',
  'Cameroon': 'Africa',
  'Ivory Coast': 'Africa',
  'Mali': 'Africa',
  'Burkina Faso': 'Africa',
  'Niger': 'Africa',
  'Democratic Republic of the Congo': 'Africa',
  'Egypt': 'Africa',
  'Morocco': 'Africa',
  'Algeria': 'Africa',
  'Tunisia': 'Africa',
  'Libya': 'Africa',
  'Sudan': 'Africa',
  'South Sudan': 'Africa',
  'Somalia': 'Africa',
  'Eritrea': 'Africa',
  'Djibouti': 'Africa',
  'Liberia': 'Africa',
  'Sierra Leone': 'Africa',
  'Guinea': 'Africa',
  'Togo': 'Africa',
  'Benin': 'Africa',
  'Central African Republic': 'Africa',
  'Chad': 'Africa',
  'Congo': 'Africa',
  'Gabon': 'Africa',
  'Equatorial Guinea': 'Africa',
  'Angola': 'Africa',
  'Namibia': 'Africa',
  'Botswana': 'Africa',
  'Lesotho': 'Africa',
  'Eswatini': 'Africa',
  'Mauritius': 'Africa',
  'Seychelles': 'Africa',
  'Comoros': 'Africa',
  'Cape Verde': 'Africa',
  'São Tomé and Príncipe': 'Africa',
  'Gambia': 'Africa',
  'Guinea-Bissau': 'Africa',
  'Mauritania': 'Africa',
  // Asia
  'India': 'Asia',
  'China': 'Asia',
  'Japan': 'Asia',
  'South Korea': 'Asia',
  'Indonesia': 'Asia',
  'Philippines': 'Asia',
  'Vietnam': 'Asia',
  'Thailand': 'Asia',
  'Malaysia': 'Asia',
  'Singapore': 'Asia',
  'Myanmar': 'Asia',
  'Cambodia': 'Asia',
  'Laos': 'Asia',
  'Bangladesh': 'Asia',
  'Pakistan': 'Asia',
  'Sri Lanka': 'Asia',
  'Nepal': 'Asia',
  'Afghanistan': 'Asia',
  'Iran': 'Asia',
  'Iraq': 'Asia',
  'Saudi Arabia': 'Asia',
  'United Arab Emirates': 'Asia',
  'Israel': 'Asia',
  'Jordan': 'Asia',
  'Lebanon': 'Asia',
  'Syria': 'Asia',
  'Turkey': 'Asia',
  'Yemen': 'Asia',
  'Oman': 'Asia',
  'Kuwait': 'Asia',
  'Qatar': 'Asia',
  'Bahrain': 'Asia',
  'Kazakhstan': 'Asia',
  'Uzbekistan': 'Asia',
  'Turkmenistan': 'Asia',
  'Tajikistan': 'Asia',
  'Kyrgyzstan': 'Asia',
  'Mongolia': 'Asia',
  'North Korea': 'Asia',
  'Taiwan': 'Asia',
  'Hong Kong': 'Asia',
  'Macau': 'Asia',
  'Brunei': 'Asia',
  'Timor-Leste': 'Asia',
  'Maldives': 'Asia',
  'Bhutan': 'Asia',
  // Oceania
  'Australia': 'Oceania',
  'New Zealand': 'Oceania',
  'Papua New Guinea': 'Oceania',
  'Fiji': 'Oceania',
  'Solomon Islands': 'Oceania',
  'Vanuatu': 'Oceania',
  'Samoa': 'Oceania',
  'Tonga': 'Oceania',
  'Micronesia': 'Oceania',
  'Kiribati': 'Oceania',
  'Marshall Islands': 'Oceania',
  'Palau': 'Oceania',
  'Nauru': 'Oceania',
  'Tuvalu': 'Oceania',
}

// All 50 US states
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

// Static queries (no date arithmetic)
export const queries = {
  totalActions: `count(*[_type == "action"])`,
  
  totalCountries: `
    count(array::unique(*[_type == "action" && defined(location.countries)].location.countries[]))
  `,
  
  usVsNonUs: `{
    "us": count(*[_type == "action" && "United States" in location.countries]),
    "nonUs": count(*[_type == "action" && defined(location.countries) && length(location.countries) > 0 && !("United States" in location.countries)]),
    "noCountry": count(*[_type == "action" && (!defined(location.countries) || length(location.countries) == 0)])
  }`,
  
  usVsNonUsExcludingBeHeard: `{
    "us": count(*[_type == "action" && "United States" in location.countries && !references(*[_type == "category" && slug.current == "be-heard"]._id)]),
    "nonUs": count(*[_type == "action" && defined(location.countries) && length(location.countries) > 0 && !("United States" in location.countries) && !references(*[_type == "category" && slug.current == "be-heard"]._id)]),
    "total": count(*[_type == "action" && !references(*[_type == "category" && slug.current == "be-heard"]._id)])
  }`,
  
  aplCoverage: `{
    "withPositions": count(*[_type == "action" && count(position_ids) > 0]),
    "withoutPositions": count(*[_type == "action" && (count(position_ids) == 0 || !defined(position_ids))]),
    "total": count(*[_type == "action"])
  }`,

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
  
  actionsStale6Months: `count(*[_type == "action" && _updatedAt < $sixMonthsAgo])`,

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

  // Fixed: use "title" instead of "name" for organization field
  topOrganizations: `
    *[_type == "organization"] {
      "name": title,
      "count": count(*[_type == "action" && references(^._id)])
    } | order(count desc) [0...15]
  `,

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
  // Calculate date thresholds in JavaScript (since GROQ date arithmetic is limited)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString()

  const [
    totalActions,
    totalCountries,
    usVsNonUs,
    usVsNonUsExcludingBeHeard,
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
    sanityClient.fetch(queries.usVsNonUsExcludingBeHeard),
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
    sanityClient.fetch(queries.actionsStale6Months, { sixMonthsAgo }),
    sanityClient.fetch(queries.nounsWithZeroActions),
    sanityClient.fetch(queries.skillsWithZeroActions),
    sanityClient.fetch(queries.topOrganizations),
    // Date-based queries with computed dates
    sanityClient.fetch(`count(*[_type == "action" && _createdAt > $date])`, { date: thirtyDaysAgo }),
    sanityClient.fetch(`count(*[_type == "action" && _createdAt > $date])`, { date: sixtyDaysAgo }),
    sanityClient.fetch(`count(*[_type == "action" && _createdAt > $date])`, { date: ninetyDaysAgo }),
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

  // Process continent counts
  const continentCounts: Record<string, number> = {}
  Object.entries(countryCounts).forEach(([country, count]) => {
    const continent = countryToContinent[country] || 'Other'
    continentCounts[continent] = (continentCounts[continent] || 0) + count
  })
  const actionsByContinent = Object.entries(continentCounts)
    .map(([continent, count]) => ({ continent, count }))
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

  // Find states without Be Heard actions
  const statesWithActions = new Set(Object.keys(stateCounts))
  const statesWithoutBeHeard = US_STATES.filter(state => !statesWithActions.has(state))

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
    totalCountries,
    usVsNonUs,
    usVsNonUsExcludingBeHeard,
    aplCoverage,
    beHeardByLevel,
    beHeardByState,
    statesWithoutBeHeard,
    actionsByCategory,
    actionsByNoun,
    actionsByCountry,
    actionsByContinent,
    actionsBySkill,
    verbNounCombos,
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
    lastUpdated: lastUpdated?._updatedAt || null,
    fetchedAt: new Date().toISOString(),
  }
}
