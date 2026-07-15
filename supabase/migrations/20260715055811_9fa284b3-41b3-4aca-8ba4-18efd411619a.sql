
-- Meals bucket: user_id-scoped folder policy
CREATE POLICY "Users read own meal images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'meals' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload own meal images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'meals' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own meal images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'meals' AND (storage.foldername(name))[1] = auth.uid()::text);
