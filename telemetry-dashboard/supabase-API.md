**Yes, Supabase is 100% Open Source!** It is the world's most popular open-source backend (known as the *"Open Source Firebase Alternative"*), built directly on top of enterprise **PostgreSQL**.

### Why Supabase is ideal for your Lead Full-Stack portfolio:
1. **100% Open-Source (Apache 2.0 license)**: You can host it in the cloud or self-host it on Docker.
2. **Real PostgreSQL underneath**: SQL tables, JSONB columns, foreign keys, and indexes.
3. **Auto-generated REST API**: Any table you create immediately exposes real HTTPS endpoints (`GET`, `POST`, `PATCH`, `DELETE`) with zero backend code required.
4. **Free Cloud Tier**: Generates a live URL and API key you can use in your React app.

---

### Step-by-Step Setup (Takes ~2 minutes)

#### 1. Create a Free Project
1. Go to [supabase.com](https://supabase.com) and click **"Start your project"**.
2. Sign in with your **GitHub account** (`Nagabhushanarao`).
3. Click **"New Project"**, name it `telemetry-hub`, set a database password, and click **"Create new project"**.

#### 2. Create the `equipment` Table
In the left sidebar, click **Table Editor** > **New Table**:
- **Name:** `equipment`
- **Enable Row Level Security (RLS):** Uncheck this for now (or set public read/write policy so your frontend can read & write).
- Add the columns:
  - `id` (type: `text`, Primary Key)
  - `name` (type: `text`)
  - `location` (type: `text`)
  - `status` (type: `text`, default: `'ONLINE'`)
  - `metrics` (type: `jsonb`)
  - `last_updated` (type: `text`)
- Click **Save**.

#### 3. Grab Your Project Credentials
In the left sidebar, click **Project Settings** (gear icon) > **API**:
Copy two values:
1. **Project URL** (e.g., `https://xyzcompany.supabase.co`)
2. **Project API Key (`anon` / `public`)**

---

### How we will connect it in React:

We simply install the official open-source client:
```bash
cd telemetry-dashboard
npm install @supabase/supabase-js
```

And in `App.jsx`, fetching and creating data becomes real asynchronous cloud calls:
```javascript
// Load all equipment from real cloud Postgres on mount
const { data, error } = await supabase.from('equipment').select('*')

// Register new equipment in real cloud Postgres
await supabase.from('equipment').insert([newUnit])

// Update status in real cloud Postgres
await supabase.from('equipment').update({ status: newStatus }).eq('id', id)
```

Whenever you're ready, let me know once you have your Supabase **Project URL** and **anon key**, and we will wire up the asynchronous loading states (`isLoading`, `error`) and cloud persistence!

Ran command: `npm run dev`
Edited README.md
Viewed README.md:16-20
Ran command: `npm install @supabase/supabase-js`


### Project: telemetry-hub-react