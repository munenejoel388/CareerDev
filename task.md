# Local Preview Mode TODO

- [x] Review implementation plan and current auth/profile flow.
- [x] Update `AuthContext.tsx` for local registration, login, session restore, and offline/path-error fallback.
- [x] Add LocalStorage fallback behavior to `profiles.ts`.
- [x] Add LocalStorage fallback behavior to `careerAnalyses.ts`.
- [x] Enable login/register forms in local preview mode with informational banners.
- [x] Route dashboard, history, analysis, learning, and profile reset through fallback-aware services.
- [x] Run build verification.
- [x] Run lint verification. `oxlint` exits successfully with the existing Fast Refresh warning in `AuthContext.tsx`.
