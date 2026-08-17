import type { Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth";
import { ResumeService } from "../services/resume.service";

const resumes = new ResumeService();

function serialize(resume: Awaited<ReturnType<ResumeService["create"]>>) {
  return { ...resume, resumeJson: resume.resumeJson as Record<string, unknown> };
}

export class ResumeController {
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const items = await resumes.list(req.currentUser!.id);
    res.json({ data: items.map(serialize) });
  }

  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    const resume = await resumes.get(req.params.id, req.currentUser!.id);
    if (!resume) { res.status(404).json({ error: "Resume not found" }); return; }
    res.json({ data: serialize(resume) });
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const resume = await resumes.create(req.currentUser!.id, req.body);
    res.status(201).json({ data: serialize(resume) });
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const resume = await resumes.update(req.params.id, req.currentUser!.id, req.body);
    if (!resume) { res.status(404).json({ error: "Resume not found" }); return; }
    res.json({ data: serialize(resume) });
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!await resumes.delete(req.params.id, req.currentUser!.id)) { res.status(404).json({ error: "Resume not found" }); return; }
    res.status(204).send();
  }
}
