/**
 * Credit Packages API - Database Driven
 * All package data comes from database, fully editable
 */
import { Router } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

// Get all active credit packages from database
router.get('/', async (req, res) => {
  try {
    const packages = await db.execute(sql`
      SELECT 
        id,
        name,
        credits,
        price,
        popular,
        bonus_credits,
        description,
        features,
        badge_text,
        is_active
      FROM credit_packages 
      WHERE is_active = true 
      ORDER BY price ASC
    `);

    res.json({
      success: true,
      packages: packages.rows
    });
  } catch (error) {
    console.error('Failed to fetch credit packages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credit packages'
    });
  }
});

// Get single package by ID
router.get('/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;
    
    const packageData = await db.execute(sql`
      SELECT 
        id,
        name,
        credits,
        price,
        popular,
        bonus_credits,
        description,
        features,
        badge_text,
        is_active
      FROM credit_packages 
      WHERE id = ${packageId} AND is_active = true
    `);

    if (packageData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      package: packageData.rows[0]
    });
  } catch (error) {
    console.error('Failed to fetch package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch package'
    });
  }
});

// Update package (admin only)
router.put('/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;
    const { name, credits, price, popular, bonus_credits, description, features, badge_text } = req.body;
    
    const result = await db.execute(sql`
      UPDATE credit_packages SET
        name = ${name},
        credits = ${credits},
        price = ${price},
        popular = ${popular || false},
        bonus_credits = ${bonus_credits || 0},
        description = ${description},
        features = ${features || []},
        badge_text = ${badge_text},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${packageId}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to update package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update package'
    });
  }
});

export default router;