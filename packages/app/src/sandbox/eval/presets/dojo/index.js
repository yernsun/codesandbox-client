import { join, absolute } from 'common/utils/path';
import Preset from '../';

import typescriptTranspiler from '../../transpilers/typescript';
import rawTranspiler from '../../transpilers/raw';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';

export default function initialize() {
  const preset = new Preset(
    '@dojo/cli-create-app',
    ['ts', 'tsx', 'js', 'json'],
    {},
    {
      setup: async manager => {
        const stylesPath = absolute(join('src', 'main.css'));
        const tModule = await manager.resolveTranspiledModuleAsync(
          stylesPath,
          '/'
        );
        await tModule.transpile(manager);
        tModule.setIsEntry(true);
        tModule.evaluate(manager);
      },
    }
  );

  preset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: typescriptTranspiler },
  ]);

  preset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(module => /\.m\.css$/.test(module.path), [
    { transpiler: stylesTranspiler, options: { module: true } },
  ]);

  preset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
