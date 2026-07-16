import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listHabits from "./tools/list-habits";
import logHabit from "./tools/log-habit";
import listJournal from "./tools/list-journal";
import createJournalEntry from "./tools/create-journal-entry";
import getProgress from "./tools/get-progress";

// The OAuth issuer MUST be the direct Supabase host. On publish, SUPABASE_URL
// is rewritten to the `.lovable.cloud` proxy which mcp-js rejects (RFC 8414
// issuer mismatch). VITE_SUPABASE_PROJECT_ID is inlined at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "life-order-mcp",
  title: "Life Order",
  version: "0.1.0",
  instructions:
    "Tools for a personal discipline OS. Read and manage the signed-in user's own habits, habit logs, journal entries, streak and XP progress. All actions run as the connected user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listHabits, logHabit, listJournal, createJournalEntry, getProgress],
});
