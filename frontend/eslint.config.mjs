import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		"no-restricted-imports": "off",
		"@typescript-eslint/no-restricted-imports": [
  			"warn",
  			{
    			"name": "react-redux",
    			"importNames": ["useSelector", "useDispatch"],
  		  		"message": "Use typed hooks `useAppDispatch` and `useAppSelector` instead."
			}
		]
	}
];

export default eslintConfig;
