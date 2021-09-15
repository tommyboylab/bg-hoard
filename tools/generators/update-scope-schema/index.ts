import { Tree, updateJson, formatFiles, readJson } from '@nrwl/devkit';

function getScopes(nxJson: any) {
  const projects: any[] = Object.values(nxJson.projects);
  const allScopes: string[] = projects
    .map((project) =>
      project.tags.filter((tag: string) => tag.startsWith('scope:'))
    )
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope: string) => scope.slice(6));
  return [...new Set(allScopes)];
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

function addScopeIfMissing(tree: Tree) {
  updateJson(tree, 'nx.json', (json) => {
    Object.keys(json.projects).forEach((projectName) => {
      if (
        !json.projects[projectName].tags.some((tag) => tag.startsWith('scope:'))
      ) {
        const scope = projectName.split('-')[0];
        json.projects[projectName].tags.push(`scope:${scope}`);
      }
    });
    return json;
  });
}

export default async function (tree: Tree) {
  const scopes = getScopes(readJson(tree, 'nx.json'));
  updateJson(tree, 'tools/generators/util-lib/schema.json', (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes.map((scope) => ({
      value: scope,
      label: scope,
    }));
    return schemaJson;
  });
  const content = tree.read('tools/generators/util-lib/index.ts', 'utf-8');
  const newContent = replaceScopes(content, scopes);
  tree.write('tools/generators/util-lib/index.ts', newContent);
  await addScopeIfMissing(tree)
  await formatFiles(tree);
}
