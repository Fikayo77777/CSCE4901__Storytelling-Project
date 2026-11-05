# Collaborative Storytelling

The app uses Supabase Auth for accounts and a Supabase Postgres database for
classes, rosters, and lobbies. The Express/Socket.IO API uses a server-only
service-role key and checks the signed-in user's `profiles.role` before each
operation. The browser only receives the Supabase URL and anon key.

## Local development

1. Copy `.env.example` to `.env`.
2. Set the Supabase URL and anon key from **Project Settings → API**.
3. Set the service-role key only in `SUPABASE_SERVICE_ROLE_KEY`; never expose
   it through a `NEXT_PUBLIC_` variable or commit it.
4. Set `JWT_SECRET` to a random value of at least 32 characters.
5. Run `npm run dev`. The Next.js app is at `http://localhost:3000` and the API
   health endpoint is at `http://localhost:4000/health`.

The existing Supabase schema should contain `profiles`, `classes`,
`class_students`, `lobbies`, and `lobby_participants`. `profiles.id` must match
the Supabase Auth user UUID. Teacher accounts need `profiles.role = 'teacher'`;
newly authenticated users without a profile are provisioned as students.

The roster CSV keeps the `studentId,name` header. `studentId` must be an
existing Supabase Auth user UUID. Import updates that user's profile
display name and enrolls them in the class.

## Database mapping

- `classes.class_id`, `teacher_id`, and `class_name` back the teacher class
  list.
- `class_students` links classes to `profiles`.
- `lobbies` uses `waiting`, `active`, and `closed` in the database; the existing
  UI continues to see `open`, `locked`, and `closed`.
- `lobby_participants.status` tracks active and removed student seats.
- Story, segment, drawing, and breakout tables remain in Supabase for their
  existing/future features; this app's current UI does not write to them.

The API uses the service-role key, so it performs authorization checks in
server code. Keep the key private and enable appropriate RLS policies for any
future direct browser access.
