import { ResumeRepository, type ResumePayload, type ResumeRecord } from "../repositories/resume.repository";

export class ResumeService {
  constructor(private readonly resumes = new ResumeRepository()) {}

  list(userId: string) { return this.resumes.listByUserId(userId); }
  get(id: string, userId: string) { return this.resumes.findOwned(id, userId); }
  create(userId: string, payload: ResumePayload) { return this.resumes.create(userId, payload); }

  async update(id: string, userId: string, payload: Partial<ResumePayload>): Promise<ResumeRecord | null> {
    const current = await this.resumes.findOwned(id, userId);
    if (!current) return null;
    if (payload.resumeJson) await this.resumes.createVersion(id, current.resumeJson as Record<string, unknown>);
    return this.resumes.updateOwned(id, userId, payload);
  }

  delete(id: string, userId: string) { return this.resumes.deleteOwned(id, userId); }
}
