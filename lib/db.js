const postgres = require("postgres");
const { DEFAULT_PATHS } = require("./defaultPaths");

let sqlClient = null;

function getClient() {
  if (!sqlClient) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Connect a Postgres database (Neon) from the Vercel Marketplace, " +
          "or set DATABASE_URL in .env.local for local development."
      );
    }

    sqlClient = postgres(process.env.DATABASE_URL, {
      ssl: "require",
      prepare: false,
    });

    console.log("DATABASE CONNECTED");
  }

  return sqlClient;
}

let schemaReady = null;

async function ensureSchema() {
  if (schemaReady) return schemaReady;

  const sql = getClient();

  schemaReady = (async () => {

    await sql`
      create table if not exists career_paths (
        id text primary key,
        sort_order integer not null default 0,
        emoji text not null default '🧩',
        title_ar text not null default '',
        title_en text not null default '',
        accent text not null default '#7C6FF0',
        accent_soft text not null default 'rgba(124,111,240,0.16)',
        tagline text not null default '',
        def text not null default '',
        why text not null default '',
        opportunities text not null default '',
        core jsonb,
        roadmap jsonb not null default '[]'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `;


    const [{ count }] = await sql`
      select count(*)::int as count from career_paths
    `;


    if (count === 0) {

      for (let i = 0; i < DEFAULT_PATHS.length; i++) {

        const p = DEFAULT_PATHS[i];

        await sql`
          insert into career_paths
          (
            id,
            sort_order,
            emoji,
            title_ar,
            title_en,
            accent,
            accent_soft,
            tagline,
            def,
            why,
            opportunities,
            core,
            roadmap
          )

          values

          (
            ${p.id},
            ${i},
            ${p.emoji},
            ${p.titleAr},
            ${p.titleEn},
            ${p.accent},
            ${p.accentSoft},
            ${p.tagline},
            ${p.def},
            ${p.why},
            ${p.opportunities},
            ${p.core},
            ${p.roadmap}
          )

          on conflict (id) do nothing
        `;
      }
    }

  })();

  return schemaReady;
}


function rowToPath(row) {

  return {
    id: row.id,
    emoji: row.emoji,
    titleAr: row.title_ar,
    titleEn: row.title_en,
    accent: row.accent,
    accentSoft: row.accent_soft,
    tagline: row.tagline,
    def: row.def,
    why: row.why,
    opportunities: row.opportunities,

    core: row.core,

    // حماية لو البيانات القديمة String
    roadmap:
      typeof row.roadmap === "string"
        ? JSON.parse(row.roadmap)
        : row.roadmap || [],
  };
}



async function getPaths() {

  await ensureSchema();

  const sql = getClient();

  const rows = await sql`
    select *
    from career_paths
    order by sort_order asc, created_at asc
  `;

  return rows.map(rowToPath);
}



async function createPath(p) {

  await ensureSchema();

  const sql = getClient();


  const [{ max }] = await sql`
    select coalesce(max(sort_order), -1) as max
    from career_paths
  `;


  const [row] = await sql`

    insert into career_paths

    (
      id,
      sort_order,
      emoji,
      title_ar,
      title_en,
      accent,
      accent_soft,
      tagline,
      def,
      why,
      opportunities,
      core,
      roadmap
    )

    values

    (
      ${p.id},
      ${max + 1},
      ${p.emoji},
      ${p.titleAr},
      ${p.titleEn},
      ${p.accent},
      ${p.accentSoft},
      ${p.tagline},
      ${p.def},
      ${p.why},
      ${p.opportunities},
      ${p.core || null},
      ${p.roadmap || []}
    )

    returning *

  `;


  return rowToPath(row);
}




async function updatePath(id, p) {

  await ensureSchema();

  const sql = getClient();


  const [row] = await sql`

    update career_paths

    set

      emoji = ${p.emoji},

      title_ar = ${p.titleAr},

      title_en = ${p.titleEn},

      accent = ${p.accent},

      accent_soft = ${p.accentSoft},

      tagline = ${p.tagline},

      def = ${p.def},

      why = ${p.why},

      opportunities = ${p.opportunities},

      core = ${p.core || null},

      roadmap = ${p.roadmap || []},

      updated_at = now()


    where id = ${id}


    returning *

  `;


  return row ? rowToPath(row) : null;
}




async function deletePath(id) {

  await ensureSchema();

  const sql = getClient();

  await sql`
    delete from career_paths
    where id = ${id}
  `;

}


module.exports = {
  getPaths,
  createPath,
  updatePath,
  deletePath
};