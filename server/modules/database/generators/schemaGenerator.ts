import { Pool } from '@neondatabase/serverless';

class SchemaGenerator {
  private pool: Pool;
  
  constructor(pool: Pool) {
    this.pool = pool;
  }
  
  async generateCompleteSchema(): Promise<void> {
    console.log('Generating complete database schema...');
    
    // The schema is already defined in comprehensive_schema.ts
    // This would typically run migrations or schema updates
    
    try {
      // Ensure vector extension is available
      await this.pool.query('CREATE EXTENSION IF NOT EXISTS vector');
      
      // Ensure proper indexes exist
      await this.createOptimalIndexes();
      
      console.log('Complete schema generation finished');
    } catch (error) {
      console.error('Schema generation failed:', error);
    }
  }
  
  private async createOptimalIndexes(): Promise<void> {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true',
      'CREATE INDEX IF NOT EXISTS idx_funding_opportunities_deadline ON funding_opportunities(application_deadline)',
      'CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)',
      'CREATE INDEX IF NOT EXISTS idx_vector_embeddings_entity ON vector_embeddings(entity_type, entity_id)',
    ];
    
    for (const indexSql of indexes) {
      try {
        await this.pool.query(indexSql);
      } catch (error) {
        console.warn('Index creation warning:', error.message);
      }
    }
  }
}

export default SchemaGenerator;