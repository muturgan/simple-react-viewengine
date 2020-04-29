import react, { createElement, ComponentClass } from 'react';
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


const engineFactory = (templateRoot: string) =>
{
   const templateDir = resolve(templateRoot);

   require('@babel/register')(
      Object.assign({only: ([] as string[]).concat(templateDir)}, engineOptions.babel)
   );

   return <P extends {}>(templateName: string, props: P) =>
   {
      const filePath = join(templateDir, templateName);

      let component: ComponentClass<P, {}> = require(filePath);
      // Transpiled ES6 may export components as { default: Component }
      component = 'default' in component ? component['default'] : component;

      const markup = '<!DOCTYPE html>' + renderToStaticMarkup(
         createElement(component, props),
      );

      return markup;
   };
};

export default engineFactory;
module.exports = engineFactory;
export const React = react;
