# Contribution Guide

Thank you for your interest in contributing to **Aviation Integration Service**!  
Please follow these rules to ensure quality and consistency in the project.

---

## Workflow

1. **Fork** the repository and clone your local copy.
2. Create a **branch** for your improvement or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make **small and descriptive commits** using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
   - Example:
     - `feat: add flights endpoint`
     - `fix: fix validation in airlines`
     - `docs: update README`
     - `chore: update dependencies`
     - Use `!` for breaking changes: `refactor!: remove backward compatibility`
4. Follow the branch naming convention:
   - `feature/` for new features.
   - `fix/` for bug fixes.
   - `docs/` for documentation.
   - `chore/` for minor or maintenance tasks.
   - `release/vX.Y.Z` to prepare a new release.
5. **Make a Pull Request to `develop`.**
   - Do not push changes directly to `master`.
6. Wait for review and make the suggested changes.
7. To **release a new production version:**
   - Create a `release/vX.Y.Z` branch from `develop` (choose the new version based on the changes).
   - Make a Pull Request from `release/vX.Y.Z` to `master`.  
     (Don’t forget to document changes in the PR.)
   - When merged, a `vX.Y.Z` tag will be generated automatically and the release will be deployed to production.
   - If you name the branch just `release/`, the system will automatically increment the last patch (e.g., from `v1.2.3` to `v1.2.4`).
8. Never upload your real `.env` file or credentials.

---

**Note:**  
Branch protection prevents direct push to `master` and requires PRs for any production changes. Deployment only runs when pushing a new tag starting with `v`.

---

## Code Style

- Use **TypeScript** and follow the repo’s folder architecture.
- Run `npm run lint` (if available) before committing.
- Use single quotes (`'`) and semicolons (`;`).
- Keep methods and files **small and well commented**.

---

## 🧪 Automated Testing

Before submitting a PR, make sure to:

- Run **all tests** with:

  ```bash
  make test
  ```

- Verify that there are no open handles or unclosed connections.
- If you added new endpoints or validations, include tests:
  - Unit tests (`/test/unit`)
  - Integration tests (`/test/integration`)

> ⚠️ PRs without new tests (when adding features) will be rejected.

---

## 🧼 Clean and Maintainable Code

- Avoid complex logic in controllers; delegate to services.
- Prefer pure and decoupled functions, easy to test.
- Add comments only if the code isn’t self-explanatory.
- Do not leave `console.log`; use `logger.debug/info/error`.

---

## Branch and Protection Policies

- **Direct push is not allowed** to `master` or protected branches (`master`, `develop`, `releases`).
- **All changes** in `master` require a Pull Request and approval from at least 1 reviewer.
- **All automated tests** must pass before merging.
- **Force-push (`--force`) or deleting protected branches is not allowed.**
- **To update your branch:** do a **rebase** or **merge** from `develop` before opening the PR to `master`.
- **Release branches:** use the pattern `release/vX.Y.Z` and open a PR to `master` for deployment.
- Only **tags** in the `vX.Y.Z` format trigger the production workflow.

---

## Pull Request Review

- PRs will be reviewed by at least one collaborator.
- **No changes will be accepted without clear justification or without automated tests (if applicable).**
- If your change breaks the tests, it will be rejected until fixed.
- If you add new endpoints (e.g. `/api/v1/airlines`), you **must** include:
  - Unit tests for the new controllers/services
  - Integration tests for the new endpoints
  - Documentation updates in `README.md` and `docs/API.md`

---

## Security

- Do not upload `.env` files or secrets.
- Use environment variables as per the `.env.example` template.

---

## Deployment Process

- **Automatic deploy (recommended):**

  - Production deployment is performed **only when creating a `vX.Y.Z` tag** in GitHub.
  - The recommended flow is:
    1. Work on feature branches and merge to `develop`.
    2. When ready for release, create a `release/vX.Y.Z` branch from `develop`.
    3. Open a Pull Request from `release/vX.Y.Z` to `master`.
    4. Once approved and merged to `master`, **create the tag** (`vX.Y.Z`) pointing to `master`.
    5. When the tag is pushed, **GitHub Actions automatically deploys** to Cloud Run using the `GCP_SA_KEY` secret.

- **Manual deploy (optional):**

  1. Get a service key (JSON) with `Cloud Run Admin`, `Storage Admin`, and `Cloud Build` permissions.
  2. Authenticate locally:
     ```bash
     gcloud auth activate-service-account --key-file gcp-key.json
     ```
  3. Launch the manual deploy:
     ```bash
     make deploy
     ```

- **Important:**  
  Do not deploy directly to production outside this flow.  
  The pipeline only runs for tags that follow the `v*` pattern (e.g., `v1.0.0`).

---

Thank you for helping to improve this project!
