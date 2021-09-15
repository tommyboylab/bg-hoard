import { Tree, updateJson, updateTs, readJson, formatFiles } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function (tree: Tree, schema: any) {
  await updateJson(tree, 'workspace.json', (workspaceJson) => {
  workspaceJson.defaultProject = 'api'
  return workspaceJson
  }

  const projectList = readJson(tree, 'nx.json', (nxJson) => {
  return getScopes(nxJson)
  }

  await updateJson(tree, '/tools/util-lib/schema.json', (schemaJson) => {
  schemaJson.properties.directory.items = projectList

  return schemaJson
  }

  await updateTs(tree, '/tools/util-lib/index.ts', (indexTs) => {
  return replaceScopes(indexTs)
  }

  await formatFiles(tree);

  function getScopes(nxJson: any) {
    const projects: any[] = Object.values(nxJson.projects);
    const allScopes: string[] = projects
      .map((project) =>
        project.tags
          // take only those that point to scope
          .filter((tag: string) => tag.startsWith('scope:'))
      )
      // flatten the array
      .reduce((acc, tags) => [...acc, ...tags], [])
      // remove prefix `scope:`
      .map((scope: string) => scope.slice(6));
    // remove duplicates
    return Array.from(new Set(allScopes));
  }

  function replaceScopes(content: string, scopes: string[]): string {
    const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
    const PATTERN = /interface Schema \{\n.*\n.*\n\}/gm;
    return content.replace(
      PATTERN,
      `const Schema = {
    name: string;
    directory: ${joinScopes};
  }`
    );
  }

  return () => {
    installPackagesTask(tree);
  };
}
