import { db } from '../db';
import { 
  countries, 
  cities, 
  companies, 
  jobCategories, 
  jobs, 
  cvProfiles, 
  salaryInsights 
} from '@shared/schema';

// Global countries data
export const globalCountries = [
  { name: 'United States', code: 'US', dialCode: '+1', currency: 'USD', timezone: 'UTC-5' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', currency: 'GBP', timezone: 'UTC+0' },
  { name: 'Canada', code: 'CA', dialCode: '+1', currency: 'CAD', timezone: 'UTC-5' },
  { name: 'Australia', code: 'AU', dialCode: '+61', currency: 'AUD', timezone: 'UTC+10' },
  { name: 'Germany', code: 'DE', dialCode: '+49', currency: 'EUR', timezone: 'UTC+1' },
  { name: 'France', code: 'FR', dialCode: '+33', currency: 'EUR', timezone: 'UTC+1' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', currency: 'EUR', timezone: 'UTC+1' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', currency: 'CHF', timezone: 'UTC+1' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', currency: 'SGD', timezone: 'UTC+8' },
  { name: 'Japan', code: 'JP', dialCode: '+81', currency: 'JPY', timezone: 'UTC+9' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', currency: 'KRW', timezone: 'UTC+9' },
  { name: 'India', code: 'IN', dialCode: '+91', currency: 'INR', timezone: 'UTC+5:30' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', currency: 'BRL', timezone: 'UTC-3' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', currency: 'ZAR', timezone: 'UTC+2' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', currency: 'NGN', timezone: 'UTC+1' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', currency: 'KES', timezone: 'UTC+3' },
  { name: 'Uganda', code: 'UG', dialCode: '+256', currency: 'UGX', timezone: 'UTC+3' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', currency: 'GHS', timezone: 'UTC+0' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', currency: 'EGP', timezone: 'UTC+2' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', currency: 'MAD', timezone: 'UTC+1' },
  { name: 'UAE', code: 'AE', dialCode: '+971', currency: 'AED', timezone: 'UTC+4' },
  { name: 'Israel', code: 'IL', dialCode: '+972', currency: 'ILS', timezone: 'UTC+2' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', currency: 'TRY', timezone: 'UTC+3' },
  { name: 'Russia', code: 'RU', dialCode: '+7', currency: 'RUB', timezone: 'UTC+3' },
  { name: 'China', code: 'CN', dialCode: '+86', currency: 'CNY', timezone: 'UTC+8' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', currency: 'MXN', timezone: 'UTC-6' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', currency: 'ARS', timezone: 'UTC-3' },
  { name: 'Chile', code: 'CL', dialCode: '+56', currency: 'CLP', timezone: 'UTC-3' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', currency: 'COP', timezone: 'UTC-5' },
  { name: 'Peru', code: 'PE', dialCode: '+51', currency: 'PEN', timezone: 'UTC-5' }
];

// Global cities data with major tech hubs and business centers
export const globalCities = [
  // United States
  { name: 'New York', country: 'US', latitude: 40.7128, longitude: -74.0060, isCapital: false, population: 8336817 },
  { name: 'San Francisco', country: 'US', latitude: 37.7749, longitude: -122.4194, isCapital: false, population: 881549 },
  { name: 'Los Angeles', country: 'US', latitude: 34.0522, longitude: -118.2437, isCapital: false, population: 3979576 },
  { name: 'Seattle', country: 'US', latitude: 47.6062, longitude: -122.3321, isCapital: false, population: 753675 },
  { name: 'Austin', country: 'US', latitude: 30.2672, longitude: -97.7431, isCapital: false, population: 978908 },
  { name: 'Boston', country: 'US', latitude: 42.3601, longitude: -71.0589, isCapital: false, population: 692600 },
  { name: 'Chicago', country: 'US', latitude: 41.8781, longitude: -87.6298, isCapital: false, population: 2693976 },
  { name: 'Washington DC', country: 'US', latitude: 38.9072, longitude: -77.0369, isCapital: true, population: 705749 },
  
  // United Kingdom
  { name: 'London', country: 'GB', latitude: 51.5074, longitude: -0.1278, isCapital: true, population: 9540576 },
  { name: 'Manchester', country: 'GB', latitude: 53.4808, longitude: -2.2426, isCapital: false, population: 547858 },
  { name: 'Edinburgh', country: 'GB', latitude: 55.9533, longitude: -3.1883, isCapital: false, population: 518500 },
  { name: 'Birmingham', country: 'GB', latitude: 52.4862, longitude: -1.8904, isCapital: false, population: 1141816 },
  
  // Canada
  { name: 'Toronto', country: 'CA', latitude: 43.651070, longitude: -79.347015, isCapital: false, population: 2930000 },
  { name: 'Vancouver', country: 'CA', latitude: 49.2827, longitude: -123.1207, isCapital: false, population: 675218 },
  { name: 'Montreal', country: 'CA', latitude: 45.5017, longitude: -73.5673, isCapital: false, population: 1780000 },
  { name: 'Ottawa', country: 'CA', latitude: 45.4215, longitude: -75.6972, isCapital: true, population: 1017449 },
  
  // Australia
  { name: 'Sydney', country: 'AU', latitude: -33.8688, longitude: 151.2093, isCapital: false, population: 5312163 },
  { name: 'Melbourne', country: 'AU', latitude: -37.8136, longitude: 144.9631, isCapital: false, population: 5078193 },
  { name: 'Brisbane', country: 'AU', latitude: -27.4698, longitude: 153.0251, isCapital: false, population: 2560720 },
  { name: 'Perth', country: 'AU', latitude: -31.9505, longitude: 115.8605, isCapital: false, population: 2125114 },
  
  // Germany
  { name: 'Berlin', country: 'DE', latitude: 52.5200, longitude: 13.4050, isCapital: true, population: 3669491 },
  { name: 'Munich', country: 'DE', latitude: 48.1351, longitude: 11.5820, isCapital: false, population: 1488202 },
  { name: 'Frankfurt', country: 'DE', latitude: 50.1109, longitude: 8.6821, isCapital: false, population: 753056 },
  { name: 'Hamburg', country: 'DE', latitude: 53.5511, longitude: 9.9937, isCapital: false, population: 1899160 },
  
  // Singapore
  { name: 'Singapore', country: 'SG', latitude: 1.3521, longitude: 103.8198, isCapital: true, population: 5685807 },
  
  // Japan
  { name: 'Tokyo', country: 'JP', latitude: 35.6762, longitude: 139.6503, isCapital: true, population: 14094034 },
  { name: 'Osaka', country: 'JP', latitude: 34.6937, longitude: 135.5023, isCapital: false, population: 2691185 },
  { name: 'Kyoto', country: 'JP', latitude: 35.0116, longitude: 135.7681, isCapital: false, population: 1475183 },
  
  // India
  { name: 'Bangalore', country: 'IN', latitude: 12.9716, longitude: 77.5946, isCapital: false, population: 12326532 },
  { name: 'Mumbai', country: 'IN', latitude: 19.0760, longitude: 72.8777, isCapital: false, population: 20411274 },
  { name: 'Delhi', country: 'IN', latitude: 28.7041, longitude: 77.1025, isCapital: true, population: 30290936 },
  { name: 'Hyderabad', country: 'IN', latitude: 17.3850, longitude: 78.4867, isCapital: false, population: 10004000 },
  { name: 'Chennai', country: 'IN', latitude: 13.0827, longitude: 80.2707, isCapital: false, population: 7088000 },
  { name: 'Pune', country: 'IN', latitude: 18.5204, longitude: 73.8567, isCapital: false, population: 3124458 },
  
  // Uganda (Local focus)
  { name: 'Kampala', country: 'UG', latitude: 0.3476, longitude: 32.5825, isCapital: true, population: 1680000 },
  { name: 'Entebbe', country: 'UG', latitude: 0.0647, longitude: 32.4754, isCapital: false, population: 69958 },
  { name: 'Jinja', country: 'UG', latitude: 0.4236, longitude: 33.2042, isCapital: false, population: 89700 },
  { name: 'Mbarara', country: 'UG', latitude: -0.6107, longitude: 30.6486, isCapital: false, population: 97500 },
  { name: 'Gulu', country: 'UG', latitude: 2.7796, longitude: 32.2991, isCapital: false, population: 152276 },
  { name: 'Lira', country: 'UG', latitude: 2.2491, longitude: 32.9016, isCapital: false, population: 119323 },
  { name: 'Arua', country: 'UG', latitude: 3.0197, longitude: 30.9107, isCapital: false, population: 61032 },
  { name: 'Masaka', country: 'UG', latitude: -0.3336, longitude: 31.7336, isCapital: false, population: 103829 },
  { name: 'Soroti', country: 'UG', latitude: 1.7144, longitude: 33.6111, isCapital: false, population: 66000 },
  
  // Other major global cities
  { name: 'Dubai', country: 'AE', latitude: 25.2048, longitude: 55.2708, isCapital: false, population: 3331420 },
  { name: 'Tel Aviv', country: 'IL', latitude: 32.0853, longitude: 34.7818, isCapital: false, population: 460613 },
  { name: 'Amsterdam', country: 'NL', latitude: 52.3702, longitude: 4.8952, isCapital: true, population: 921402 },
  { name: 'Zurich', country: 'CH', latitude: 47.3769, longitude: 8.5417, isCapital: false, population: 415215 },
  { name: 'Stockholm', country: 'SE', latitude: 59.3293, longitude: 18.0686, isCapital: true, population: 975551 },
  { name: 'Copenhagen', country: 'DK', latitude: 55.6761, longitude: 12.5683, isCapital: true, population: 660193 },
  { name: 'Helsinki', country: 'FI', latitude: 60.1695, longitude: 24.9354, isCapital: true, population: 658457 },
  { name: 'Oslo', country: 'NO', latitude: 59.9139, longitude: 10.7522, isCapital: true, population: 697010 },
  { name: 'Vienna', country: 'AT', latitude: 48.2082, longitude: 16.3738, isCapital: true, population: 1975000 },
  { name: 'Brussels', country: 'BE', latitude: 50.8503, longitude: 4.3517, isCapital: true, population: 1208542 },
  { name: 'Rome', country: 'IT', latitude: 41.9028, longitude: 12.4964, isCapital: true, population: 2873000 },
  { name: 'Madrid', country: 'ES', latitude: 40.4168, longitude: -3.7038, isCapital: true, population: 3223000 },
  { name: 'Barcelona', country: 'ES', latitude: 41.3851, longitude: 2.1734, isCapital: false, population: 1620343 },
  { name: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522, isCapital: true, population: 2175000 },
  { name: 'Lyon', country: 'FR', latitude: 45.7640, longitude: 4.8357, isCapital: false, population: 518635 },
  { name: 'Lisbon', country: 'PT', latitude: 38.7223, longitude: -9.1393, isCapital: true, population: 505526 },
  { name: 'Warsaw', country: 'PL', latitude: 52.2297, longitude: 21.0122, isCapital: true, population: 1790658 },
  { name: 'Prague', country: 'CZ', latitude: 50.0755, longitude: 14.4378, isCapital: true, population: 1335000 },
  { name: 'Budapest', country: 'HU', latitude: 47.4979, longitude: 19.0402, isCapital: true, population: 1706000 },
  { name: 'Bucharest', country: 'RO', latitude: 44.4268, longitude: 26.1025, isCapital: true, population: 1883425 },
  { name: 'Sofia', country: 'BG', latitude: 42.6977, longitude: 23.3219, isCapital: true, population: 1400384 },
  { name: 'Athens', country: 'GR', latitude: 37.9838, longitude: 23.7275, isCapital: true, population: 664046 },
  { name: 'Istanbul', country: 'TR', latitude: 41.0082, longitude: 28.9784, isCapital: false, population: 15519267 },
  { name: 'Ankara', country: 'TR', latitude: 39.9334, longitude: 32.8597, isCapital: true, population: 5663322 },
  { name: 'Cairo', country: 'EG', latitude: 30.0444, longitude: 31.2357, isCapital: true, population: 10230350 },
  { name: 'Casablanca', country: 'MA', latitude: 33.5731, longitude: -7.5898, isCapital: false, population: 3359818 },
  { name: 'Lagos', country: 'NG', latitude: 6.5244, longitude: 3.3792, isCapital: false, population: 14862000 },
  { name: 'Abuja', country: 'NG', latitude: 9.0765, longitude: 7.3986, isCapital: true, population: 3278000 },
  { name: 'Nairobi', country: 'KE', latitude: -1.2864, longitude: 36.8172, isCapital: true, population: 4397073 },
  { name: 'Mombasa', country: 'KE', latitude: -4.0435, longitude: 39.6682, isCapital: false, population: 1208333 },
  { name: 'Accra', country: 'GH', latitude: 5.6037, longitude: -0.1870, isCapital: true, population: 2291352 },
  { name: 'Cape Town', country: 'ZA', latitude: -33.9249, longitude: 18.4241, isCapital: false, population: 4618000 },
  { name: 'Johannesburg', country: 'ZA', latitude: -26.2041, longitude: 28.0473, isCapital: false, population: 4803262 },
  { name: 'São Paulo', country: 'BR', latitude: -23.5505, longitude: -46.6333, isCapital: false, population: 12325232 },
  { name: 'Rio de Janeiro', country: 'BR', latitude: -22.9068, longitude: -43.1729, isCapital: false, population: 6748000 },
  { name: 'Buenos Aires', country: 'AR', latitude: -34.6037, longitude: -58.3816, isCapital: true, population: 3075646 },
  { name: 'Santiago', country: 'CL', latitude: -33.4489, longitude: -70.6693, isCapital: true, population: 6257516 },
  { name: 'Bogotá', country: 'CO', latitude: 4.7110, longitude: -74.0721, isCapital: true, population: 7412566 },
  { name: 'Lima', country: 'PE', latitude: -12.0464, longitude: -77.0428, isCapital: true, population: 10092000 },
  { name: 'Mexico City', country: 'MX', latitude: 19.4326, longitude: -99.1332, isCapital: true, population: 9209944 },
  { name: 'Guadalajara', country: 'MX', latitude: 20.6597, longitude: -103.3496, isCapital: false, population: 1460148 },
  { name: 'Moscow', country: 'RU', latitude: 55.7558, longitude: 37.6176, isCapital: true, population: 12506468 },
  { name: 'St. Petersburg', country: 'RU', latitude: 59.9311, longitude: 30.3609, isCapital: false, population: 5383890 },
  { name: 'Beijing', country: 'CN', latitude: 39.9042, longitude: 116.4074, isCapital: true, population: 21540000 },
  { name: 'Shanghai', country: 'CN', latitude: 31.2304, longitude: 121.4737, isCapital: false, population: 24870895 },
  { name: 'Shenzhen', country: 'CN', latitude: 22.5431, longitude: 114.0579, isCapital: false, population: 17560061 },
  { name: 'Guangzhou', country: 'CN', latitude: 23.1291, longitude: 113.2644, isCapital: false, population: 18676605 },
  { name: 'Seoul', country: 'KR', latitude: 37.5665, longitude: 126.9780, isCapital: true, population: 9720846 },
  { name: 'Busan', country: 'KR', latitude: 35.1796, longitude: 129.0756, isCapital: false, population: 3413841 }
];

// Job categories
export const jobCategoriesData = [
  { name: 'Technology', slug: 'technology', icon: '💻', color: '#3B82F6' },
  { name: 'Finance', slug: 'finance', icon: '💰', color: '#10B981' },
  { name: 'Healthcare', slug: 'healthcare', icon: '🏥', color: '#EF4444' },
  { name: 'Education', slug: 'education', icon: '📚', color: '#8B5CF6' },
  { name: 'Marketing', slug: 'marketing', icon: '📈', color: '#F59E0B' },
  { name: 'Sales', slug: 'sales', icon: '🎯', color: '#EC4899' },
  { name: 'Human Resources', slug: 'human-resources', icon: '👥', color: '#6366F1' },
  { name: 'Operations', slug: 'operations', icon: '⚙️', color: '#84CC16' },
  { name: 'Legal', slug: 'legal', icon: '⚖️', color: '#64748B' },
  { name: 'Design', slug: 'design', icon: '🎨', color: '#F97316' },
  { name: 'Customer Service', slug: 'customer-service', icon: '🎧', color: '#06B6D4' },
  { name: 'Engineering', slug: 'engineering', icon: '🔧', color: '#DC2626' },
  { name: 'Research', slug: 'research', icon: '🔬', color: '#7C3AED' },
  { name: 'Construction', slug: 'construction', icon: '🏗️', color: '#A3A3A3' },
  { name: 'Transportation', slug: 'transportation', icon: '🚚', color: '#059669' },
  { name: 'Agriculture', slug: 'agriculture', icon: '🌾', color: '#65A30D' },
  { name: 'Energy', slug: 'energy', icon: '⚡', color: '#FBBF24' },
  { name: 'Media', slug: 'media', icon: '📺', color: '#BE185D' },
  { name: 'Retail', slug: 'retail', icon: '🛍️', color: '#0891B2' },
  { name: 'Manufacturing', slug: 'manufacturing', icon: '🏭', color: '#4B5563' }
];

export async function seedJobsPlatformData() {
  try {
    console.log('🌱 Seeding jobs platform data...');
    
    // 1. Seed Countries
    console.log('📍 Seeding countries...');
    const countryResults = await Promise.all(
      globalCountries.map(async (country) => {
        const result = await db.insert(countries).values(country).onConflictDoNothing().returning();
        return result[0];
      })
    );
    
    // Create country lookup map
    const countryMap = new Map();
    for (const country of countryResults.filter(Boolean)) {
      countryMap.set(country.code, country.id);
    }
    
    // 2. Seed Cities
    console.log('🏙️ Seeding cities...');
    const cityResults = await Promise.all(
      globalCities.map(async (city) => {
        const countryId = countryMap.get(city.country);
        if (!countryId) return null;
        
        const result = await db.insert(cities).values({
          name: city.name,
          countryId: countryId,
          latitude: city.latitude.toString(),
          longitude: city.longitude.toString(),
          isCapital: city.isCapital,
          population: city.population
        }).onConflictDoNothing().returning();
        
        return result[0];
      })
    );
    
    // 3. Seed Job Categories
    console.log('📂 Seeding job categories...');
    const categoryResults = await Promise.all(
      jobCategoriesData.map(async (category, index) => {
        const result = await db.insert(jobCategories).values({
          ...category,
          sortOrder: index + 1
        }).onConflictDoNothing().returning();
        
        return result[0];
      })
    );
    
    console.log('✅ Jobs platform data seeded successfully!');
    console.log(`📊 Summary:
      - Countries: ${countryResults.filter(Boolean).length}
      - Cities: ${cityResults.filter(Boolean).length}
      - Job Categories: ${categoryResults.filter(Boolean).length}
    `);
    
    return {
      countries: countryResults.filter(Boolean),
      cities: cityResults.filter(Boolean),
      categories: categoryResults.filter(Boolean)
    };
    
  } catch (error) {
    console.error('❌ Error seeding jobs platform data:', error);
    throw error;
  }
}

// Function to create sample companies and jobs
export async function createSampleJobsData() {
  try {
    console.log('💼 Creating sample companies and jobs...');
    
    // Get some countries and cities
    const existingCountries = await db.select().from(countries).limit(5);
    const existingCities = await db.select().from(cities).limit(10);
    const existingCategories = await db.select().from(jobCategories).limit(5);
    
    if (existingCountries.length === 0 || existingCities.length === 0 || existingCategories.length === 0) {
      console.log('⚠️ Please seed base data first (countries, cities, categories)');
      return;
    }
    
    // Sample companies
    const sampleCompanies = [
      {
        name: 'Tech Solutions Uganda',
        slug: 'tech-solutions-uganda',
        description: 'Leading technology company in East Africa',
        industry: 'Technology',
        size: 'medium',
        countryId: existingCountries.find(c => c.code === 'UG')?.id || existingCountries[0].id,
        cityId: existingCities.find(c => c.name === 'Kampala')?.id || existingCities[0].id,
        website: 'https://techsolutions.ug',
        contactEmail: 'careers@techsolutions.ug',
        isVerified: true,
        employeeCount: 150
      },
      {
        name: 'Global Innovations Ltd',
        slug: 'global-innovations-ltd',
        description: 'International consulting and development company',
        industry: 'Consulting',
        size: 'large',
        countryId: existingCountries.find(c => c.code === 'US')?.id || existingCountries[0].id,
        cityId: existingCities.find(c => c.name === 'New York')?.id || existingCities[0].id,
        website: 'https://globalinnovations.com',
        contactEmail: 'hr@globalinnovations.com',
        isVerified: true,
        employeeCount: 500
      },
      {
        name: 'East Africa Bank',
        slug: 'east-africa-bank',
        description: 'Premier financial institution in East Africa',
        industry: 'Finance',
        size: 'large',
        countryId: existingCountries.find(c => c.code === 'UG')?.id || existingCountries[0].id,
        cityId: existingCities.find(c => c.name === 'Kampala')?.id || existingCities[0].id,
        website: 'https://eastafricabank.com',
        contactEmail: 'careers@eastafricabank.com',
        isVerified: true,
        employeeCount: 1200
      }
    ];
    
    const companyResults = await Promise.all(
      sampleCompanies.map(async (company) => {
        const result = await db.insert(companies).values(company).onConflictDoNothing().returning();
        return result[0];
      })
    );
    
    // Sample jobs
    const sampleJobs = [
      {
        companyId: companyResults[0]?.id,
        categoryId: existingCategories.find(c => c.slug === 'technology')?.id || existingCategories[0].id,
        title: 'Senior Software Engineer',
        slug: 'senior-software-engineer-tech-solutions',
        description: 'We are looking for an experienced software engineer to join our growing team and help build innovative solutions.',
        requirements: ['Bachelor\'s degree in Computer Science', '3+ years experience', 'JavaScript, React, Node.js'],
        responsibilities: ['Design and develop software solutions', 'Collaborate with cross-functional teams', 'Mentor junior developers'],
        benefits: ['Health insurance', 'Flexible working hours', 'Professional development budget'],
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
        countryId: existingCountries.find(c => c.code === 'UG')?.id || existingCountries[0].id,
        cityId: existingCities.find(c => c.name === 'Kampala')?.id || existingCities[0].id,
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 3000000,
        salaryMax: 5000000,
        salaryCurrency: 'UGX',
        salaryPeriod: 'monthly',
        isRemote: false,
        deadline: new Date('2025-02-15'),
        isFeatured: true,
        metaDescription: 'Join our tech team as a Senior Software Engineer in Kampala, Uganda'
      },
      {
        companyId: companyResults[1]?.id,
        categoryId: existingCategories.find(c => c.slug === 'finance')?.id || existingCategories[0].id,
        title: 'Financial Analyst',
        slug: 'financial-analyst-global-innovations',
        description: 'Join our finance team to analyze financial data and provide insights for business decisions.',
        requirements: ['CPA or ACCA qualification', '2+ years experience', 'Excel proficiency', 'Financial modeling'],
        responsibilities: ['Analyze financial statements', 'Prepare budget reports', 'Support strategic planning'],
        benefits: ['Competitive salary', 'Performance bonuses', 'Career advancement'],
        skills: ['Excel', 'Financial Analysis', 'SAP', 'PowerBI', 'Python'],
        countryId: existingCountries.find(c => c.code === 'US')?.id || existingCountries[0].id,
        cityId: existingCities.find(c => c.name === 'New York')?.id || existingCities[0].id,
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 60000,
        salaryMax: 80000,
        salaryCurrency: 'USD',
        salaryPeriod: 'yearly',
        isRemote: true,
        remoteType: 'hybrid',
        deadline: new Date('2025-02-20'),
        isFeatured: false,
        metaDescription: 'Remote Financial Analyst position with Global Innovations Ltd'
      },
      {
        companyId: companyResults[2]?.id,
        categoryId: existingCategories.find(c => c.slug === 'finance')?.id || existingCategories[0].id,
        title: 'Branch Manager',
        slug: 'branch-manager-east-africa-bank',
        description: 'Lead our branch operations and drive business growth in the banking sector.',
        requirements: ['Bachelor\'s in Finance/Business', '5+ years banking experience', 'Leadership skills'],
        responsibilities: ['Manage branch operations', 'Drive sales targets', 'Lead team of 15+ staff'],
        benefits: ['Executive package', 'Company car', 'Medical insurance', 'Performance bonuses'],
        skills: ['Leadership', 'Banking', 'Sales', 'Customer Service', 'Team Management'],
        countryId: existingCountries.find(c => c.code === 'UG')?.id || existingCountries[0].id,
        cityId: existingCities.find(c => c.name === 'Kampala')?.id || existingCities[0].id,
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 4000000,
        salaryMax: 6000000,
        salaryCurrency: 'UGX',
        salaryPeriod: 'monthly',
        isRemote: false,
        deadline: new Date('2025-02-25'),
        isFeatured: true,
        isPremium: true,
        metaDescription: 'Branch Manager opportunity at East Africa Bank in Kampala'
      }
    ];
    
    const jobResults = await Promise.all(
      sampleJobs.map(async (job) => {
        if (!job.companyId) return null;
        const result = await db.insert(jobs).values(job).onConflictDoNothing().returning();
        return result[0];
      })
    );
    
    console.log('✅ Sample jobs data created successfully!');
    console.log(`📊 Summary:
      - Companies: ${companyResults.filter(Boolean).length}
      - Jobs: ${jobResults.filter(Boolean).length}
    `);
    
    return {
      companies: companyResults.filter(Boolean),
      jobs: jobResults.filter(Boolean)
    };
    
  } catch (error) {
    console.error('❌ Error creating sample jobs data:', error);
    throw error;
  }
}