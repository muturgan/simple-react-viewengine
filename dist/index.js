"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { resolve, join } = require('path');
const engineOptions = {
    babel: {
        presets: [
            '@babel/preset-react',
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: 'current',
                    },
                },
            ],
        ],
        plugins: ['@babel/transform-flow-strip-types'],
    },
};
const engineFactory = (templateRoot) => {
    const templateDir = resolve(templateRoot);
    require('@babel/register')(Object.assign({ only: [].concat(templateDir) }, engineOptions.babel));
    return (templateName, props) => {
        const filePath = join(templateDir, templateName);
        let component = require(filePath);
        // Transpiled ES6 may export components as { default: Component }
        component = 'default' in component ? component['default'] : component;
        const markup = '<!DOCTYPE html>' + renderToStaticMarkup(createElement(component, props));
        return markup;
    };
};
exports.default = engineFactory;
module.exports = engineFactory;
