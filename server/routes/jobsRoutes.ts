import { Router } from 'express';
import { db } from '../db';
import { 
  jobs, 
  companies, 
  countries, 
  cities, 
  jobCategories, 
  cvProfiles, 
  jobApplications,
  jobSaves,
  jobViews,
  jobAlerts,
  jobRecommendations,
  companyFollows,
  jobFeedback,
  salaryInsights
} from '@shared/schema';
import { eq, and, desc, asc, count, avg, sql, ilike, inArray } from 'drizzle-orm';
import { seedJobsPlatformData, createSampleJobsData } from '../services/seedJobsData';

const router = Router();

// Initialize jobs platform data
router.post('/init', async (req, res) => {
  try {
    console.log('🚀 Initializing jobs platform...');
    
    // Seed base data
    const seedResult = await seedJobsPlatformData();
    
    // Create sample data
    const sampleResult = await createSampleJobsData();
    
    res.json({
      success: true,
      message: 'Jobs platform initialized successfully',
      data: {
        countries: seedResult.countries.length,
        cities: seedResult.cities.length,
        categories: seedResult.categories.length,
        companies: sampleResult.companies.length,
        jobs: sampleResult.jobs.length
      }
    });
  } catch (error) {
    console.error('❌ Error initializing jobs platform:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize jobs platform' });
  }
});

// Get all countries for global location support
router.get('/countries', async (req, res) => {
  try {
    const allCountries = await db.select().from(countries).where(eq(countries.isActive, true));
    res.json({ success: true, countries: allCountries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch countries' });
  }
});

// Get cities by country
router.get('/cities/:countryId', async (req, res) => {
  try {
    const { countryId } = req.params;
    const citiesInCountry = await db.select().from(cities)
      .where(and(eq(cities.countryId, countryId), eq(cities.isActive, true)))
      .orderBy(asc(cities.name));
    
    res.json({ success: true, cities: citiesInCountry });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cities' });
  }
});

// Get all job categories
router.get('/categories', async (req, res) => {
  try {
    const allCategories = await db.select().from(jobCategories)
      .where(eq(jobCategories.isActive, true))
      .orderBy(asc(jobCategories.sortOrder), asc(jobCategories.name));
    
    res.json({ success: true, categories: allCategories });
  } catch (error) {
    console.error('Error fetching job categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job categories' });
  }
});

// Get all companies with location data
router.get('/companies', async (req, res) => {
  try {
    const allCompanies = await db.select({
      id: companies.id,
      name: companies.name,
      logo: companies.logo,
      description: companies.description,
      industry: companies.industry,
      size: companies.size,
      website: companies.website,
      isVerified: companies.isVerified,
      countryName: countries.name,
      cityName: cities.name,
      employeeCount: companies.employeeCount,
      createdAt: companies.createdAt
    })
    .from(companies)
    .leftJoin(countries, eq(companies.countryId, countries.id))
    .leftJoin(cities, eq(companies.cityId, cities.id))
    .where(eq(companies.isActive, true))
    .orderBy(desc(companies.isVerified), asc(companies.name));
    
    res.json({ success: true, companies: allCompanies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch companies' });
  }
});

// Get jobs with advanced filtering and global location support
router.get('/jobs', async (req, res) => {
  try {
    const { 
      search, 
      countryId, 
      cityId, 
      categoryId, 
      jobType, 
      experienceLevel, 
      minSalary, 
      maxSalary, 
      currency,
      isRemote,
      featured,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = db.select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      requirements: jobs.requirements,
      benefits: jobs.benefits,
      skills: jobs.skills,
      jobType: jobs.jobType,
      experienceLevel: jobs.experienceLevel,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      isRemote: jobs.isRemote,
      remoteType: jobs.remoteType,
      deadline: jobs.deadline,
      isFeatured: jobs.isFeatured,
      viewCount: jobs.viewCount,
      applicationCount: jobs.applicationCount,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
      companyName: companies.name,
      companyLogo: companies.logo,
      companySize: companies.size,
      companyIsVerified: companies.isVerified,
      countryName: countries.name,
      cityName: cities.name,
      categoryName: jobCategories.name
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(countries, eq(jobs.countryId, countries.id))
    .leftJoin(cities, eq(jobs.cityId, cities.id))
    .leftJoin(jobCategories, eq(jobs.categoryId, jobCategories.id))
    .where(eq(jobs.status, 'active'));

    // Apply filters
    const conditions = [eq(jobs.status, 'active')];

    if (search) {
      conditions.push(
        sql`(${jobs.title} ILIKE ${'%' + search + '%'} OR ${jobs.description} ILIKE ${'%' + search + '%'} OR ${companies.name} ILIKE ${'%' + search + '%'})`
      );
    }

    if (countryId) conditions.push(eq(jobs.countryId, countryId as string));
    if (cityId) conditions.push(eq(jobs.cityId, cityId as string));
    if (categoryId) conditions.push(eq(jobs.categoryId, categoryId as string));
    if (jobType) conditions.push(eq(jobs.jobType, jobType as string));
    if (experienceLevel) conditions.push(eq(jobs.experienceLevel, experienceLevel as string));
    if (isRemote === 'true') conditions.push(eq(jobs.isRemote, true));
    if (featured === 'true') conditions.push(eq(jobs.isFeatured, true));
    if (minSalary) conditions.push(sql`${jobs.salaryMin} >= ${Number(minSalary)}`);
    if (maxSalary) conditions.push(sql`${jobs.salaryMax} <= ${Number(maxSalary)}`);
    if (currency) conditions.push(eq(jobs.salaryCurrency, currency as string));

    const jobResults = await query
      .where(and(...conditions))
      .orderBy(desc(jobs.isFeatured), desc(jobs.createdAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    // Get total count
    const totalCountResult = await db.select({ count: count() })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(and(...conditions));

    const totalCount = totalCountResult[0]?.count || 0;

    res.json({
      success: true,
      jobs: jobResults,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
});

// Get job details by ID
router.get('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const jobDetail = await db.select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      requirements: jobs.requirements,
      responsibilities: jobs.responsibilities,
      benefits: jobs.benefits,
      skills: jobs.skills,
      jobType: jobs.jobType,
      experienceLevel: jobs.experienceLevel,
      educationLevel: jobs.educationLevel,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      isNegotiable: jobs.isNegotiable,
      isRemote: jobs.isRemote,
      remoteType: jobs.remoteType,
      applicationMethod: jobs.applicationMethod,
      externalApplicationUrl: jobs.externalApplicationUrl,
      applicationEmail: jobs.applicationEmail,
      deadline: jobs.deadline,
      isFeatured: jobs.isFeatured,
      isPremium: jobs.isPremium,
      isUrgent: jobs.isUrgent,
      viewCount: jobs.viewCount,
      applicationCount: jobs.applicationCount,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
      companyName: companies.name,
      companyLogo: companies.logo,
      companyDescription: companies.description,
      companySize: companies.size,
      companyWebsite: companies.website,
      companyIsVerified: companies.isVerified,
      countryName: countries.name,
      cityName: cities.name,
      categoryName: jobCategories.name
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(countries, eq(jobs.countryId, countries.id))
    .leftJoin(cities, eq(jobs.cityId, cities.id))
    .leftJoin(jobCategories, eq(jobs.categoryId, jobCategories.id))
    .where(eq(jobs.id, id));

    if (jobDetail.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Update view count
    await db.update(jobs)
      .set({ viewCount: sql`${jobs.viewCount} + 1` })
      .where(eq(jobs.id, id));

    res.json({ success: true, job: jobDetail[0] });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job details' });
  }
});

// Get CV profiles with global location support
router.get('/cv-profiles', async (req, res) => {
  try {
    const { 
      search, 
      countryId, 
      cityId, 
      skills, 
      experienceLevel,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = db.select({
      id: cvProfiles.id,
      firstName: cvProfiles.firstName,
      lastName: cvProfiles.lastName,
      email: cvProfiles.email,
      phone: cvProfiles.phone,
      professionalTitle: cvProfiles.professionalTitle,
      summary: cvProfiles.summary,
      skills: cvProfiles.skills,
      avatar: cvProfiles.avatar,
      linkedinUrl: cvProfiles.linkedinUrl,
      portfolioUrl: cvProfiles.portfolioUrl,
      desiredSalaryMin: cvProfiles.desiredSalaryMin,
      desiredSalaryMax: cvProfiles.desiredSalaryMax,
      desiredCurrency: cvProfiles.desiredCurrency,
      preferredJobType: cvProfiles.preferredJobType,
      preferredWorkArrangement: cvProfiles.preferredWorkArrangement,
      availability: cvProfiles.availability,
      viewCount: cvProfiles.viewCount,
      downloadCount: cvProfiles.downloadCount,
      lastUpdated: cvProfiles.lastUpdated,
      createdAt: cvProfiles.createdAt,
      countryName: countries.name,
      cityName: cities.name
    })
    .from(cvProfiles)
    .leftJoin(countries, eq(cvProfiles.countryId, countries.id))
    .leftJoin(cities, eq(cvProfiles.cityId, cities.id))
    .where(and(eq(cvProfiles.isActive, true), eq(cvProfiles.isPublic, true)));

    // Apply filters
    const conditions = [
      eq(cvProfiles.isActive, true),
      eq(cvProfiles.isPublic, true)
    ];

    if (search) {
      conditions.push(
        sql`(${cvProfiles.firstName} ILIKE ${'%' + search + '%'} OR ${cvProfiles.lastName} ILIKE ${'%' + search + '%'} OR ${cvProfiles.professionalTitle} ILIKE ${'%' + search + '%'})`
      );
    }

    if (countryId) conditions.push(eq(cvProfiles.countryId, countryId as string));
    if (cityId) conditions.push(eq(cvProfiles.cityId, cityId as string));

    const cvResults = await query
      .where(and(...conditions))
      .orderBy(desc(cvProfiles.lastUpdated))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    // Get total count
    const totalCountResult = await db.select({ count: count() })
      .from(cvProfiles)
      .where(and(...conditions));

    const totalCount = totalCountResult[0]?.count || 0;

    res.json({
      success: true,
      cvProfiles: cvResults,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching CV profiles:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch CV profiles' });
  }
});

// Get salary insights for global locations
router.get('/salary-insights', async (req, res) => {
  try {
    const { countryId, cityId, jobTitle, categoryId, experienceLevel } = req.query;
    
    const conditions = [];
    if (countryId) conditions.push(eq(salaryInsights.countryId, countryId as string));
    if (cityId) conditions.push(eq(salaryInsights.cityId, cityId as string));
    if (jobTitle) conditions.push(ilike(salaryInsights.jobTitle, `%${jobTitle}%`));
    if (categoryId) conditions.push(eq(salaryInsights.categoryId, categoryId as string));
    if (experienceLevel) conditions.push(eq(salaryInsights.experienceLevel, experienceLevel as string));

    const salaryData = await db.select({
      jobTitle: salaryInsights.jobTitle,
      countryName: countries.name,
      cityName: cities.name,
      salaryMin: salaryInsights.salaryMin,
      salaryMax: salaryInsights.salaryMax,
      salaryAverage: salaryInsights.salaryAverage,
      currency: salaryInsights.currency,
      experienceLevel: salaryInsights.experienceLevel,
      sampleSize: salaryInsights.sampleSize,
      lastUpdated: salaryInsights.lastUpdated
    })
    .from(salaryInsights)
    .leftJoin(countries, eq(salaryInsights.countryId, countries.id))
    .leftJoin(cities, eq(salaryInsights.cityId, cities.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(salaryInsights.lastUpdated));

    res.json({ success: true, salaryInsights: salaryData });
  } catch (error) {
    console.error('Error fetching salary insights:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch salary insights' });
  }
});

// Job application endpoint
router.post('/apply', async (req, res) => {
  try {
    const { jobId, userId, cvId, coverLetter } = req.body;
    
    // Check if user already applied
    const existingApplication = await db.select()
      .from(jobApplications)
      .where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.userId, userId)));
    
    if (existingApplication.length > 0) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    // Create application
    const application = await db.insert(jobApplications).values({
      jobId,
      userId,
      cvId,
      coverLetter,
      status: 'pending'
    }).returning();

    // Update job application count
    await db.update(jobs)
      .set({ applicationCount: sql`${jobs.applicationCount} + 1` })
      .where(eq(jobs.id, jobId));

    res.json({ success: true, application: application[0] });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ success: false, message: 'Failed to apply to job' });
  }
});

// Save job endpoint
router.post('/save', async (req, res) => {
  try {
    const { jobId, userId, notes } = req.body;
    
    // Check if job already saved
    const existingSave = await db.select()
      .from(jobSaves)
      .where(and(eq(jobSaves.jobId, jobId), eq(jobSaves.userId, userId)));
    
    if (existingSave.length > 0) {
      return res.status(400).json({ success: false, message: 'Job already saved' });
    }

    const savedJob = await db.insert(jobSaves).values({
      jobId,
      userId,
      notes
    }).returning();

    res.json({ success: true, savedJob: savedJob[0] });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ success: false, message: 'Failed to save job' });
  }
});

// Get user's saved jobs
router.get('/saved/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const savedJobs = await db.select({
      id: jobSaves.id,
      notes: jobSaves.notes,
      savedAt: jobSaves.savedAt,
      jobId: jobs.id,
      jobTitle: jobs.title,
      jobDescription: jobs.description,
      jobType: jobs.jobType,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      deadline: jobs.deadline,
      companyName: companies.name,
      companyLogo: companies.logo,
      countryName: countries.name,
      cityName: cities.name
    })
    .from(jobSaves)
    .leftJoin(jobs, eq(jobSaves.jobId, jobs.id))
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(countries, eq(jobs.countryId, countries.id))
    .leftJoin(cities, eq(jobs.cityId, cities.id))
    .where(eq(jobSaves.userId, userId))
    .orderBy(desc(jobSaves.savedAt));

    res.json({ success: true, savedJobs });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch saved jobs' });
  }
});

// Get job applications for user
router.get('/applications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const applications = await db.select({
      id: jobApplications.id,
      status: jobApplications.status,
      stage: jobApplications.stage,
      appliedAt: jobApplications.appliedAt,
      reviewedAt: jobApplications.reviewedAt,
      jobId: jobs.id,
      jobTitle: jobs.title,
      jobType: jobs.jobType,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      companyName: companies.name,
      companyLogo: companies.logo,
      countryName: countries.name,
      cityName: cities.name
    })
    .from(jobApplications)
    .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .leftJoin(countries, eq(jobs.countryId, countries.id))
    .leftJoin(cities, eq(jobs.cityId, cities.id))
    .where(eq(jobApplications.userId, userId))
    .orderBy(desc(jobApplications.appliedAt));

    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job applications' });
  }
});

export default router;