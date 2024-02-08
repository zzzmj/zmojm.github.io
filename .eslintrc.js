module.exports = {
    "extends": [
        // "react-app",
        // "react-app/jest",
        "eslint:recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
        "react/prop-types": "off",
        "prettier/prettier": ["error", {
            "endOfLine": "auto",
            "printWidth": 140,
            "tabWidth": 4,
            "semi": false,
            "singleQuote": true,
            "trailingComma": "es5",
            "bracketSpacing": true,
            "jsxBracketSameLine": false
        }],
        // "react/display-name": ["enable", { "ignoreTranspilerName": false }]
        "react/display-name": "off",
        "react/no-deprecated": "warn",
        "react/no-string-refs": "warn",
        // "no-unused-vars": "off",
        "no-unused-vars": "warn"
    },
    "env": {
        "es6": true,
        "browser": true,
        "commonjs": true,
        "node": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "globals": {
        "log": true
    }
}