# Storytelling API

The Express/Socket.IO API connects to the existing Supabase project through
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, loaded from the repository-root
`.env`. The service-role key is server-only.

All API routes accept Supabase Auth access tokens as bearer credentials. The
API verifies tokens with Supabase Auth and reads `profiles.role` to authorize
teacher and student operations. A profile is created with the default student
role when an authenticated user has no profile row.

Provision teacher access only for trusted accounts by changing that user's
`profiles.role` to `teacher` in the Supabase dashboard. New self-registered
accounts are always initialized as students.

The API uses `classes`, `class_students`, `profiles`, `lobbies`, and
`lobby_participants`. It maps the existing UI's lobby states (`open`, `locked`)
to `waiting`, `active` in the database. Student Socket.IO access uses a
short-lived server-signed token and verifies the participant row on connect.

Lobby creation, code-based joining, class-enrollment checks, and participant
listing all run through this API and are persisted in Supabase. The API connects
with `SUPABASE_SERVICE_ROLE_KEY`, so it bypasses row-level security policies;
keep that key server-only. The `service_role` database role still needs SQL
privileges on the tables. If the API reports a permission error, verify the
necessary grants for `service_role` on the tables it uses. Direct browser
access would use the anon key and requires separate RLS policies and grants.

Run `npm run dev:api` from this directory to start the API, or run `npm run dev`
from the repository root to start the app and API together. Run `npm test` for
the API tests.
