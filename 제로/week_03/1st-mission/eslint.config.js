import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
    },
    rules: {
      //사용 안 하는 변수 → 경고
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      //React 17+ 대응
      "react/react-in-jsx-scope": "off",

      // TS 쓰면 필요 없음
      "react/prop-types": "off",
    },
  },
];