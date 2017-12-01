import * as fs from 'mz/fs';
import * as path from 'path';
import * as _ from 'lodash';

export class BuildFilles {
  private oldFiles: string[];
  constructor(
    private outputPath: string,
    private exceptFiles: string[],
  ) {}

  async saveOld(): Promise<void> {
    this.oldFiles = await this.getFilesList(this.outputPath);
  }

  async compareAndRemoveOld(createdFiles): Promise<string[]> {
    const filesForRemove = _
      .chain(this.oldFiles)
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

  private async getFilesList(dir: string) {
    const result = [];
    const files = await fs.readdir(dir);
    for (let i in files){
      const name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
        const children = await this.getFilesList(name);
        result.push(...children);
      } else {
        result.push(name);
      }
    }
    return result;
  }
}