Tryfind research workflow update

Install: bash workflow-feature/install.sh from /home/sheetal/librechat.
The installer requires debugfs, a read-only baked sandbox-rootfs.img, the supplied
source versions, and enough disk for one isolated root disk copy plus 8 GiB.
It stops before deployment if a requirement is missing. It does not download
LaTeX/LibreOffice packages or rebuild the code runner image. It builds the UI
in a separate container, preserves inline lab styles and prior assets, and
uses lab-data-guard for the LibreChat deployment.

Changes
- Runner output persistence includes .bib, .bst, .cls, .sty, .bbl, .bbx, .cbx,
  and Makefile. This fixes changes silently disappearing between executions.
- Latest chat copies take precedence over project masters. Newly generated
  artifacts no longer automatically overwrite project masters.
- Stored size/checksum, UTF-8, and ZIP integrity checks precede priming. If a
  chat copy fails and a master exists, use the master without deleting the
  chat record and return an explicit recovery/merge warning. A valid file can
  still contain incorrect prose/code; semantic corruption is not detectable
  by these checks. Other formats retain size/checksum checks.
- project_files save_chat transfers exact saved chat bytes with hash readback.
  It does not ask the model to regenerate complete file contents.
- research_files read_all extracts source text and DOCX text or PDF text in
  one tool call, reports unsupported files, and returns hashes. It uses a
  temporary result artifact to avoid stdout truncation. Maximum extracted
  text is 3 million characters; actual model context remains authoritative.
  Images/scanned PDFs and arbitrary data binaries need their own reader.
- research_files edit_text performs exact unique replacements against a known
  input hash, rejects overlap/stale hashes, checks LaTeX headings/labels by
  default, writes a new filename, and verifies output bytes. Existing DOCX
  editing continues through manuscript_word with tracked changes.
- Academic searches are not given an artificial per-prompt quota.
- Graph ceiling stays 50, not 50 API calls. At step 44 it asks the model to
  finish edits; from step 46 only research_files is exposed for verification,
  and from step 48 tools are removed for final delivery. Starting the phase
  before 48 accommodates alternating model/tool nodes. Completion is not
  guaranteed: unfinished work must be disclosed rather than called complete.
- Completed tools show Waiting for model response; active tools keep their
  action label. Recovery warnings are rendered in the response UI.

Tests
Local tests cover exact edits, unchanged original files, stale/overlapping
edit rejection, heading protection, path confinement, chat precedence,
corruption fallback warning, exact project byte transfer, integrity checks,
and status transitions. Deployment repeats tests and checks actual persisted
.bib/Makefile/.sty artifacts using a signed synthetic sandbox execution.
A real provider-driven manuscript run remains the post-install acceptance test.

Deployment rollback copies configuration only; user data is not backed up or
migrated. The new runtime disk is application code, not user file storage.
Avoid installing during an active generation because services are restarted.
