import { Pool } from '@neondatabase/serverless';
import VectorDatabaseEngine from '../ai/vectorEngine';
import SecurityManager from '../security/securityManager';
import SchemaGenerator from '../generators/schemaGenerator';
import BackupManager from '../backup/backupManager';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// INTELLIGENT STORAGE SERVICES
// AI-Powered Database Operations with Vector Intelligence
// ============================================================================

interface StorageOperation {
  id: string;
  operation: string;
  entityType: string;
  entityId?: string;
  data?: any;
  metadata: Record<string, any>;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

interface QueryOptimization {
  originalQuery: string;
  optimizedQuery: string;
  improvementReason: string;
  performanceGain: number;
  executionTime: number;
  confidence: number;
  aiSource: 'deepseek' | 'gemini' | 'hybrid';
}

interface AutoRelationship {
  id: string;
  sourceTable: string;
  targetTable: string;
  relationshipType: string;
  confidence: number;
  foreignKey: string;
  referencedKey: string;
  constraintName: string;
  isCreated: boolean;
  reasoning: string;
  aiJustification: string;
}

interface DataInsight {
  id: string;
  type: 'optimization' | 'relationship' | 'pattern' | 'anomaly' | 'prediction';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  confidence: number;
  data: Record<string, any>;
  actionable: boolean;
  implemented: boolean;
  source: 'ai_analysis' | 'user_feedback' | 'system_monitoring';
  createdAt: Date;
}

class IntelligentStorageService {
  private pool: Pool;
  private vectorEngine: VectorDatabaseEngine;
  private securityManager: SecurityManager;
  private schemaGenerator: SchemaGenerator;
  private backupManager: BackupManager;
  private geminiAI: GoogleGenAI;
  private deepseekApiKey: string;
  
  private operationHistory: Map<string, StorageOperation[]> = new Map();
  private queryOptimizations: Map<string, QueryOptimization> = new Map();
  private autoRelationships: Map<string, AutoRelationship> = new Map();
  private dataInsights: Map<string, DataInsight> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.vectorEngine = new VectorDatabaseEngine(pool);
    this.securityManager = new SecurityManager();
    this.schemaGenerator = new SchemaGenerator(pool);
    this.backupManager = new BackupManager(pool);
    this.geminiAI = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY || "" 
    });
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || "";
    
    this.initializeIntelligentStorage();
  }

  // ============================================================================
  // INITIALIZATION & SETUP
  // ============================================================================

  private async initializeIntelligentStorage(): Promise<void> {
    console.log('Initializing Intelligent Storage Services...');
    
    try {
      // Initialize comprehensive schema
      await this.schemaGenerator.generateCompleteSchema();
      
      // Start AI-powered monitoring
      this.startIntelligentMonitoring();
      
      // Initialize auto-relationship discovery
      this.startRelationshipDiscovery();
      
      // Start query optimization learning
      this.startQueryOptimization();
      
      console.log('Intelligent Storage Services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Intelligent Storage:', error);
    }
  }

  private startIntelligentMonitoring(): void {
    // Continuous monitoring every 2 minutes
    setInterval(async () => {
      await this.performIntelligentAnalysis();
    }, 2 * 60 * 1000);

    // Deep analysis every 30 minutes
    setInterval(async () => {
      await this.performDeepDataAnalysis();
    }, 30 * 60 * 1000);

    // Relationship optimization every hour
    setInterval(async () => {
      await this.optimizeRelationships();
    }, 60 * 60 * 1000);
  }

  private startRelationshipDiscovery(): void {
    // Auto-discover relationships every 15 minutes
    setInterval(async () => {
      await this.discoverAutomaticRelationships();
    }, 15 * 60 * 1000);

    // Validate and create relationships every hour
    setInterval(async () => {
      await this.validateAndCreateRelationships();
    }, 60 * 60 * 1000);
  }

  private startQueryOptimization(): void {
    // Analyze query patterns every 10 minutes
    setInterval(async () => {
      await this.analyzeQueryPatterns();
    }, 10 * 60 * 1000);

    // Optimize slow queries every 30 minutes
    setInterval(async () => {
      await this.optimizeSlowQueries();
    }, 30 * 60 * 1000);
  }

  // ============================================================================
  // INTELLIGENT CREATE OPERATIONS
  // ============================================================================

  async intelligentCreate(entityType: string, data: any, context: any = {}): Promise<any> {
    const operation: StorageOperation = {
      id: uuidv4(),
      operation: 'create',
      entityType,
      data,
      metadata: {
        dataSize: JSON.stringify(data).length,
        fieldCount: Object.keys(data).length,
        context
      },
      timestamp: new Date(),
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      sessionId: context.sessionId
    };

    try {
      // Security validation
      await this.validateSecurityAccess(operation);
      
      // AI-powered data validation and enhancement
      const enhancedData = await this.enhanceDataWithAI(entityType, data);
      
      // Create vector embedding for the entity
      const embedding = await this.vectorEngine.createEntityEmbedding(
        entityType, 
        enhancedData.id || uuidv4(), 
        enhancedData
      );
      
      // Store the enhanced data
      const result = await this.performCreate(entityType, enhancedData);
      
      // Record operation for learning
      this.recordOperation(operation);
      
      // Trigger relationship discovery
      await this.discoverPotentialRelationships(entityType, result);
      
      // Generate insights
      await this.generateDataInsights(operation, result);
      
      return result;
      
    } catch (error) {
      operation.metadata.error = error.message;
      this.recordOperation(operation);
      throw error;
    }
  }

  private async enhanceDataWithAI(entityType: string, data: any): Promise<any> {
    try {
      const enhancementPrompt = `
        Analyze and enhance the following ${entityType} data:
        ${JSON.stringify(data, null, 2)}
        
        Please:
        1. Validate data consistency and completeness
        2. Suggest missing but important fields
        3. Standardize formats and values
        4. Add semantic tags and categories
        5. Generate relevant metadata
        6. Ensure data quality and integrity
        
        Return enhanced data in JSON format with explanations for changes.
      `;
      
      const enhancement = await this.queryAI(enhancementPrompt, 'data_enhancement');
      
      if (enhancement && enhancement.enhancedData) {
        return {
          ...data,
          ...enhancement.enhancedData,
          aiEnhanced: true,
          enhancementDetails: enhancement.changes || [],
          enhancementConfidence: enhancement.confidence || 0.8
        };
      }
      
      return data;
      
    } catch (error) {
      console.warn('AI enhancement failed, using original data:', error);
      return data;
    }
  }

  private async performCreate(entityType: string, data: any): Promise<any> {
    const tableName = this.getTableName(entityType);
    
    // Build dynamic insert query
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // ============================================================================
  // INTELLIGENT READ OPERATIONS
  // ============================================================================

  async intelligentQuery(query: string, params: any[] = [], context: any = {}): Promise<any> {
    const operation: StorageOperation = {
      id: uuidv4(),
      operation: 'query',
      entityType: 'query',
      metadata: {
        originalQuery: query,
        paramCount: params.length,
        context
      },
      timestamp: new Date(),
      userId: context.userId
    };

    try {
      // Optimize query with AI
      const optimizedQuery = await this.optimizeQueryWithAI(query, params);
      
      // Execute with performance monitoring
      const startTime = Date.now();
      const result = await this.pool.query(optimizedQuery.query, params);
      const executionTime = Date.now() - startTime;
      
      // Record performance metrics
      operation.metadata.executionTime = executionTime;
      operation.metadata.rowCount = result.rows.length;
      operation.metadata.optimized = optimizedQuery.wasOptimized;
      
      // Learn from query patterns
      await this.learnFromQuery(query, optimizedQuery, executionTime);
      
      // Record operation
      this.recordOperation(operation);
      
      return result.rows;
      
    } catch (error) {
      operation.metadata.error = error.message;
      this.recordOperation(operation);
      throw error;
    }
  }

  async intelligentSearch(searchTerm: string, entityTypes: string[] = [], options: any = {}): Promise<any> {
    try {
      // Use vector similarity search
      const results = await this.vectorEngine.searchSimilarEntities(
        searchTerm,
        entityTypes.length === 1 ? entityTypes[0] : undefined,
        options.limit || 50
      );
      
      // Enhance results with additional context
      const enhancedResults = await this.enhanceSearchResults(results, searchTerm);
      
      return enhancedResults;
      
    } catch (error) {
      console.error('Intelligent search failed:', error);
      throw error;
    }
  }

  private async enhanceSearchResults(results: any[], searchTerm: string): Promise<any[]> {
    const enhanced = [];
    
    for (const result of results) {
      try {
        // Get related entities
        const relationships = await this.vectorEngine.getEntityRelationships(
          result.entity_type,
          result.entity_id
        );
        
        // Add context and relevance scoring
        enhanced.push({
          ...result,
          relationships: relationships.slice(0, 5), // Top 5 relationships
          relevanceScore: result.similarity || 0,
          searchContext: {
            searchTerm,
            matchType: this.determineMatchType(result, searchTerm),
            confidence: result.similarity || 0
          }
        });
        
      } catch (error) {
        enhanced.push(result); // Fallback to original result
      }
    }
    
    return enhanced.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  // ============================================================================
  // INTELLIGENT UPDATE OPERATIONS
  // ============================================================================

  async intelligentUpdate(entityType: string, entityId: string, data: any, context: any = {}): Promise<any> {
    const operation: StorageOperation = {
      id: uuidv4(),
      operation: 'update',
      entityType,
      entityId,
      data,
      metadata: {
        updateFields: Object.keys(data),
        context
      },
      timestamp: new Date(),
      userId: context.userId
    };

    try {
      // Get current data for comparison
      const currentData = await this.getCurrentData(entityType, entityId);
      
      // AI-powered change validation
      const validatedChanges = await this.validateChangesWithAI(entityType, currentData, data);
      
      // Security validation
      await this.validateSecurityAccess(operation);
      
      // Perform update
      const result = await this.performUpdate(entityType, entityId, validatedChanges);
      
      // Update vector embedding
      await this.updateVectorEmbedding(entityType, entityId, result);
      
      // Analyze impact of changes
      await this.analyzeChangeImpact(entityType, currentData, result);
      
      // Record operation
      this.recordOperation(operation);
      
      return result;
      
    } catch (error) {
      operation.metadata.error = error.message;
      this.recordOperation(operation);
      throw error;
    }
  }

  private async validateChangesWithAI(entityType: string, currentData: any, newData: any): Promise<any> {
    try {
      const validationPrompt = `
        Validate the following data changes for ${entityType}:
        
        Current data: ${JSON.stringify(currentData, null, 2)}
        Proposed changes: ${JSON.stringify(newData, null, 2)}
        
        Please:
        1. Validate the changes for consistency and integrity
        2. Check for potential conflicts or issues
        3. Suggest improvements or additional changes
        4. Flag any security or compliance concerns
        5. Ensure data quality is maintained or improved
        
        Return validation results with approved changes and recommendations.
      `;
      
      const validation = await this.queryAI(validationPrompt, 'change_validation');
      
      if (validation && validation.approvedChanges) {
        return {
          ...newData,
          ...validation.approvedChanges,
          aiValidated: true,
          validationNotes: validation.notes || [],
          validationConfidence: validation.confidence || 0.8
        };
      }
      
      return newData;
      
    } catch (error) {
      console.warn('AI validation failed, using original changes:', error);
      return newData;
    }
  }

  // ============================================================================
  // AI-POWERED RELATIONSHIP DISCOVERY
  // ============================================================================

  private async discoverAutomaticRelationships(): Promise<void> {
    try {
      console.log('Discovering automatic relationships...');
      
      // Get all tables and their structures
      const tables = await this.getAllTableStructures();
      
      // Use AI to analyze potential relationships
      for (const sourceTable of tables) {
        for (const targetTable of tables) {
          if (sourceTable.name !== targetTable.name) {
            await this.analyzeTableRelationship(sourceTable, targetTable);
          }
        }
      }
      
    } catch (error) {
      console.error('Relationship discovery failed:', error);
    }
  }

  private async analyzeTableRelationship(sourceTable: any, targetTable: any): Promise<void> {
    const analysisPrompt = `
      Analyze the relationship potential between these two database tables:
      
      Source Table: ${sourceTable.name}
      Columns: ${sourceTable.columns.map(c => `${c.name} (${c.type})`).join(', ')}
      
      Target Table: ${targetTable.name}
      Columns: ${targetTable.columns.map(c => `${c.name} (${c.type})`).join(', ')}
      
      Determine:
      1. Should there be a foreign key relationship?
      2. What type of relationship (one-to-one, one-to-many, many-to-many)?
      3. Which columns should be linked?
      4. What should the constraint be named?
      5. Business logic justification for the relationship
      
      Only suggest relationships with high confidence (>80%).
    `;
    
    try {
      const analysis = await this.queryAI(analysisPrompt, 'relationship_analysis');
      
      if (analysis && analysis.recommendRelationship && analysis.confidence > 0.8) {
        const relationship: AutoRelationship = {
          id: uuidv4(),
          sourceTable: sourceTable.name,
          targetTable: targetTable.name,
          relationshipType: analysis.relationshipType,
          confidence: analysis.confidence,
          foreignKey: analysis.foreignKey,
          referencedKey: analysis.referencedKey,
          constraintName: analysis.constraintName,
          isCreated: false,
          reasoning: analysis.reasoning,
          aiJustification: analysis.justification
        };
        
        this.autoRelationships.set(relationship.id, relationship);
      }
      
    } catch (error) {
      console.warn('Table relationship analysis failed:', error);
    }
  }

  private async validateAndCreateRelationships(): Promise<void> {
    const pendingRelationships = Array.from(this.autoRelationships.values())
      .filter(r => !r.isCreated && r.confidence > 0.85);
    
    for (const relationship of pendingRelationships) {
      try {
        await this.createForeignKeyConstraint(relationship);
        relationship.isCreated = true;
        
        console.log(`Created relationship: ${relationship.sourceTable}.${relationship.foreignKey} -> ${relationship.targetTable}.${relationship.referencedKey}`);
        
      } catch (error) {
        console.warn(`Failed to create relationship for ${relationship.sourceTable}:`, error);
      }
    }
  }

  private async createForeignKeyConstraint(relationship: AutoRelationship): Promise<void> {
    const query = `
      ALTER TABLE ${relationship.sourceTable}
      ADD CONSTRAINT ${relationship.constraintName}
      FOREIGN KEY (${relationship.foreignKey})
      REFERENCES ${relationship.targetTable}(${relationship.referencedKey})
      ON DELETE CASCADE
      ON UPDATE CASCADE
    `;
    
    await this.pool.query(query);
  }

  // ============================================================================
  // QUERY OPTIMIZATION
  // ============================================================================

  private async optimizeQueryWithAI(query: string, params: any[]): Promise<{ query: string; wasOptimized: boolean; reason?: string }> {
    try {
      // Check if we have a cached optimization
      const cached = this.queryOptimizations.get(query);
      if (cached) {
        return {
          query: cached.optimizedQuery,
          wasOptimized: true,
          reason: cached.improvementReason
        };
      }
      
      const optimizationPrompt = `
        Optimize this PostgreSQL query for better performance:
        
        Query: ${query}
        Parameters: ${JSON.stringify(params)}
        
        Please:
        1. Analyze the query structure and performance characteristics
        2. Suggest optimizations (indexes, joins, subqueries, etc.)
        3. Rewrite the query for better performance if possible
        4. Explain the improvements and expected performance gain
        5. Ensure the optimized query returns the same results
        
        Return the optimized query and explanation.
      `;
      
      const optimization = await this.queryAI(optimizationPrompt, 'query_optimization');
      
      if (optimization && optimization.optimizedQuery && optimization.performanceGain > 0.1) {
        const queryOpt: QueryOptimization = {
          originalQuery: query,
          optimizedQuery: optimization.optimizedQuery,
          improvementReason: optimization.reason,
          performanceGain: optimization.performanceGain,
          executionTime: 0, // Will be updated when executed
          confidence: optimization.confidence || 0.8,
          aiSource: 'hybrid'
        };
        
        this.queryOptimizations.set(query, queryOpt);
        
        return {
          query: optimization.optimizedQuery,
          wasOptimized: true,
          reason: optimization.reason
        };
      }
      
    } catch (error) {
      console.warn('Query optimization failed:', error);
    }
    
    return { query, wasOptimized: false };
  }

  // ============================================================================
  // DEEP DATA ANALYSIS
  // ============================================================================

  private async performIntelligentAnalysis(): Promise<void> {
    try {
      // Analyze recent operations
      await this.analyzeOperationPatterns();
      
      // Generate performance insights
      await this.generatePerformanceInsights();
      
      // Discover data quality issues
      await this.discoverDataQualityIssues();
      
      // Predict future trends
      await this.predictDataTrends();
      
    } catch (error) {
      console.error('Intelligent analysis failed:', error);
    }
  }

  private async performDeepDataAnalysis(): Promise<void> {
    try {
      console.log('Performing deep data analysis...');
      
      // Comprehensive relationship analysis
      await this.analyzeAllRelationships();
      
      // Data distribution analysis
      await this.analyzeDataDistribution();
      
      // Usage pattern analysis
      await this.analyzeUsagePatterns();
      
      // Security pattern analysis
      await this.analyzeSecurityPatterns();
      
    } catch (error) {
      console.error('Deep data analysis failed:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private async queryAI(prompt: string, type: string): Promise<any> {
    try {
      // Try Gemini first
      const geminiResponse = await this.geminiAI.models.generateContent({
        model: "gemini-2.0-flash-thinking-exp-01-21",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              result: { type: "object" },
              confidence: { type: "number" },
              reasoning: { type: "string" }
            }
          }
        }
      });
      
      if (geminiResponse.text) {
        return JSON.parse(geminiResponse.text).result;
      }
      
    } catch (error) {
      console.warn('Gemini AI query failed, trying DeepSeek:', error);
    }
    
    try {
      // Fallback to DeepSeek
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a database AI assistant. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' }
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        return JSON.parse(data.choices[0].message.content);
      }
      
    } catch (error) {
      console.error('DeepSeek AI query failed:', error);
    }
    
    return null;
  }

  private getTableName(entityType: string): string {
    // Convert camelCase to snake_case
    return entityType
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  private async validateSecurityAccess(operation: StorageOperation): Promise<void> {
    const threatCheck = this.securityManager.detectThreat({
      type: operation.operation,
      userId: operation.userId,
      ipAddress: operation.ipAddress,
      userAgent: operation.userAgent,
      details: operation.metadata,
      timestamp: operation.timestamp
    });

    if (threatCheck.threat) {
      throw new Error(`Operation blocked: ${threatCheck.details?.reason || 'Security threat detected'}`);
    }
  }

  private recordOperation(operation: StorageOperation): void {
    const entityOperations = this.operationHistory.get(operation.entityType) || [];
    entityOperations.push(operation);
    
    // Keep only last 1000 operations per entity type
    if (entityOperations.length > 1000) {
      entityOperations.splice(0, entityOperations.length - 1000);
    }
    
    this.operationHistory.set(operation.entityType, entityOperations);
  }

  // Additional utility methods would continue here...
  private async getAllTableStructures(): Promise<any[]> {
    const query = `
      SELECT 
        t.table_name,
        array_agg(
          json_build_object(
            'name', c.column_name,
            'type', c.data_type,
            'nullable', c.is_nullable = 'YES',
            'default', c.column_default
          )
        ) as columns
      FROM information_schema.tables t
      JOIN information_schema.columns c ON t.table_name = c.table_name
      WHERE t.table_schema = 'public'
      GROUP BY t.table_name
      ORDER BY t.table_name
    `;
    
    const result = await this.pool.query(query);
    return result.rows.map(row => ({
      name: row.table_name,
      columns: row.columns
    }));
  }

  private async getCurrentData(entityType: string, entityId: string): Promise<any> {
    const tableName = this.getTableName(entityType);
    const result = await this.pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [entityId]);
    return result.rows[0];
  }

  private async performUpdate(entityType: string, entityId: string, data: any): Promise<any> {
    const tableName = this.getTableName(entityType);
    const setClause = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [entityId, ...Object.values(data)];
    
    const query = `
      UPDATE ${tableName} 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  private async updateVectorEmbedding(entityType: string, entityId: string, data: any): Promise<void> {
    try {
      await this.vectorEngine.createEntityEmbedding(entityType, entityId, data);
    } catch (error) {
      console.warn('Failed to update vector embedding:', error);
    }
  }

  private determineMatchType(result: any, searchTerm: string): string {
    // Simple match type determination logic
    if (result.metadata && result.metadata.tags && 
        result.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return 'tag_match';
    }
    return 'semantic_match';
  }

  // Placeholder methods for additional functionality
  private async discoverPotentialRelationships(entityType: string, data: any): Promise<void> {
    // Implementation would analyze new data for potential relationships
  }

  private async generateDataInsights(operation: StorageOperation, result: any): Promise<void> {
    // Implementation would generate insights from operations
  }

  private async learnFromQuery(originalQuery: string, optimizedQuery: any, executionTime: number): Promise<void> {
    // Implementation would learn from query patterns
  }

  private async analyzeChangeImpact(entityType: string, oldData: any, newData: any): Promise<void> {
    // Implementation would analyze the impact of changes
  }

  private async analyzeOperationPatterns(): Promise<void> {
    // Implementation would analyze operation patterns
  }

  private async generatePerformanceInsights(): Promise<void> {
    // Implementation would generate performance insights
  }

  private async discoverDataQualityIssues(): Promise<void> {
    // Implementation would discover data quality issues
  }

  private async predictDataTrends(): Promise<void> {
    // Implementation would predict future data trends
  }

  private async analyzeAllRelationships(): Promise<void> {
    // Implementation would analyze all relationships
  }

  private async analyzeDataDistribution(): Promise<void> {
    // Implementation would analyze data distribution
  }

  private async analyzeUsagePatterns(): Promise<void> {
    // Implementation would analyze usage patterns
  }

  private async analyzeSecurityPatterns(): Promise<void> {
    // Implementation would analyze security patterns
  }

  private async analyzeQueryPatterns(): Promise<void> {
    // Implementation would analyze query patterns
  }

  private async optimizeSlowQueries(): Promise<void> {
    // Implementation would optimize slow queries
  }

  private async optimizeRelationships(): Promise<void> {
    // Implementation would optimize relationships
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  async createEntity(entityType: string, data: any, context: any = {}): Promise<any> {
    return this.intelligentCreate(entityType, data, context);
  }

  async updateEntity(entityType: string, entityId: string, data: any, context: any = {}): Promise<any> {
    return this.intelligentUpdate(entityType, entityId, data, context);
  }

  async queryData(query: string, params: any[] = [], context: any = {}): Promise<any> {
    return this.intelligentQuery(query, params, context);
  }

  async searchEntities(searchTerm: string, entityTypes: string[] = [], options: any = {}): Promise<any> {
    return this.intelligentSearch(searchTerm, entityTypes, options);
  }

  getOperationHistory(entityType?: string): StorageOperation[] {
    if (entityType) {
      return this.operationHistory.get(entityType) || [];
    }
    
    const allOperations: StorageOperation[] = [];
    for (const operations of this.operationHistory.values()) {
      allOperations.push(...operations);
    }
    
    return allOperations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getQueryOptimizations(): QueryOptimization[] {
    return Array.from(this.queryOptimizations.values());
  }

  getAutoRelationships(): AutoRelationship[] {
    return Array.from(this.autoRelationships.values());
  }

  getDataInsights(): DataInsight[] {
    return Array.from(this.dataInsights.values());
  }

  getIntelligentStorageMetrics(): any {
    return {
      totalOperations: Array.from(this.operationHistory.values()).reduce((sum, ops) => sum + ops.length, 0),
      optimizedQueries: this.queryOptimizations.size,
      discoveredRelationships: this.autoRelationships.size,
      createdRelationships: Array.from(this.autoRelationships.values()).filter(r => r.isCreated).length,
      dataInsights: this.dataInsights.size,
      vectorEmbeddings: this.vectorEngine.getVectorMetrics().totalEmbeddings,
      semanticRelationships: this.vectorEngine.getVectorMetrics().totalRelationships,
      aiInsights: this.vectorEngine.getVectorMetrics().totalInsights,
      lastAnalysis: new Date()
    };
  }
}

export default IntelligentStorageService;