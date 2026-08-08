import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Security Regression Tripwires', () => {
  const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));

  it('every CREATE TABLE must have RLS ENABLED', () => {
    files.forEach(file => {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      const tables = Array.from(content.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?public\.([a-z0-9_]+)/gi)).map(m => m[1]);
      
      tables.forEach(table => {
        const rlsPattern = new RegExp(`ALTER TABLE (?:public\\.)?${table} ENABLE ROW LEVEL SECURITY`, 'i');
        expect(content, `Table "${table}" in ${file} is missing ENABLE ROW LEVEL SECURITY`).toMatch(rlsPattern);
      });
    });
  });

  it('every public policy must have an explanatory comment', () => {
    files.forEach(file => {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      const publicPolicies = Array.from(content.matchAll(/CREATE POLICY .* ON .* (?:FOR|TO) .* (?:USING|WITH CHECK) \(true\)/gi));
      
      publicPolicies.forEach(match => {
        const index = match.index!;
        const snippetBefore = content.substring(Math.max(0, index - 200), index);
        expect(snippetBefore, `Public policy in ${file} missing explanatory SQL comment nearby: "${match[0]}"`).toMatch(/--/);
      });
    });
  });
});
