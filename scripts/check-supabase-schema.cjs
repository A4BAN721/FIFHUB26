const fs = require("node:fs");
const { Client } = require("pg");

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");
      return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
    }),
);

async function main() {
  const client = new Client({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 15_000,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows } = await client.query(`
    select 'table' as kind, tablename as name
    from pg_tables
    where schemaname = 'public'
      and tablename in ('nations', 'players', 'match_fixtures', 'translations')
    union all
    select 'type' as kind, typname as name
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and typname in ('nations', 'players', 'match_fixtures', 'translations')
    order by kind, name;
  `);

  console.log(JSON.stringify(rows, null, 2));
  await client.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
