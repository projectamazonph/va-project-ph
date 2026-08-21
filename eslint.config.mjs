import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["error", { "allow": ["warn", "error"] }],
    },
  },
  // Architectural rule: lesson pages must never compute money math.
  // ACOS / ROAS / CVR / break-even live in worksheets (M2+), not in the
  // read-and-tick slice. Forbidding the import makes that boundary
  // compile-time-enforced. See docs/62-adr-curriculum-content-model.md.
  {
    files: ["app/(app)/learn/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/metrics",
              message:
                "Lesson pages must not compute money math. Use a worksheet route (M2) for ACOS/ROAS.",
            },
          ],
        },
      ],
    },
  },
]);
