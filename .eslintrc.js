module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": 0,
        "valid-jsdoc": 1,
        "default-case": 2,
        "no-fallthrough": 2,
        "camelcase": 2,
        "indent": [2, 4, {"SwitchCase": 1}],
        "no-unused-vars": 1,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};