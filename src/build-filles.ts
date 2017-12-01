import * as fs from 'mz/fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as glob from 'glob';

export class BuildFilles {
  constructor(
    private outputPath: string,
    private exceptFiles: string[],
  ) {}

  async removeOld(createdFiles): Promise<string[]> {
    const allFiles = glob.sync(path.resolve(this.outputPath, '**/*'));
    const filesForRemove = _
      .chain(allFiles)
      .difference(createdFiles)
      .filter((filepath) => {
        const basename = path.basename(filepath);
        return !_.includes(this.exceptFiles, basename);
      })
      .value();

    await this.deleteFiles(filesForRemove);
    return filesForRemove;
  }

  private async deleteFiles(files: string[]) {
    for(let i in files) {
      await fs.unlink(files[i]);
    }
  }
}