import { Revision } from './models';
import type { IPage } from './models/Page';

// Wiki-style edit history for Page: every save snapshots the page's PRE-edit
// state (title + blocks, serialized into Revision.content as JSON — Revision
// predates the block system and stores a single string, so a full-layout
// snapshot per revision is what's saved rather than per-block diffing; see
// PROGRESS.md's "Reconcile with Revision model" note).
export async function snapshotPageRevision(page: IPage, editedBy: string, editSummary?: string) {
  const latest = await Revision.findOne({ contentType: 'page', contentId: page._id }).sort({ version: -1 });
  const version = (latest?.version ?? 0) + 1;

  await Revision.create({
    contentType: 'page',
    contentId: page._id,
    title: page.title,
    content: JSON.stringify(page.blocks),
    editedBy,
    editSummary,
    version,
  });
}
