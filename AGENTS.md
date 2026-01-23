## Build & Run

**Run tests:**
```bash
npm test
```

**Run dev server:**
```bash
npm run dev
```
Opens http://localhost:5173 with live reload.

**Build for production:**
```bash
npm run build
```
Outputs to `dist/` directory.

## Validation

**Test coverage:** Run `npm test -- --run` to see all test results.
**Phase 1 MVP:** Open dev server and verify slide renders with theme.

## Operational Notes

**Phase 1 MVP Complete (v0.1.0):**
- 92 tests passing
- SlideRenderer generates complete HTML documents
- Example theme demonstrates color override pattern
- Title layout uses CSS Grid for vertical centering
