const glob = require('glob');
const { transformFile } = require('@swc/core');
const fs = require('fs');
const path = require('path');

async function build() {
    try {
        const files = glob.sync('app/api/**/route.ts');

        // 修改导入路径，将 .ts 改为 .js
        const routesImports = files.map((file, index) => {
            const routePath = file
                .replace('app/api/', '')
                .replace('/route.ts', '');
            // 注意这里改用 .js 扩展名
            return `import * as route${index} from './${file.replace('.ts', '.js')}';\n`;
        }).join('');

        const routesMappings = files.map((file, index) => {
            const routePath = file
                .replace('app/api/', '')
                .replace('/route.ts', '');
            return `'${routePath}': route${index}`;
        }).join(',\n  ');

        const routesFileContent = `
${routesImports}

export const routes = {
  ${routesMappings}
};`;

        fs.writeFileSync('routes.generated.ts', routesFileContent);

        const { code } = await transformFile('worker.ts', {
            jsc: {
                parser: {
                    syntax: "typescript",
                    tsx: false,
                },
                target: "es2020",
            },
            module: {
                type: "es6",
            },
        });

        if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist');
        }

        fs.writeFileSync('dist/worker.js', code);

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();