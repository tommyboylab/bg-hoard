import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

type Schema = {
name:string,
directory: 'store' | 'api' | 'shared',
}
export default async function (tree: Tree, schema:Schema) {
  await libraryGenerator(tree, { name: `util-${schema.name}`, directory: schema.directory, tags: `scope:${schema.directory}, type:util` });
  console.log(schema.name)
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
