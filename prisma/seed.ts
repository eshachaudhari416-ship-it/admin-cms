import { PrismaClient, Pricing, ContentStatus, Role, UserStatus, ReportStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");
  await prisma.report.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.aiModel.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.news.deleteMany();
  await prisma.video.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.category.deleteMany();

  console.log("Seeding categories...");
  const categoryData = [
    { name: "Writing & Content", slug: "writing-content", popular: true },
    { name: "Image Generation", slug: "image-generation", popular: true },
    { name: "Code Assistants", slug: "code-assistants", popular: true },
    { name: "Voice & Audio", slug: "voice-audio", popular: false },
    { name: "Video Editing", slug: "video-editing", popular: false },
    { name: "Data Analysis", slug: "data-analysis", popular: true },
    { name: "Productivity", slug: "productivity", popular: false },
    { name: "Customer Support", slug: "customer-support", popular: false },
    { name: "Marketing", slug: "marketing", popular: true },
    { name: "Research", slug: "research", popular: false },
  ];
  const categories = [];
  for (const c of categoryData) {
    categories.push(
      await prisma.category.create({
        data: { ...c, status: Math.random() > 0.15 ? "PUBLISHED" : "DRAFT" },
      })
    );
  }

  console.log("Seeding companies...");
  const companyData = [
    { name: "Nimbus Labs", headquarters: "San Francisco", foundedYear: 2021, funding: "$40M" },
    { name: "Vertex AI Co.", headquarters: "London", foundedYear: 2019, funding: "$85M" },
    { name: "Quanta Systems", headquarters: "Berlin", foundedYear: 2022, funding: "$12M" },
    { name: "Northwind AI", headquarters: "Toronto", foundedYear: 2020, funding: "$28M" },
    { name: "Cobalt Intelligence", headquarters: "Singapore", foundedYear: 2023, funding: "$6M" },
    { name: "Fathom Research", headquarters: "New York", foundedYear: 2018, funding: "$120M" },
    { name: "Lucent AI", headquarters: "Austin", foundedYear: 2021, funding: "$33M" },
    { name: "Ridgeline Labs", headquarters: "Seattle", foundedYear: 2022, funding: "$15M" },
  ];
  const companies = [];
  for (const c of companyData) {
    companies.push(
      await prisma.company.create({
        data: {
          ...c,
          website: `https://${c.name.toLowerCase().replace(/[^a-z]+/g, "")}.example.com`,
          description: `${c.name} builds applied AI products for teams.`,
          status: Math.random() > 0.15 ? "PUBLISHED" : "DRAFT",
        },
      })
    );
  }

  console.log("Seeding tools...");
  const toolNames = [
    "Promptly AI", "VisionForge", "CodeCopilot X", "SketchMind", "SummarEase",
    "VoiceCast Pro", "DataSage", "PixelDream", "ScriptFlow", "InsightBot",
    "AutoDraft", "ClipGenie", "TableTalk", "BriefBot", "ReviewRadar",
  ];
  const pricingOptions: Pricing[] = ["FREE", "FREEMIUM", "PAID"];
  const statusOptions: ContentStatus[] = ["PUBLISHED", "PUBLISHED", "PUBLISHED", "DRAFT", "FLAGGED", "ARCHIVED"];
  for (let i = 0; i < toolNames.length; i++) {
    await prisma.tool.create({
      data: {
        name: toolNames[i],
        website: `https://${toolNames[i].toLowerCase().replace(/[^a-z]+/g, "")}.example.com`,
        description: `${toolNames[i]} is an AI-powered productivity tool built for modern teams.`,
        imageUrl: `https://picsum.photos/seed/tool-${i}/480/270`,
        pricing: pricingOptions[i % pricingOptions.length],
        rating: Number((3.5 + (i % 5) * 0.3).toFixed(1)),
        bookmarks: 80 + i * 47,
        status: statusOptions[i % statusOptions.length],
        categoryId: categories[i % categories.length].id,
      },
    });
  }

  console.log("Seeding AI models...");
  const modelNames = [
    "Orion-2 70B", "Halcyon Vision", "Cascade-Mini", "Meridian XL",
    "Solace Base", "Kestrel Turbo", "Nimbus-7", "Aurora Code",
  ];
  const providers = ["OpenAI", "Anthropic", "Google", "Meta", "Mistral", "Cohere"];
  const contextWindows = ["32K", "128K", "200K", "1M"];
  for (let i = 0; i < modelNames.length; i++) {
    await prisma.aiModel.create({
      data: {
        name: modelNames[i],
        provider: providers[i % providers.length],
        contextWindow: contextWindows[i % contextWindows.length],
        pricing: "$3 / $15 per 1M tokens",
        openSource: i % 3 === 0,
        documentation: "https://docs.example.com/models",
        status: statusOptions[i % statusOptions.length],
        companyId: companies[i % companies.length].id,
      },
    });
  }

  console.log("Seeding collections...");
  const collectionData = [
    { title: "Best AI Tools 2026", curator: "Editorial Team", itemCount: 24 },
    { title: "Top AI Agents", curator: "Community", itemCount: 18 },
    { title: "Best AI for Developers", curator: "Editorial Team", itemCount: 31 },
    { title: "Best AI for Marketing", curator: "Editorial Team", itemCount: 15 },
    { title: "Free AI Toolkit", curator: "Community", itemCount: 40 },
    { title: "Enterprise-Ready AI", curator: "Editorial Team", itemCount: 12 },
  ];
  for (let i = 0; i < collectionData.length; i++) {
    const c = collectionData[i];
    await prisma.collection.create({
      data: {
        ...c,
        imageUrl: `https://picsum.photos/seed/collection-${i}/480/270`,
        description: `A curated set of ${c.itemCount} standout tools.`,
        status: "PUBLISHED",
      },
    });
  }

  console.log("Seeding news...");
  const newsData = [
    { title: "OpenAI ships new reasoning model", category: "Product", author: "A. Reyes" },
    { title: "EU finalizes AI Act enforcement", category: "Policy", author: "J. Chen" },
    { title: "Startup raises $40M for agent tooling", category: "Funding", author: "M. Osei" },
    { title: "Benchmark reveals model regressions", category: "Research", author: "A. Reyes" },
    { title: "New open-source model tops leaderboard", category: "Research", author: "J. Chen" },
    { title: "Enterprise AI spend doubles year over year", category: "Funding", author: "M. Osei" },
  ];
  for (let i = 0; i < newsData.length; i++) {
    const n = newsData[i];
    await prisma.news.create({
      data: {
        ...n,
        imageUrl: `https://picsum.photos/seed/news-${i}/480/270`,
        body: "Full article content goes here...",
        status: "PUBLISHED",
      },
    });
  }

  console.log("Seeding videos...");
  const videoData = [
    { title: "How agents actually work", channel: "AI Weekly", duration: "8:42" },
    { title: "Building your first AI app", channel: "Build with AI", duration: "14:05" },
    { title: "Model comparison: speed vs quality", channel: "The Model Lab", duration: "11:30" },
    { title: "Inside a RAG pipeline", channel: "AI Weekly", duration: "9:57" },
    { title: "Prompting for structured output", channel: "Build with AI", duration: "6:21" },
  ];
  for (let i = 0; i < videoData.length; i++) {
    await prisma.video.create({
      data: {
        ...videoData[i],
        embedUrl: "https://youtube.com/embed/example",
        imageUrl: `https://picsum.photos/seed/video-${i}/480/270`,
        views: 3400 + i * 980,
        status: "PUBLISHED",
      },
    });
  }

  console.log("Seeding repositories...");
  const repoData = [
    { name: "agent-runtime", language: "TypeScript", license: "MIT", stars: 1840 },
    { name: "vector-store-lite", language: "Python", license: "Apache-2.0", stars: 920 },
    { name: "prompt-eval-kit", language: "Go", license: "MIT", stars: 540 },
    { name: "llm-router", language: "Rust", license: "GPL-3.0", stars: 1200 },
    { name: "eval-harness", language: "Python", license: "Apache-2.0", stars: 310 },
    { name: "rag-toolkit", language: "TypeScript", license: "MIT", stars: 2100 },
  ];
  for (const r of repoData) {
    await prisma.repository.create({
      data: { ...r, githubUrl: `https://github.com/example/${r.name}`, status: "PUBLISHED" },
    });
  }

  console.log("Seeding users...");
  const userNames = [
    "Alex Rivera", "Priya Nandan", "Sam O'Connell", "Diego Marquez",
    "Wei Zhang", "Noor Fatima", "Liam Foster", "Grace Kim",
  ];
  const roles: Role[] = ["ADMIN", "EDITOR", "MEMBER", "MEMBER"];
  const userStatuses: UserStatus[] = ["ACTIVE", "ACTIVE", "PENDING", "SUSPENDED"];
  const users = [];
  for (let i = 0; i < userNames.length; i++) {
    users.push(
      await prisma.user.create({
        data: {
          name: userNames[i],
          email: userNames[i].toLowerCase().replace(/[^a-z]+/g, ".") + "@example.com",
          role: roles[i % roles.length],
          status: userStatuses[i % userStatuses.length],
        },
      })
    );
  }

  console.log("Seeding reports...");
  const reportData = [
    { target: "Promptly AI", reason: "Broken link" },
    { target: "SketchMind listing", reason: "Inaccurate info" },
    { target: "Nimbus Labs page", reason: "Spam" },
    { target: "VoiceCast Pro review", reason: "Inappropriate" },
    { target: "DataSage pricing", reason: "Inaccurate info" },
  ];
  const reportStatuses: ReportStatus[] = ["PENDING", "RESOLVED", "PENDING", "FLAGGED"];
  for (let i = 0; i < reportData.length; i++) {
    await prisma.report.create({
      data: {
        ...reportData[i],
        status: reportStatuses[i % reportStatuses.length],
        reportedById: users[i % users.length].id,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });