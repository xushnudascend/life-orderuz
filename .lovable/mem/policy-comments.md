---
name: Security Policy Comments
description: Requirements for SQL comments and policy documentation to pass security audits.
type: constraint
---
# Security Policy Comments Requirement

Every `CREATE POLICY` statement in the project must be accompanied by a descriptive SQL comment or a `COMMENT ON POLICY` statement. 

## Rationale
Automated security scanners and manual auditors require clear intent for every RLS policy to distinguish between intentional public access (e.g., `USING (true)`) and accidental misconfiguration.

## Requirements
1. **Public Access**: Any policy using `USING (true)` must explain *why* the data is public (e.g., "Public achievements metadata").
2. **Ownership**: Policies using `auth.uid() = user_id` should be labeled as "Ownership enforcement".
3. **Internal Tables**: Policies on system tables (e.g., `rate_limits`, `blocked_clients`) must specify that they are for "Internal system enforcement".

## Example
```sql
-- Ownership enforcement: users only access their own data
CREATE POLICY "Users can view own data" ON public.data
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
```
