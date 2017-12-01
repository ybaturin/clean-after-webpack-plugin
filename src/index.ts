import * as webpack from 'webpack';
import * as _ from 'lodash';
import * as path from 'path';
import chalk from 'chalk';
import { BuildFilles } from './build-filles';

interface Options {
  disabled: boolean;
  exceptFiles: string[];
}

const DEFAULT_OPTIONS = <Options> {
  disabled: false,
  exceptFiles: [],
};

class ClearAfterWebpackPlugin {
  private buildFiles: BuildFilles;
  private outputPath: string;

  constructor(private options: Options) {
    this.fillOptions(options);
  }

  apply(compiler: webpack.Compiler) {
    if (this.options.disabled) {
      return;
    }

    this.outputPath = compiler.options.output.path;
    this.buildFiles = new BuildFilles(this.outputPath, this.options.exceptFiles);
    compiler.plugin('before-compile', async (compilation, doneCallback) => {
      await this.buildFiles.saveOld();
      doneCallback();
    });
    compiler.plugin('done', async (compilation) => {
      const createdFiles = compilation.toJson().assets.map(asset => path.join(this.outputPath, asset.name));
      const removedFiles = await this.buildFiles.compareAndRemoveOld(createdFiles);
      this.reportDeletedFiles(removedFiles);
    });
  }

  private reportDeletedFiles(filesForRemove: string[]) {
    console.log(chalk.bgBlack('*************************'));
    if (filesForRemove.length > 0) {
      console.log(chalk.gray(`Delete old build files:`));
      filesForRemove.forEach((filepath: string) => {
        const relativePath = path.relative(this.outputPath, filepath);
        console.log(chalk.green(relativePath));
      });
    } else {
      console.log(chalk.green(`All files in build folder are actual`));
    }
    console.log(chalk.bgBlack('*************************'))
  }

  private fillOptions(options) {
    _.assignInWith(options, DEFAULT_OPTIONS, (value:any, defaultValue:any) => {
      return _.isUndefined(value) ? defaultValue : value;
    });
  }
}

module.exports = ClearAfterWebpackPlugin;
