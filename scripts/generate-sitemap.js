// Runs during prebuild to generate public/sitemap.xml
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://hiyoumore.xyz';
const BUILD_DATE = new Date().toISOString().split('T')[0];

const STATIC_ROUTES = [
  { url: '/',        priority: '1.0', changefreq: 'daily' },
  { url: '/info',    priority: '0.6', changefreq: 'monthly' },
  { url: '/terms',   priority: '0.5', changefreq: 'yearly' },
  { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
];

async function generateSitemap() {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[sitemap] Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY');
    console.error('[sitemap] Generating sitemap with static routes only.');
  }

  let quizIndices = [];

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('quizzes')
      .select('index')
      .order('index', { ascending: true });

    if (error) {
      console.error('[sitemap] Supabase error:', error.message);
    } else {
      quizIndices = data.map((row) => row.index);
      console.log(`[sitemap] Fetched ${quizIndices.length} quiz indices.`);
    }
  }

  const staticEntries = STATIC_ROUTES.map(
    ({ url, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join('');

  const quizEntries = quizIndices.map(
    (index) => `
  <url>
    <loc>${SITE_URL}/shared-quiz?num=${index}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${quizEntries}
</urlset>`;

  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml.trim(), 'utf8');
  console.log(`[sitemap] Written to ${outputPath} (${STATIC_ROUTES.length} static + ${quizIndices.length} quiz URLs)`);
}

generateSitemap().catch((err) => {
  console.error('[sitemap] Fatal error:', err);
  process.exit(1);
});
