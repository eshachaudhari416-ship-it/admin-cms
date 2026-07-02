import { Wrench, Building2, Cpu, Tags, FolderKanban, Newspaper, Video, GitBranch, Users, Flag } from "lucide-react";

// Maps entity slug -> icon component. Kept separate from the entity
// registry so lib/entities.ts stays server-safe (no client-only imports).
export const ENTITY_ICONS: Record<string, any> = {
  tools: Wrench,
  companies: Building2,
  models: Cpu,
  categories: Tags,
  collections: FolderKanban,
  news: Newspaper,
  videos: Video,
  repositories: GitBranch,
  users: Users,
  reports: Flag,
};
